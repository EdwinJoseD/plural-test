import { describe, jest, it, expect, beforeEach } from '@jest/globals';
import { TasksRepository } from './tasks.repository';
import { TasksModel } from '@/models/tasks/tasks.model';
import { Op } from 'sequelize';

describe('should validate Tasks Repository', () => {
  const tasksRepository = new TasksRepository();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should validate find all tasks', async () => {
    const mockTasks = [
      { id: '1', title: 'Task 1', description: 'Description 1' },
      { id: '2', title: 'Task 2', description: 'Description 2' },
    ];

    const findAllMock = jest
      .spyOn(TasksModel, 'findAndCountAll')
      .mockResolvedValue({
        rows: mockTasks.map(task => ({ dataValues: task })),
        count: mockTasks.length,
      } as any);

    const result = await tasksRepository.getTasks(
      1,
      10,
      'description',
      'Description',
      'title',
      'ASC'
    );

    expect(result).toEqual({
      count: mockTasks.length,
      rows: mockTasks.map(task => task),
    });
    expect(findAllMock).toHaveBeenCalled();
  });

  it('should validate createTask method', async () => {
    const taskData = { title: 'New Task', description: 'New Description' };
    const mockCreatedTask = { id: '1', ...taskData };

    const createMock = jest
      .spyOn(TasksModel, 'create')
      .mockResolvedValue({ dataValues: mockCreatedTask } as any);
    const result = await tasksRepository.createTask(taskData);

    expect(result).toEqual(mockCreatedTask);
    expect(createMock).toHaveBeenCalledWith(taskData);
  });

  it('should validate getTaskById method', async () => {
    const taskId = '1';
    const mockTask = {
      id: taskId,
      title: 'Task 1',
      description: 'Description 1',
    };

    const findByPkMock = jest
      .spyOn(TasksModel, 'findByPk')
      .mockResolvedValue({ dataValues: mockTask } as any);

    const result = await tasksRepository.getTaskById(taskId);

    expect(result).toEqual(mockTask);
    expect(findByPkMock).toHaveBeenCalledWith(taskId);
  });

  it('should validate updateTask method', async () => {
    const taskId = '1';
    const taskData = { title: 'Updated Task' };
    const mockTask = {
      id: taskId,
      title: 'Task 1',
      description: 'Description 1',
    };
    const updatedTask = {
      id: taskId,
      title: 'Updated Task',
      description: 'Description 1',
    };

    const getTaskByIdMock = jest
      .spyOn(tasksRepository, 'getTaskById')
      .mockResolvedValueOnce(mockTask)
      .mockResolvedValueOnce(updatedTask);

    const updateMock = jest
      .spyOn(TasksModel, 'update')
      .mockResolvedValue([1] as any);

    const result = await tasksRepository.updateTask(taskId, taskData);

    expect(result).toEqual(updatedTask);
    expect(getTaskByIdMock).toHaveBeenCalledWith(taskId);
    expect(updateMock).toHaveBeenCalledWith(taskData, {
      where: { id: taskId },
    });
  });

  it('should validate deleteTask method', async () => {
    const taskId = '1';

    const destroyMock = jest.spyOn(TasksModel, 'destroy').mockResolvedValue(1);

    const result = await tasksRepository.deleteTask(taskId);

    expect(result).toBe(true);
    expect(destroyMock).toHaveBeenCalledWith({ where: { id: taskId } });
  });

  it('should return false if no task deleted in deleteTask method', async () => {
    const taskId = 'nonExistingId';

    const destroyMock = jest.spyOn(TasksModel, 'destroy').mockResolvedValue(0);

    const result = await tasksRepository.deleteTask(taskId);

    expect(result).toBe(false);
    expect(destroyMock).toHaveBeenCalledWith({ where: { id: taskId } });
  });
});
