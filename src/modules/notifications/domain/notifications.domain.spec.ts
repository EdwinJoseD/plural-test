import { jest, describe, it, expect } from '@jest/globals';
import { NotificationsDomain } from './notifications.domain';
import { NotificationsRepository } from '../repository/notifications.repository';

describe('should validate notifications domain', () => {
  let notificationsDomain: NotificationsDomain;

  beforeEach(() => {
    notificationsDomain = new NotificationsDomain();
  });

  it('should validate get all notifications', async () => {
    jest
      .spyOn(NotificationsRepository.prototype, 'findAllNotifications')
      .mockResolvedValue([
        {
          id: '1231',
          message: '123',
          title: 'title',
          type: 'type',
          userId: '12321',
        },
      ]);

    const result = await notificationsDomain.getAllNotifications('12321');

    expect(result).toEqual([
      {
        id: '1231',
        message: '123',
        title: 'title',
        type: 'type',
        userId: '12321',
      },
    ]);
  });

  it('should validate mark notification as read', async () => {
    jest
      .spyOn(NotificationsRepository.prototype, 'markAsRead')
      .mockResolvedValue(true);

    const result = await notificationsDomain.markNotificationAsRead(
      '1231',
      '12321'
    );

    expect(result).toBe('Notification marked as read successfully');
  });

  it('should validate mark notification as read when not found', async () => {
    jest
      .spyOn(NotificationsRepository.prototype, 'markAsRead')
      .mockResolvedValue(false);

    const result = await notificationsDomain.markNotificationAsRead(
      '1231',
      '12321'
    );

    expect(result).toBe('Notification not found or already read');
  });
});
