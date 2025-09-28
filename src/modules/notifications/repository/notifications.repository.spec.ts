import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { NotificationsRepository } from './notifications.repository';
import { Op } from 'sequelize';
import { NotificationsModel } from '@/models/notifications/notifications.model';

describe('should validate Notifications Repository', () => {
  const notificationsRepository = new NotificationsRepository();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should validate find all notifications', async () => {
    const mockNotifications = [
      {
        id: '1',
        userId: 'user1',
        message: 'Notification 1',
        isRead: false,
      },
      {
        id: '2',
        userId: 'user1',
        message: 'Notification 2',
        isRead: true,
      },
    ];

    jest.spyOn(NotificationsModel, 'findAll').mockResolvedValue({
      map: () => mockNotifications,
      toJSON: () => jest.fn().mockReturnValue(mockNotifications),
    } as any);
    const result = await notificationsRepository.findAllNotifications('user1');

    expect(result).toEqual([
      {
        id: '1',
        userId: 'user1',
        message: 'Notification 1',
        isRead: false,
      },
      {
        id: '2',
        userId: 'user1',
        message: 'Notification 2',
        isRead: true,
      },
    ]);
    expect(NotificationsModel.findAll).toHaveBeenCalledWith({
      where: { userId: 'user1' },
    });
  });

  it('should validate mark notification as read - success', async () => {
    jest.spyOn(NotificationsModel, 'update').mockResolvedValue([1] as any);

    const result = await notificationsRepository.markAsRead('1', 'user1');

    expect(result).toBe(true);
    expect(NotificationsModel.update).toHaveBeenCalledWith(
      { isRead: true },
      { where: { id: '1', userId: 'user1' } }
    );
  });

  it('should validate mark notification as read - failure', async () => {
    jest.spyOn(NotificationsModel, 'update').mockResolvedValue([0] as any);

    const result = await notificationsRepository.markAsRead('1', 'user1');

    expect(result).toBe(false);
    expect(NotificationsModel.update).toHaveBeenCalledWith(
      { isRead: true },
      { where: { id: '1', userId: 'user1' } }
    );
  });
});
