import { Router } from 'express';
import { NotificationsController } from './controller/notifications.controller';

export const NotificationsRoutes = Router();

NotificationsRoutes.use(NotificationsController);
