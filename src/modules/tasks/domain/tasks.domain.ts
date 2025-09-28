import { mapperGeneric } from '@/helpers/mapper/mapper.helper';
import { logger } from '@/config/logger/logger';
import { ITasksDomain } from './tasks.interface.domain';
import { TasksRepository } from '../repository/tasks.repository';
import { AppError, ResponsePaginated } from '@/helpers';
import {
  CreateTaskDTO,
  TaskStatus,
  TasksType,
  UpdateTaskDTO,
} from '@/models/tasks/tasks.type';
import { ProjectsDomain } from '@/modules/projects/domain/projects.domain';
import { UserDomain } from '@/modules/users/domain/user.domain';
import { TaskCommentsDomain } from '@/modules/taskComments/domain/taskComments.domain';
import { CreateTaskCommentDTO } from '@/models/taskComments/taskComments.type';

export class TasksDomain implements ITasksDomain {
  private readonly repository: TasksRepository;
  constructor() {
    this.repository = new TasksRepository();
  }

  async getTasks(
    page: number = 1,
    limit: number = 10,
    fieldName?: keyof TasksType,
    fieldValue?: string,
    fieldSort?: keyof TasksType,
    valueSort?: 'ASC' | 'DESC'
  ): Promise<ResponsePaginated<TasksType>> {
    const tasks = await this.repository.getTasks(
      page,
      limit,
      fieldName,
      fieldValue,
      fieldSort,
      valueSort
    );
    if (tasks.count > 0) {
      return {
        currentPage: page,
        totalItems: tasks.count,
        totalPages: Math.ceil(tasks.count / limit),
        items: tasks.rows,
      };
    }
    return {
      currentPage: page,
      totalItems: 0,
      totalPages: 0,
      items: [],
    };
  }

  async createTask(taskData: CreateTaskDTO): Promise<TasksType> {
    const projectsDomain = new ProjectsDomain();
    const userDomain = new UserDomain();
    try {
      //validaciones por si no existen el proyecto o el usuario
      const project = await projectsDomain.getProjectById(taskData.projectId);
      if (!project) {
        throw new AppError({ message: 'Project not found' });
      }

      const user = await userDomain.getUserById(taskData.createdBy);
      if (!user) {
        throw new AppError({ message: 'User not found' });
      }

      if (taskData.assignedTo) {
        const assignedUser = await userDomain.getUserById(taskData.assignedTo);
        if (!assignedUser) {
          throw new AppError({ message: 'Assigned user not found' });
        }
      }

      const newTask = await this.repository.createTask(taskData);
      return newTask;
    } catch (error: any) {
      logger.error('[TasksDomain] Error creating task: %s', error.message);
      throw new AppError({ message: 'Error creating task' });
    }
  }

  async updateTask(id: string, taskData: UpdateTaskDTO): Promise<TasksType> {
    try {
      const existingTask = await this.repository.getTaskById(id);
      if (!existingTask) {
        throw new AppError({ message: 'Task not found' });
      }

      // Si se está actualizando el projectId, verificar que el nuevo proyecto exista
      if (taskData.projectId) {
        const projectsDomain = new ProjectsDomain();
        const project = await projectsDomain.getProjectById(taskData.projectId);
        if (!project) {
          throw new AppError({ message: 'Project not found' });
        }
      }

      // Si se está actualizando el assignedTo, verificar que el usuario exista
      if (taskData.assignedTo) {
        const userDomain = new UserDomain();
        const assignedUser = await userDomain.getUserById(taskData.assignedTo);
        if (!assignedUser) {
          throw new AppError({ message: 'Assigned user not found' });
        }
      }

      const updatedTask = await this.repository.updateTask(id, taskData);
      return updatedTask;
    } catch (error: any) {
      logger.error('[TasksDomain] Error updating task: %s', error.message);
      throw new AppError({ message: 'Error updating task' });
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      const existingTask = await this.repository.getTaskById(id);
      if (!existingTask) {
        throw new AppError({ message: 'Task not found' });
      }
      const result = await this.repository.deleteTask(id);
      if (!result) {
        throw new AppError({ message: 'Error deleting task' });
      }
    } catch (error: any) {
      logger.error('[TasksDomain] Error deleting task: %s', error.message);
      throw new AppError({ message: 'Error deleting task' });
    }
  }

  async completeTask(id: string): Promise<TasksType> {
    try {
      const existingTask = await this.repository.getTaskById(id);
      if (!existingTask) {
        throw new AppError({ message: 'Task not found' });
      }
      if (existingTask.status === 'completed') {
        throw new AppError({ message: 'Task is already completed' });
      }
      const updatedTask = await this.repository.updateTask(id, {
        status: TaskStatus.COMPLETED,
      });
      return updatedTask;
    } catch (error: any) {
      logger.error('[TasksDomain] Error completing task: %s', error.message);
      throw new AppError({ message: 'Error completing task' });
    }
  }

  async getTaskById(id: string): Promise<TasksType | null> {
    try {
      const task = await this.repository.getTaskById(id);
      return task;
    } catch (error: any) {
      logger.error('[TasksDomain] Error retrieving task: %s', error.message);
      throw new AppError({ message: 'Error retrieving task' });
    }
  }

  async addCommentToTask(
    id: string,
    comment: CreateTaskCommentDTO
  ): Promise<string> {
    const taskCommentsDomain = new TaskCommentsDomain();
    try {
      const existingTask = await this.repository.getTaskById(id);
      if (!existingTask) {
        throw new AppError({ message: 'Task not found' });
      }
      const newComment = await taskCommentsDomain.createComment({
        taskId: id,
        userId: comment.userId,
        content: comment.content,
      });
      return 'Comment added with ID: ' + newComment.id;
    } catch (error: any) {
      logger.error(
        '[TasksDomain] Error adding comment to task: %s',
        error.message
      );
      throw new AppError({ message: 'Error adding comment to task' });
    }
  }
}
