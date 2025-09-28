import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { AuthDomain } from './auth.domain';
import { AuthRepository } from '../repository/auth.repository';
import { UserRole } from '@/models/users/users.type';
import * as Bcrypt from '@/helpers/bcrypt/bcrypt.helpers';
import * as JWT from '@/helpers/jwt/jwt';

describe('should validate AuthDomain', () => {
  let authDomain: AuthDomain;

  beforeEach(() => {
    authDomain = new AuthDomain();
  });

  it('should validate login method - success', async () => {
    const mockUser = {
      id: '1',
      email: 'john.doe@example.com',
      passwordHash: 'hashed_password',
      username: 'johndoe',
      role: UserRole.USER,
    };

    jest
      .spyOn(AuthRepository.prototype, 'FindUserByEmailOrUsername')
      .mockResolvedValue(mockUser);
    jest.spyOn(Bcrypt, 'comparePassword').mockResolvedValue(true);
    jest.spyOn(JWT, 'createToken').mockReturnValue('mocked_jwt_token');

    jest
      .spyOn(AuthRepository.prototype, 'updateLastLogin')
      .mockResolvedValue(true as any);

    const token = await authDomain.login(mockUser.email, 'correct_password');

    expect(token).toEqual('mocked_jwt_token');
    expect(
      AuthRepository.prototype.FindUserByEmailOrUsername
    ).toHaveBeenCalledWith(mockUser.email, true);
  });

  it('should validate login method - invalid credentials', async () => {
    const mockUser = {
      id: '1',
      email: 'john.doe@example.com',
      passwordHash: 'hashed_password',
      username: 'johndoe',
      role: UserRole.USER,
    };

    jest
      .spyOn(AuthRepository.prototype, 'FindUserByEmailOrUsername')
      .mockResolvedValue(mockUser);
    jest.spyOn(Bcrypt, 'comparePassword').mockResolvedValue(false);

    const token = await authDomain
      .login(mockUser.email, 'wrong_password')
      .catch(e => e);
    expect(token).toBeInstanceOf(Error);
    expect(token.message).toBe('Login failed');
    expect(
      AuthRepository.prototype.FindUserByEmailOrUsername
    ).toHaveBeenCalledWith(mockUser.email, true);
    expect(Bcrypt.comparePassword).toHaveBeenCalledWith(
      'wrong_password',
      mockUser.passwordHash
    );
  });

  it('should validate register method - success', async () => {
    const mockUser = {
      email: 'john.doe@example.com',
      passwordHash: 'hashed_password',
      username: 'johndoe',
      role: UserRole.USER,
      avatarUrl: undefined,
      firstName: undefined,
      lastName: undefined,
    };

    jest
      .spyOn(AuthRepository.prototype, 'FindUserByEmailOrUsername')
      .mockResolvedValue(null);
    jest.spyOn(Bcrypt, 'hashPassword').mockResolvedValue('hashed_password');
    jest
      .spyOn(AuthRepository.prototype, 'RegisterUser')
      .mockResolvedValue(mockUser as any);

    const result = await authDomain.register(mockUser as any);

    expect(result).toEqual(mockUser);
    expect(
      AuthRepository.prototype.FindUserByEmailOrUsername
    ).toHaveBeenCalledWith(mockUser.email);
    expect(AuthRepository.prototype.RegisterUser).toHaveBeenCalledWith(
      mockUser
    );
  });

  it('should validate register method - email already in use', async () => {
    const mockUser = {
      id: '1',
      email: 'test@test.com',
      passwordHash: 'hashed_password',
      username: 'testuser',
      role: UserRole.USER,
    };

    jest
      .spyOn(AuthRepository.prototype, 'FindUserByEmailOrUsername')
      .mockResolvedValue(mockUser);

    const result = await authDomain.register(mockUser as any).catch(e => e);

    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe('Registration failed');
    expect(
      AuthRepository.prototype.FindUserByEmailOrUsername
    ).toHaveBeenCalledWith(mockUser.email);
  });

  it('should validate getProfile method - success', async () => {
    const mockUser = {
      id: '1',
      email: 'test@test.com',
      passwordHash: 'hashed_password',
      username: 'testuser',
      role: UserRole.USER,
    };

    jest
      .spyOn(AuthRepository.prototype, 'FindUserByEmailOrUsername')
      .mockResolvedValue(mockUser);

    const result = await authDomain.getProfile(mockUser.username, true);

    expect(result).toEqual(mockUser);
    expect(
      AuthRepository.prototype.FindUserByEmailOrUsername
    ).toHaveBeenCalledWith(mockUser.username, true);
  });

  it('should validate getProfile method - user not found', async () => {
    jest
      .spyOn(AuthRepository.prototype, 'FindUserByEmailOrUsername')
      .mockResolvedValue(null);

    const result = await authDomain.getProfile('nonexistentuser').catch(e => e);

    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe('User not found');
    expect(
      AuthRepository.prototype.FindUserByEmailOrUsername
    ).toHaveBeenCalledWith('nonexistentuser', false);
  });
});
