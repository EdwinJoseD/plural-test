import { Op, fn, col, literal, QueryTypes } from 'sequelize';
import { TasksModel } from '@/models/tasks/tasks.model';
import { ProjectsModel } from '@/models/projects/projects.model';
import { UserModel } from '@/models/users/user.models';
import { TimeEntriesModel } from '@/models/timeEntries/timeEntries.model';
import { TaskCommentsModel } from '@/models/taskComments/taskComments.model';
import { AttachmentsModel } from '@/models/attachments/attachments.model';
import { NotificationsModel } from '@/models/notifications/notifications.model';
import { sequelize } from '@/config/database/connection.sequelize';

export class DashboardRepository {
  // 1. REPORTE DE PRODUCTIVIDAD POR USUARIO
  async getUserProductivityReport(startDate?: Date, endDate?: Date) {
    const whereClause: any = {};
    if (startDate && endDate) {
      whereClause.created_at = {
        [Op.between]: [startDate, endDate],
      };
    }

    return await UserModel.findAll({
      attributes: [
        'id',
        'username',
        'first_name',
        'last_name',
        [fn('COUNT', col('assignedTasks.id')), 'totalTasks'],
        [
          literal(
            'COUNT(CASE WHEN "assignedTasks"."status" = \'completed\' THEN 1 END)'
          ),
          'completedTasks',
        ],
        [
          literal(
            'COUNT(CASE WHEN "assignedTasks"."status" = \'pending\' THEN 1 END)'
          ),
          'pendingTasks',
        ],
        [
          literal(
            'COUNT(CASE WHEN "assignedTasks"."status" = \'in_progress\' THEN 1 END)'
          ),
          'inProgressTasks',
        ],
        [
          literal('COALESCE(SUM("assignedTasks"."actual_hours"::DECIMAL), 0)'),
          'totalHoursWorked',
        ],
        [
          literal(
            'COALESCE(SUM("assignedTasks"."estimated_hours"::DECIMAL), 0)'
          ),
          'totalEstimatedHours',
        ],
        [
          literal(
            'ROUND(AVG(CASE WHEN "assignedTasks"."status" = \'completed\' AND "assignedTasks"."actual_hours" IS NOT NULL AND "assignedTasks"."estimated_hours" IS NOT NULL AND "assignedTasks"."estimated_hours" > 0 THEN ("assignedTasks"."actual_hours"::DECIMAL / "assignedTasks"."estimated_hours"::DECIMAL) * 100 END), 2)'
          ),
          'accuracyPercentage',
        ],
      ],
      include: [
        {
          model: TasksModel,
          as: 'assignedTasks',
          attributes: [],
          where: whereClause,
          required: false,
        },
      ],
      group: ['users.id'],
      order: [[literal('"completedTasks"'), 'DESC']],
    });
  }

  // 2. REPORTE DE ESTADO DE PROYECTOS
  async getProjectsStatusReport() {
    return await ProjectsModel.findAll({
      attributes: [
        'id',
        'name',
        'status',
        'start_date',
        'end_date',
        'budget',
        [literal('COUNT("tasks"."id")'), 'totalTasks'],
        [
          literal(
            'COUNT(CASE WHEN "tasks"."status" = \'completed\' THEN 1 END)'
          ),
          'completedTasks',
        ],
        [
          literal('COUNT(CASE WHEN "tasks"."status" = \'pending\' THEN 1 END)'),
          'pendingTasks',
        ],
        [
          literal(
            'COUNT(CASE WHEN "tasks"."status" = \'in_progress\' THEN 1 END)'
          ),
          'inProgressTasks',
        ],
        [
          literal('COALESCE(SUM("tasks"."actual_hours"::DECIMAL), 0)'),
          'totalHoursSpent',
        ],
        [
          literal('COALESCE(SUM("tasks"."estimated_hours"::DECIMAL), 0)'),
          'totalEstimatedHours',
        ],
        [
          literal(
            'ROUND(CASE WHEN COUNT("tasks"."id") > 0 THEN (COUNT(CASE WHEN "tasks"."status" = \'completed\' THEN 1 END)::DECIMAL / COUNT("tasks"."id")::DECIMAL) * 100 ELSE 0 END, 2)'
          ),
          'completionPercentage',
        ],
      ],
      include: [
        {
          model: TasksModel,
          as: 'tasks',
          attributes: [],
          required: false,
        },
        {
          model: UserModel,
          as: 'owner',
          attributes: ['username', 'first_name', 'last_name'],
        },
      ],
      group: ['projects.id', 'owner.id'],
      order: [['created_at', 'DESC']],
    });
  }

  // 3. REPORTE DE TAREAS POR PRIORIDAD Y ESTADO
  async getTasksPriorityReport(projectId?: string) {
    const whereClause: any = {};
    if (projectId) {
      whereClause.project_id = projectId;
    }

    return await TasksModel.findAll({
      attributes: [
        'priority',
        'status',
        [fn('COUNT', col('id')), 'count'],
        [fn('AVG', col('actual_hours')), 'avgHours'],
        [fn('SUM', col('actual_hours')), 'totalHours'],
      ],
      where: whereClause,
      group: ['priority', 'status'],
      order: [
        ['priority', 'ASC'],
        ['status', 'ASC'],
      ],
    });
  }

  // 4. REPORTE DE TIEMPO TRABAJADO POR PERIODO
  async getTimeTrackingReport(
    userId?: string,
    startDate?: Date,
    endDate?: Date
  ) {
    let filters = [];
    let params: any = {};

    if (userId) {
      filters.push('te.user_id = :userId');
      params.userId = userId;
    }

    if (startDate && endDate) {
      filters.push('te.start_time BETWEEN :startDate AND :endDate');
      params.startDate = startDate;
      params.endDate = endDate;
    }

    const whereClause =
      filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

    const query = `
      SELECT 
        DATE(te.start_time) as "workDate",
        u.id as "userId",
        u.username,
        u.first_name as "firstName",
        u.last_name as "lastName",
        t.id as "taskId",
        t.title as "taskTitle",
        t.priority as "taskPriority",
        p.id as "projectId",
        p.name as "projectName",
        COALESCE(SUM(te.hours_logged), 0) as "totalHours",
        COUNT(te.id) as "totalEntries",
        STRING_AGG(DISTINCT te.description, '; ') as "descriptions"
      FROM time_entries te
      LEFT JOIN users u ON te.user_id = u.id
      LEFT JOIN tasks t ON te.task_id = t.id
      LEFT JOIN projects p ON t.project_id = p.id
      ${whereClause ? whereClause : ''}
      GROUP BY 
        DATE(te.start_time),
        u.id, u.username, u.first_name, u.last_name,
        t.id, t.title, t.priority,
        p.id, p.name
      ORDER BY "workDate" DESC, "totalHours" DESC
    `;

    return await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: params,
    });
  }

  // 5. REPORTE DE TAREAS VENCIDAS
  async getOverdueTasksReport() {
    return await TasksModel.findAll({
      where: {
        dueDate: {
          [Op.lt]: new Date(),
        },
        status: {
          [Op.notIn]: ['completed', 'cancelled'],
        },
      },
      include: [
        {
          model: UserModel,
          as: 'assignee',
          attributes: ['username', 'first_name', 'last_name', 'email'],
        },
        {
          model: ProjectsModel,
          as: 'project',
          attributes: ['name', 'status'],
        },
      ],
      order: [['due_date', 'ASC']],
    });
  }

  // 6. REPORTE DE ACTIVIDAD POR PROYECTO (últimos 30 días)
  async getProjectActivityReport(projectId: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const tasks = await TasksModel.findAll({
      where: { projectId: projectId },
      include: [
        {
          model: UserModel,
          as: 'assignee',
          attributes: ['username', 'first_name', 'last_name'],
        },
      ],
    });

    const comments = await TaskCommentsModel.count({
      include: [
        {
          model: TasksModel,
          as: 'task',
          where: { project_id: projectId },
          attributes: [],
        },
      ],
      where: {
        createdAt: {
          [Op.gte]: thirtyDaysAgo,
        },
      },
    });

    const attachments = await AttachmentsModel.count({
      include: [
        {
          model: TasksModel,
          as: 'task',
          where: { project_id: projectId },
          attributes: [],
        },
      ],
      where: {
        createdAt: {
          [Op.gte]: thirtyDaysAgo,
        },
      },
    });

    return {
      tasks,
      recentComments: comments,
      recentAttachments: attachments,
    };
  }

  // 7. REPORTE DE EFICIENCIA (Estimado vs Real)
  async getEfficiencyReport(userId?: string, projectId?: string) {
    const whereClause: any = {
      actual_hours: { [Op.not]: null },
      estimated_hours: { [Op.not]: null },
      status: 'completed',
    };

    if (userId) whereClause.assigned_to = userId;
    if (projectId) whereClause.project_id = projectId;

    return await TasksModel.findAll({
      attributes: [
        'id',
        'title',
        'estimated_hours',
        'actual_hours',
        [
          literal(
            'ROUND((actual_hours::float / estimated_hours::float) * 100, 2)'
          ),
          'efficiencyPercentage',
        ],
        [literal('(actual_hours - estimated_hours)'), 'hoursDifference'],
      ],
      include: [
        {
          model: UserModel,
          as: 'assignee',
          attributes: ['username', 'first_name', 'last_name'],
        },
        {
          model: ProjectsModel,
          as: 'project',
          attributes: ['name'],
        },
      ],
      where: whereClause,
      order: [['completed_at', 'DESC']],
    });
  }

  // 8. REPORTE DE CARGA DE TRABAJO POR USUARIO
  async getWorkloadReport() {
    const query = `
      SELECT 
        u.id,
        u.username,
        u.first_name as "firstName",
        u.last_name as "lastName",
        COUNT(CASE WHEN t.status = 'pending' THEN 1 END) as "pendingTasks",
        COUNT(CASE WHEN t.status = 'in_progress' THEN 1 END) as "activeTasks",
        COALESCE(SUM(
          CASE 
            WHEN t.status IN ('pending', 'in_progress') 
            THEN t.estimated_hours 
            ELSE 0 
          END
        ), 0) as "estimatedHoursRemaining",
        COUNT(
          CASE 
            WHEN t.due_date < NOW() 
            AND t.status NOT IN ('completed', 'cancelled') 
            THEN 1 
          END
        ) as "overdueTasks"
      FROM users u
      LEFT JOIN tasks t ON u.id = t.assigned_to
      WHERE u.is_active = true
      GROUP BY u.id, u.username, u.first_name, u.last_name
      ORDER BY "activeTasks" DESC, "pendingTasks" DESC
    `;

    return await sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
  }

  // 9. REPORTE DE NOTIFICACIONES NO LEÍDAS
  async getUnreadNotificationsReport() {
    return await NotificationsModel.findAll({
      attributes: ['type', [fn('COUNT', col('notifications.id')), 'count']],
      where: {
        isRead: false,
      },
      include: [
        {
          model: UserModel,
          as: 'user',
          attributes: ['username', 'first_name', 'last_name'],
        },
      ],
      group: ['type', 'user.id'],
      order: [[literal('count'), 'DESC']],
    });
  }

  // 10. REPORTE RESUMEN DEL DASHBOARD
  async getDashboardSummary(userId?: string) {
    const userFilter = userId ? { assigned_to: userId } : {};

    const totalTasks = await TasksModel.count({ where: userFilter });
    const completedTasks = await TasksModel.count({
      where: { ...userFilter, status: 'completed' },
    });
    const pendingTasks = await TasksModel.count({
      where: { ...userFilter, status: 'pending' },
    });
    const inProgressTasks = await TasksModel.count({
      where: { ...userFilter, status: 'in_progress' },
    });

    const overdueTasks = await TasksModel.count({
      where: {
        ...userFilter,
        dueDate: { [Op.lt]: new Date() },
        status: { [Op.notIn]: ['completed', 'cancelled'] },
      },
    });

    const activeProjects = await ProjectsModel.count({
      where: { status: 'active' },
    });

    const totalUsers = await UserModel.count({
      where: { isActive: true },
    });

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueTasks,
      activeProjects,
      totalUsers,
      completionRate:
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    };
  }

  // 11. REPORTE DE TAREAS POR FECHA DE CREACIÓN (Gráfico temporal)
  async getTasksTimelineReport(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const query = `
      SELECT 
        DATE(created_at) as "date",
        COUNT(id) as "tasksCreated",
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as "tasksCompleted"
      FROM tasks
      WHERE created_at >= :startDate
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at) ASC
    `;

    return await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: { startDate },
    });
  }

  // 12. REPORTE DE ARCHIVOS ADJUNTOS POR PROYECTO
  async getAttachmentsReport(projectId?: string) {
    const includeWhere: any = {};
    if (projectId) includeWhere.project_id = projectId;

    return await AttachmentsModel.findAll({
      attributes: [
        'id',
        'original_name',
        'mime_type',
        'file_size',
        'created_at',
      ],
      include: [
        {
          model: TasksModel,
          as: 'task',
          attributes: ['title'],
          where: includeWhere,
          include: [
            {
              model: ProjectsModel,
              as: 'project',
              attributes: ['name'],
            },
          ],
        },
        {
          model: UserModel,
          as: 'uploader',
          attributes: ['username', 'first_name', 'last_name'],
        },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  // 13. REPORTE DE LINEA DE TIEMPO DE PROYECTOS
  async getProjectTimelineReport() {
    return await ProjectsModel.findAll({
      attributes: [
        'id',
        'name',
        'start_date',
        'end_date',
        'status',
        [fn('COUNT', col('tasks.id')), 'totalTasks'],
        [
          literal(
            'COUNT(CASE WHEN "tasks"."status" = \'completed\' THEN 1 END)'
          ),
          'completedTasks',
        ],
      ],
      include: [
        {
          model: TasksModel,
          as: 'tasks',
          attributes: [],
          required: false,
        },
      ],
      group: ['projects.id'],
      order: [['start_date', 'ASC']],
    });
  }

  async getAllTasks() {
    const tasks = await TasksModel.findAll();
    return tasks.map(task => task.toJSON());
  }

  async getProjectStatisticsReport(
    projectId?: string,
    includeInactive = false
  ) {
    let projectFilter = '';
    let params: any = {};

    if (projectId) {
      projectFilter = 'AND p.id = :projectId';
      params.projectId = projectId;
    }

    if (!includeInactive) {
      projectFilter += " AND p.status != 'archived'";
    }

    const query = `
    SELECT 
      p.id,
      p.name as "projectName",
      p.status as "projectStatus",
      p.start_date as "startDate",
      p.end_date as "endDate",
      p.budget,
      p.created_at as "createdAt",
      
      -- Información del owner
      u.username as "ownerUsername",
      u.first_name as "ownerFirstName",
      u.last_name as "ownerLastName",
      
      -- Estadísticas de tareas
      COUNT(t.id) as "totalTasks",
      COUNT(CASE WHEN t.status = 'pending' THEN 1 END) as "pendingTasks",
      COUNT(CASE WHEN t.status = 'in_progress' THEN 1 END) as "inProgressTasks", 
      COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as "completedTasks",
      COUNT(CASE WHEN t.status = 'cancelled' THEN 1 END) as "cancelledTasks",
      
      -- Estadísticas de tiempo
      COALESCE(SUM(t.estimated_hours), 0) as "totalEstimatedHours",
      COALESCE(SUM(t.actual_hours), 0) as "totalActualHours",
      COALESCE(SUM(CASE WHEN t.status = 'completed' THEN t.actual_hours END), 0) as "completedActualHours",
      COALESCE(SUM(CASE WHEN t.status IN ('pending', 'in_progress') THEN t.estimated_hours END), 0) as "remainingEstimatedHours",
      
      -- Estadísticas de prioridad
      COUNT(CASE WHEN t.priority = 'low' THEN 1 END) as "lowPriorityTasks",
      COUNT(CASE WHEN t.priority = 'medium' THEN 1 END) as "mediumPriorityTasks",
      COUNT(CASE WHEN t.priority = 'high' THEN 1 END) as "highPriorityTasks",
      COUNT(CASE WHEN t.priority = 'urgent' THEN 1 END) as "urgentPriorityTasks",
      
      -- Tareas vencidas
      COUNT(CASE WHEN t.due_date < NOW() AND t.status NOT IN ('completed', 'cancelled') THEN 1 END) as "overdueTasks",
      
      -- Progreso y métricas
      ROUND(
        CASE 
          WHEN COUNT(t.id) > 0 
          THEN (COUNT(CASE WHEN t.status = 'completed' THEN 1 END)::NUMERIC / COUNT(t.id)::NUMERIC) * 100 
          ELSE 0 
        END, 2
      ) as "completionPercentage",
      
      ROUND(
        CASE 
          WHEN SUM(t.estimated_hours) > 0 
          THEN (SUM(CASE WHEN t.status = 'completed' THEN t.actual_hours END)::NUMERIC / SUM(t.estimated_hours)::NUMERIC) * 100 
          ELSE 0 
        END, 2
      ) as "timeCompletionPercentage",
      
      -- Eficiencia (tiempo real vs estimado para tareas completadas)
      ROUND(
        CASE 
          WHEN SUM(CASE WHEN t.status = 'completed' THEN t.estimated_hours END) > 0 
          THEN (SUM(CASE WHEN t.status = 'completed' THEN t.actual_hours END)::NUMERIC / 
                SUM(CASE WHEN t.status = 'completed' THEN t.estimated_hours END)::NUMERIC) * 100 
          ELSE 0 
        END, 2
      ) as "efficiencyPercentage",
      
      -- Miembros del equipo
      COUNT(DISTINCT t.assigned_to) as "teamMembersCount",
      COUNT(DISTINCT t.created_by) as "contributorsCount",
      
      -- Actividad reciente (últimos 7 días)
      COUNT(CASE WHEN t.updated_at >= NOW() - INTERVAL '7 days' THEN 1 END) as "recentActivity",
      COUNT(CASE WHEN t.completed_at >= NOW() - INTERVAL '7 days' THEN 1 END) as "recentCompletions",
      
      -- Duración del proyecto
      CASE 
        WHEN p.start_date IS NOT NULL AND p.end_date IS NOT NULL 
        THEN EXTRACT(DAYS FROM p.end_date - p.start_date)
        WHEN p.start_date IS NOT NULL 
        THEN EXTRACT(DAYS FROM NOW() - p.start_date)
        ELSE NULL 
      END as "projectDurationDays",
      
      -- Estado del presupuesto (si hay tareas con horas)
      CASE 
        WHEN p.budget IS NOT NULL AND SUM(t.actual_hours) > 0
        THEN ROUND((SUM(t.actual_hours) * 50)::NUMERIC, 2) -- Asumiendo $50/hora como ejemplo
        ELSE NULL 
      END as "estimatedCostSpent"
      
    FROM projects p
    LEFT JOIN users u ON p.owner_id = u.id
    LEFT JOIN tasks t ON p.id = t.project_id
    WHERE 1=1 ${projectFilter}
    GROUP BY 
      p.id, p.name, p.status, p.start_date, p.end_date, p.budget, p.created_at,
      u.username, u.first_name, u.last_name
    ORDER BY 
      CASE p.status 
        WHEN 'active' THEN 1 
        WHEN 'completed' THEN 2 
        WHEN 'archived' THEN 3 
        WHEN 'cancelled' THEN 4 
      END,
      "completionPercentage" DESC,
      p.created_at DESC
  `;

    return await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: params,
    });
  }
}
