import { Router, Request, Response } from 'express';
import { TasksDomain } from '../domain/tasks.domain';
import {
  validateGetTasksMiddleware,
  validateCreateTaskMiddleware,
  validateUpdateTaskMiddleware,
  validateUpdateTaskParamsMiddleware,
  validateDeleteTaskParamsMiddleware,
} from '../validator';
import { handleResponse, HttpCode } from '@/helpers';
import { verifytoken } from '@/middleware/verifyToken/verifyToken.middleware';
import { CreateTaskDTO, UpdateTaskDTO } from '@/models/tasks/tasks.type';

export const TasksController = Router();

TasksController.get(
  '/',
  verifytoken,
  validateGetTasksMiddleware,
  async (req: Request, res: Response) => {
    console.log('entra en el metodo');
    const { page, limit, fieldName, fieldValue, fieldSort, valueSort }: any =
      req.validatedQuery;
    const tasksDomain = new TasksDomain();
    const tasks = await tasksDomain.getTasks(
      page,
      limit,
      fieldName,
      fieldValue,
      fieldSort,
      valueSort as 'ASC' | 'DESC'
    );
    handleResponse(res, HttpCode.OK, tasks);
  }
);

TasksController.post(
  '/',
  verifytoken,
  validateCreateTaskMiddleware,
  async (req: Request, res: Response) => {
    const tasksData: CreateTaskDTO = req.body;
    const tasksDomain = new TasksDomain();
    const newTask = await tasksDomain.createTask(tasksData);
    handleResponse(res, HttpCode.CREATED, newTask);
  }
);

TasksController.put(
  '/:id',
  verifytoken,
  validateUpdateTaskParamsMiddleware,
  validateUpdateTaskMiddleware,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const tasksData: UpdateTaskDTO = req.body;
    const tasksDomain = new TasksDomain();
    const updatedTask = await tasksDomain.updateTask(id, tasksData);
    handleResponse(res, HttpCode.OK, updatedTask);
  }
);

TasksController.delete(
  '/:id',
  verifytoken,
  validateDeleteTaskParamsMiddleware,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const tasksDomain = new TasksDomain();
    await tasksDomain.deleteTask(id);
    handleResponse(res, HttpCode.NO_CONTENT, null);
  }
);

TasksController.post(
  '/:id/complete',
  verifytoken,
  validateUpdateTaskParamsMiddleware,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const tasksDomain = new TasksDomain();
    const completedTask = await tasksDomain.completeTask(id);
    handleResponse(res, HttpCode.OK, completedTask);
  }
);

TasksController.post(
  '/:id/comments',
  verifytoken,
  validateUpdateTaskParamsMiddleware,
  async (req: Request, res: Response) => {
    const { id }: any = req.validatedParams;
    const taskCommentsData = req.body;
    const tasksDomain = new TasksDomain();
    try {
      const updatedTask = await tasksDomain.addCommentToTask(
        id,
        taskCommentsData
      );
      handleResponse(res, HttpCode.OK, updatedTask);
    } catch (error: any) {
      handleResponse(res, HttpCode.BAD_REQUEST, { message: error.message });
    }
  }
);
