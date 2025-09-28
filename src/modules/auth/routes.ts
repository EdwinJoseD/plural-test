import { Router } from 'express';
import { AuthController } from './controller/auth.controller';

export const AuthRoutes = Router();

AuthRoutes.use(AuthController);
