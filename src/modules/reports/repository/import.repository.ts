import { ProjectsModel } from '@/models/projects/projects.model';
import { TasksModel } from '@/models/tasks/tasks.model';
import { CreateTaskDTO, TasksType } from '@/models/tasks/tasks.type';
import { UserModel } from '@/models/users/user.models';
import { UserType } from '@/models/users/users.type';
import { Op } from 'sequelize';

export class ImportRepository {
  async importTasks(tasks: CreateTaskDTO[]): Promise<TasksType[]> {
    const createdTasks = await TasksModel.bulkCreate(tasks, {
      validate: true,
      ignoreDuplicates: false,
    });
    return createdTasks.map(task => task.toJSON() as TasksType);
  }

  async findUserByIds(userId: string[]): Promise<UserType[] | null> {
    const result = await UserModel.findAll({
      where: {
        id: {
          [Op.in]: userId,
        },
      },
    });
    return result.map(user => user.toJSON() as UserType) || null;
  }

  async findProjectByIds(projectId: string[]): Promise<any[] | null> {
    const result = await ProjectsModel.findAll({
      where: {
        id: {
          [Op.in]: projectId,
        },
      },
    });
    return result.map(project => project.toJSON() as any) || null;
  }
}
