import { Router, Request, Response } from 'express';
import { NotificationsDomain } from '../domain/notifications.domain';
import { handleResponse, HttpCode } from '@/helpers';
import { verifytoken } from '@/middleware/verifyToken/verifyToken.middleware';
import { validateUpdateTaskParamsMiddleware } from '../validator';

export const NotificationsController = Router();

NotificationsController.get(
  '/',
  verifytoken,
  async (req: Request, res: Response) => {
    const { id } = req.body.user;
    const notificationsDomain = new NotificationsDomain();
    const notifications = await notificationsDomain.getAllNotifications(id);
    handleResponse(res, HttpCode.OK, notifications);
  }
);

NotificationsController.put(
  '/:id/read',
  verifytoken,
  validateUpdateTaskParamsMiddleware,
  async (req: Request, res: Response) => {
    const { id }: any = req.validatedParams;
    const { user } = req.body;
    const notificationsDomain = new NotificationsDomain();
    const result = await notificationsDomain.markNotificationAsRead(
      id,
      user.id
    );
    handleResponse(res, HttpCode.OK, result);
  }
);
