import {
  CreateTaskCommentDTO,
  TaskCommentType,
} from '@/models/taskComments/taskComments.type';
import { TaskCommentsRepository } from '../repository/taskComments.repository';
import { TasksDomain } from '@/modules/tasks/domain/tasks.domain';
import { UserDomain } from '@/modules/users/domain/user.domain';
import { AppError } from '@/helpers';
import { logger } from '@/config/logger/logger';

export class TaskCommentsDomain {
  private readonly repository: TaskCommentsRepository;
  constructor() {
    this.repository = new TaskCommentsRepository();
  }

  async getCommentsByTaskId(taskId: string): Promise<TaskCommentType[]> {
    return this.repository.getCommentsByTaskId(taskId);
  }

  async createComment(
    commentData: CreateTaskCommentDTO
  ): Promise<TaskCommentType> {
    const tasksDomain = new TasksDomain();
    const userDomain = new UserDomain();
    try {
      //validaciones por si no existen la tarea o el usuario
      const task = await tasksDomain.getTaskById(commentData.taskId);
      if (!task) {
        throw new AppError({ message: 'Task not found' });
      }

      const user = await userDomain.getUserById(commentData.userId);
      if (!user) {
        throw new AppError({ message: 'User not found' });
      }

      const newComment = await this.repository.createComment(commentData);
      return newComment;
    } catch (error: any) {
      logger.error(
        '[TaskCommentsDomain] Error creating comment: %s',
        error.message
      );
      throw new AppError({ message: 'Error creating comment' });
    }
  }
}
