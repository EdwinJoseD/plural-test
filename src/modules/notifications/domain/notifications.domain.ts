import { NotificationsRepository } from '../repository/notifications.repository';
import { AppError } from '@/helpers';
import { logger } from '@/config/logger/logger';
import { NotificationType } from '@/models/notifications/notifications.type';

export class NotificationsDomain {
  private readonly repository: NotificationsRepository;
  constructor() {
    this.repository = new NotificationsRepository();
  }

  async getAllNotifications(userId: string): Promise<NotificationType[]> {
    try {
      const notifications = await this.repository.findAllNotifications(userId);
      return notifications;
    } catch (error: any) {
      logger.error('Error fetching notifications %s', error.message);
      throw new AppError({ message: 'Error fetching notifications' });
    }
  }

  async markNotificationAsRead(
    notificationId: string,
    userId: string
  ): Promise<string> {
    try {
      const result = await this.repository.markAsRead(notificationId, userId);
      if (!result) {
        return 'Notification not found or already read';
      }
      return 'Notification marked as read successfully';
    } catch (error: any) {
      logger.error('Error marking notification as read %s', error.message);
      throw new AppError({ message: 'Error marking notification as read' });
    }
  }
}
