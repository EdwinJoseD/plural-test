import { Router } from 'express';
import { TasksController } from './controller/tasks.controller';

export const TasksRoutes = Router();

TasksRoutes.use(TasksController);
