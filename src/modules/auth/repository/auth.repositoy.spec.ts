import { UserModel } from '@/models/users/user.models';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { AuthRepository } from './auth.repository';
import { UserRole } from '@/models/users/users.type';
import { Op } from 'sequelize';
describe('should validate Auth Repository', () => {
  const authRepository = new AuthRepository();

  it('should validate create user', async () => {
    jest
      .spyOn(UserModel, 'create')
      .mockResolvedValue({ dataValues: { id: '123' } } as any);

    const result = await authRepository.RegisterUser({
      email: 'test@example.com',
      passwordHash: 'password123',
      username: 'testuser',
      role: UserRole.USER,
    });

    expect(result).toEqual('123');
    expect(UserModel.create).toHaveBeenCalledWith({
      email: 'test@example.com',
      passwordHash: 'password123',
      username: 'testuser',
      role: UserRole.USER,
    });
  });

  it('should validate find user by email or username without password', async () => {
    jest.spyOn(UserModel, 'findOne').mockResolvedValue({
      dataValues: {
        id: '123',
        email: 'test@example.com',
        username: 'testuser',
        role: UserRole.USER,
      },
    } as any);
    const result = await authRepository.FindUserByEmailOrUsername('testuser');

    expect(result).toEqual({
      id: '123',
      email: 'test@example.com',
      username: 'testuser',
      role: UserRole.USER,
    });
    expect(UserModel.findOne).toHaveBeenCalledWith({
      where: {
        [Op.or]: [{ email: 'testuser' }, { username: 'testuser' }],
      },
      attributes: { exclude: ['passwordHash'] },
    });
  });

  it('should validate find user by email or username with password', async () => {
    jest.spyOn(UserModel, 'findOne').mockResolvedValue({
      dataValues: {
        id: '123',
        email: 'test@example.com',
        username: 'testuser',
        role: UserRole.USER,
      },
    } as any);
    const result = await authRepository.FindUserByEmailOrUsername(
      'testuser',
      true
    );

    expect(result).toEqual({
      id: '123',
      email: 'test@example.com',
      username: 'testuser',
      role: UserRole.USER,
    });
    expect(UserModel.findOne).toHaveBeenCalledWith({
      where: {
        [Op.or]: [{ email: 'testuser' }, { username: 'testuser' }],
      },
    });
  });

  it('should validate update last login', async () => {
    const updateSpy = jest
      .spyOn(UserModel, 'update')
      .mockResolvedValue([1] as any);

    await authRepository.updateLastLogin('123');

    expect(updateSpy).toHaveBeenCalledWith(
      { lastLogin: expect.any(Date) },
      { where: { id: '123' } }
    );
  });
});
