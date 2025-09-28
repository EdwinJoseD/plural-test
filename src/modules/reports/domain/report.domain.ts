import { ImportRepository } from '../repository/import.repository';
import { IReportDomain } from './report.interface.domain';
import { AppError } from '@/helpers';
import { logger } from '@/config/logger/logger';
import { TaskPriority, TaskStatus, TasksType } from '@/models/tasks/tasks.type';
import { Readable } from 'stream';
import csv from 'csv-parser';
import { DashboardRepository } from '../repository/dashboard.repository';

export class ReportDomain implements IReportDomain {
  private readonly importRepository: ImportRepository;
  private readonly dashboardRepository: DashboardRepository;
  constructor() {
    this.importRepository = new ImportRepository();
    this.dashboardRepository = new DashboardRepository();
  }

  async importTasks(file: Buffer | undefined): Promise<any> {
    const errors: string[] = [];
    const tasksToImport: Partial<TasksType>[] = [];
    let rowNumber = 1; // Para tracking de errores
    try {
      const stream = Readable.from(file?.toString());

      // Procesar CSV
      await new Promise<void>((resolve, reject) => {
        stream
          .pipe(csv())
          .on('data', row => {
            rowNumber++;
            const processedTask = this.processTaskData(row);
            if (processedTask) {
              tasksToImport.push(processedTask);
            } else if (row.title) {
              // Si tiene título pero falló el procesamiento
              errors.push(`Fila ${rowNumber}: Error procesando datos`);
            }
          })
          .on('error', error => {
            reject(new Error(`Error leyendo CSV: ${error.message}`));
          })
          .on('end', () => {
            resolve();
          });
      });

      if (tasksToImport.length === 0) {
        return {
          success: false,
          imported: 0,
          failed: 0,
          errors: ['No se encontraron tareas válidas para importar'],
          message: 'No hay datos válidos en el archivo CSV',
        };
      }
      // Importar en lotes para mejor rendimiento
      const batchSize = 100;
      let imported = 0;
      let failed = 0;

      for (let i = 0; i < tasksToImport.length; i += batchSize) {
        const batch = tasksToImport.slice(i, i + batchSize);

        try {
          const {
            validBatch,
            errors: batchErrors,
            failed: batchFailed,
          } = await this.validateBatch(batch);
          errors.push(...batchErrors);
          failed += batchFailed;

          if (validBatch.length === 0) {
            continue;
          }

          await this.importRepository.importTasks(validBatch as TasksType[]);
          imported += batch.length;
        } catch (error: any) {
          // Si el lote falla, intentar insertar una por una
          for (let j = 0; j < batch.length; j++) {
            const task = batch[j];
            try {
              const { validBatch, errors: singleErrors } =
                await this.validateBatch([task]);
              if (validBatch.length === 0) {
                errors.push(...singleErrors);
                failed++;
                continue;
              }
              await this.importRepository.importTasks(
                validBatch as TasksType[]
              );
              imported++;
            } catch (singleError: any) {
              failed++;
              const taskIndex = i + j + 1;
              errors.push(
                `Tarea ${taskIndex} (${task.title}): ${singleError.message}`
              );
            }
          }
        }
      }

      const totalProcessed = imported + failed;
      const success = imported > 0;

      return {
        success,
        imported,
        failed,
        errors,
        message: success
          ? `Se importaron ${imported} tareas exitosamente${failed > 0 ? ` (${failed} fallaron)` : ''}`
          : 'No se pudo importar ninguna tarea',
      };
    } catch (error: any) {
      return {
        success: false,
        imported: 0,
        failed: 0,
        errors: [error.message],
        message: 'Error durante la importación',
      };
    }
  }

  private async validateBatch(batch: Partial<TasksType>[]): Promise<{
    validBatch: Partial<TasksType>[];
    errors: string[];
    failed: number;
  }> {
    const errors: string[] = [];
    let failed = 0;
    const userIds = batch
      .map(task => task.assignedTo)
      .filter((id): id is string => !!id);
    const projectIds = batch
      .map(task => task.projectId)
      .filter((id): id is string => !!id);

    const [existingUsers, existingProjects] = await Promise.all([
      this.importRepository.findUserByIds(userIds),
      this.importRepository.findProjectByIds(projectIds),
    ]);

    const existingUserIds = new Set(
      existingUsers ? existingUsers.map(user => user.id) : []
    );
    const existingProjectIds = new Set(
      existingProjects ? existingProjects.map(proj => proj.id) : []
    );

    const validBatch = batch.filter(task => {
      let isValid = true;
      if (task.assignedTo && !existingUserIds.has(task.assignedTo)) {
        errors.push(
          `Tarea (${task.title}): Usuario asignado (${task.assignedTo}) no existe`
        );
        isValid = false;
      }
      if (task.projectId && !existingProjectIds.has(task.projectId)) {
        errors.push(
          `Tarea (${task.title}): Proyecto (${task.projectId}) no existe`
        );
        isValid = false;
      }
      return isValid;
    });

    if (validBatch.length === 0) {
      failed += batch.length;
      errors.push('Ninguna tarea es válida para importar');
    }
    return { validBatch, errors, failed };
  }

  private processTaskData(row: any): Partial<TasksType> | null {
    try {
      // Validar que el título esté presente (campo requerido)
      if (!row.title || row.title.trim() === '') {
        return null;
      }

      const taskData: Partial<TasksType> = {
        title: row.title.trim(),
      };

      // Procesar campos opcionales
      if (row.description && row.description.trim() !== '') {
        taskData.description = row.description.trim();
      }

      // Validar y asignar status
      if (row.status && Object.values(TaskStatus).includes(row.status)) {
        taskData.status = row.status;
      }

      // Validar y asignar priority
      if (row.priority && Object.values(TaskPriority).includes(row.priority)) {
        taskData.priority = row.priority;
      }

      // Procesar UUIDs
      if (row.project_id && row.project_id.trim() !== '') {
        if (this.isValidUUID(row.project_id.trim())) {
          taskData.projectId = row.project_id.trim();
        }
      }

      if (row.assigned_to && row.assigned_to.trim() !== '') {
        if (this.isValidUUID(row.assigned_to.trim())) {
          taskData.assignedTo = row.assigned_to.trim();
        }
      }

      if (row.created_by && row.created_by.trim() !== '') {
        if (this.isValidUUID(row.created_by.trim())) {
          taskData.createdBy = row.created_by.trim();
        }
      }

      // Procesar fechas
      if (row.due_date) {
        const dueDate = this.parseDate(row.due_date);
        if (dueDate) taskData.dueDate = dueDate;
      }

      if (row.completed_at) {
        const completedAt = this.parseDate(row.completed_at);
        if (completedAt) taskData.completedAt = completedAt;
      }

      // Procesar números decimales (FLOAT en lugar de INTEGER)
      if (row.estimated_hours && !isNaN(parseFloat(row.estimated_hours))) {
        taskData.estimatedHours = parseFloat(row.estimated_hours);
      }

      if (row.actual_hours && !isNaN(parseFloat(row.actual_hours))) {
        taskData.actualHours = parseFloat(row.actual_hours);
      }

      return taskData;
    } catch (error) {
      console.error('Error procesando fila:', error);
      return null;
    }
  }

  private isValidUUID(uuid: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  private parseDate(dateString: string): Date | null {
    if (!dateString || dateString.trim() === '') return null;

    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  }

  async getDashboardReport(userId: string): Promise<any> {
    try {
      const userProductivity =
        await this.dashboardRepository.getUserProductivityReport();
      const projectStatus =
        await this.dashboardRepository.getProjectsStatusReport();
      const tasksPriority =
        await this.dashboardRepository.getTasksPriorityReport();
      const timeTracking =
        await this.dashboardRepository.getTimeTrackingReport();
      const overdueTasks =
        await this.dashboardRepository.getOverdueTasksReport();
      const workLoad = await this.dashboardRepository.getWorkloadReport();
      const unreadNotifications =
        await this.dashboardRepository.getUnreadNotificationsReport();
      const dashboardSummary =
        await this.dashboardRepository.getDashboardSummary();
      const taskTimeline =
        await this.dashboardRepository.getTasksTimelineReport();

      return {
        userProductivity,
        projectStatus,
        tasksPriority,
        timeTracking,
        overdueTasks,
        workLoad,
        unreadNotifications,
        dashboardSummary,
        taskTimeline,
      };
    } catch (error: any) {
      logger.error('Error in getDashboardReport: %s', error.message);
      throw new AppError({ message: 'Error generating report' });
    }
  }

  async getUserRanking(): Promise<any> {
    try {
      const ranking =
        await this.dashboardRepository.getUserProductivityReport();
      return ranking;
    } catch (error: any) {
      logger.error('Error in getUserRanking: %s', error.message);
      throw new AppError({ message: 'Error generating user ranking report' });
    }
  }

  async getProjectTimeline(): Promise<any> {
    try {
      const timeline = await this.dashboardRepository.getTasksTimelineReport();
      return timeline;
    } catch (error: any) {
      logger.error('Error in getProjectTimeline: %s', error.message);
      throw new AppError({
        message: 'Error generating project timeline report',
      });
    }
  }

  async getWorkloadReport(): Promise<any> {
    try {
      const workload = await this.dashboardRepository.getWorkloadReport();
      return workload;
    } catch (error: any) {
      logger.error('Error in getWorkloadReport: %s', error.message);
      throw new AppError({ message: 'Error generating workload report' });
    }
  }

  async exportTasks(): Promise<string> {
    try {
      const tasks = await this.dashboardRepository.getAllTasks();
      if (tasks.length === 0) {
        throw new AppError({ message: 'No hay tareas para exportar' });
      }

      const headers = [
        'id',
        'title',
        'description',
        'status',
        'priority',
        'project_id',
        'assigned_to',
        'created_by',
        'due_date',
        'completed_at',
        'estimated_hours',
        'actual_hours',
        'created_at',
        'updated_at',
      ];

      const csvRows = [headers.join(',')];

      for (const task of tasks) {
        const row = [
          task.id,
          `"${(task.title || '').replace(/"/g, '""')}"`, // Escapar comillas dobles
          `"${(task.description || '').replace(/"/g, '""')}"`,
          task.status || '',
          task.priority || '',
          task.projectId || '',
          task.assignedTo || '',
          task.createdBy || '',
          task.dueDate ? task.dueDate.toISOString() : '',
          task.completedAt ? task.completedAt.toISOString() : '',
          task.estimatedHours != null ? task.estimatedHours : '',
          task.actualHours != null ? task.actualHours : '',
          task.createdAt ? task.createdAt.toISOString() : '',
          task.updatedAt ? task.updatedAt.toISOString() : '',
        ];
        csvRows.push(row.join(','));
      }

      const csvContent = csvRows.join('\n');
      return Buffer.from(csvContent).toString('base64');
    } catch (error: any) {
      logger.error('Error in exportTasks: %s', error.message);
      throw new AppError({ message: 'Error exporting tasks' });
    }
  }

  async getProjectsStatisticsReport(
    projectId?: string,
    includeInactive?: boolean
  ) {
    try {
      return this.dashboardRepository.getProjectStatisticsReport(
        projectId,
        includeInactive
      );
    } catch (error: any) {
      logger.error('Error in get ProjectsStatisticsReport %s', error.message);
      throw new AppError({
        message: 'Error generating projects statistics report',
      });
    }
  }
}
