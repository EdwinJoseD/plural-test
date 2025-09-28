import { Router } from 'express';
import { UserController } from './controller/user.controller';

export const UserRoutes = Router();

UserRoutes.use(UserController);
