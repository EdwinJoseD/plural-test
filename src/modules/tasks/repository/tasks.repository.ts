import { TasksModel } from '@/models/tasks/tasks.model';
import { CreateTaskDTO, TasksType } from '@/models/tasks/tasks.type';
import { Op } from 'sequelize';

export class TasksRepository {
  async getTasks(
    page: number,
    limit: number,
    fieldName?: keyof TasksType,
    fieldValue?: string,
    fieldSort?: keyof TasksType,
    valueSort?: 'ASC' | 'DESC'
  ): Promise<{ rows: TasksType[]; count: number }> {
    const offset = (page - 1) * limit;

    const whereClause =
      fieldName && fieldValue
        ? { [fieldName]: { [Op.iLike]: `%${fieldValue}%` } }
        : {};

    const orderClause = fieldSort
      ? ([[fieldSort, valueSort]] as [string, 'ASC' | 'DESC'][])
      : [];
    const result = await TasksModel.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: orderClause,
    });

    return {
      rows: result.rows.map(item => item.dataValues),
      count: result.count,
    };
  }

  async createTask(taskData: CreateTaskDTO): Promise<TasksType> {
    const newTask = await TasksModel.create(taskData);
    return newTask.dataValues;
  }

  async getTaskById(id: string): Promise<TasksType | null> {
    const task = await TasksModel.findByPk(id);
    return task ? task.dataValues : null;
  }

  async updateTask(
    id: string,
    taskData: Partial<CreateTaskDTO>
  ): Promise<TasksType | null> {
    const task = await this.getTaskById(id);
    if (!task) {
      return null;
    }
    await TasksModel.update(taskData, { where: { id } });
    const updatedTask = await this.getTaskById(id);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    return await TasksModel.destroy({ where: { id } }).then(
      deletedCount => deletedCount > 0
    );
  }
}
