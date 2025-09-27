import { Router, Request, Response } from 'express';
import { AuthDomain } from '../domain/auth.domain';

export const AuthController = Router();

AuthController.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const authDomain = new AuthDomain();
  const token = await authDomain.login(email, password);
  res.json({ token });
});

AuthController.post('/register', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const authDomain = new AuthDomain();
  const userId = await authDomain.register(email, password);
  res.json({ userId });
});

AuthController.get('/profile', async (req: Request, res: Response) => {
  const { userId } = req.body;
  const authDomain = new AuthDomain();
  const profile = await authDomain.getProfile(userId);
  res.json({ profile });
});
