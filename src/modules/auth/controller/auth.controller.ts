import { Router, Request, Response } from 'express';
import { AuthDomain } from '../domain/auth.domain';
import { CreateUserDTO } from '@/models/users/users.type';
import {
  validateCreateUserMiddleware,
  validateLoginMiddleware,
} from '../validator';
import { handleResponse, HttpCode } from '@/helpers';
import { verifytoken } from '@/middleware/verifyToken/verifyToken.middleware';

export const AuthController = Router();

AuthController.post(
  '/login',
  validateLoginMiddleware,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const authDomain = new AuthDomain();
    const token = await authDomain.login(email, password);
    handleResponse(res, HttpCode.OK, token);
  }
);

AuthController.post(
  '/register',
  validateCreateUserMiddleware,
  async (req: Request, res: Response) => {
    const userData: CreateUserDTO = req.body;
    const authDomain = new AuthDomain();
    const userId = await authDomain.register(userData);
    handleResponse(res, HttpCode.CREATED, userId);
  }
);

AuthController.get(
  '/profile',
  verifytoken,
  async (req: Request, res: Response) => {
    const { userEmail } = req.body;
    const authDomain = new AuthDomain();
    const profile = await authDomain.getProfile(userEmail);
    handleResponse(res, HttpCode.OK, profile);
  }
);
