import { NotificationsModel } from '@/models/notifications/notifications.model';
import { NotificationType } from '@/models/notifications/notifications.type';

export class NotificationsRepository {
  async findAllNotifications(userId: string): Promise<NotificationType[]> {
    const result = await NotificationsModel.findAll({
      where: { userId },
    });
    return result.map(
      notification => notification.toJSON() as NotificationType
    );
  }

  async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    const result = await NotificationsModel.update(
      { isRead: true },
      { where: { id: notificationId, userId } }
    );
    if (result[0] === 0) {
      return false;
    }
    return true;
  }
}
