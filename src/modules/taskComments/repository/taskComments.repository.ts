import { TaskCommentsModel } from '@/models/taskComments/taskComments.model';
import {
  CreateTaskCommentDTO,
  TaskCommentType,
} from '@/models/taskComments/taskComments.type';

export class TaskCommentsRepository {
  async getCommentsByTaskId(taskId: string): Promise<TaskCommentType[]> {
    const result = await TaskCommentsModel.findAll({ where: { taskId } });
    return result ? result.map(comment => comment.get()) : [];
  }

  async createComment(
    commentData: CreateTaskCommentDTO
  ): Promise<TaskCommentType> {
    return (await TaskCommentsModel.create(commentData)).dataValues;
  }
}
