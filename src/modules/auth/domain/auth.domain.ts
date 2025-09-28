import {
  CreateUserDTO,
  RegisterUserType,
  UserType,
} from '@/models/users/users.type';
import { AuthRepository } from '../repository/auth.repository';
import { mapperGeneric } from '@/helpers/mapper/mapper.helper';
import { AppError, createToken } from '@/helpers';
import { logger } from '@/config/logger/logger';
import { comparePassword, hashPassword } from '@/helpers/bcrypt/bcrypt.helpers';

export class AuthDomain {
  private readonly repository: AuthRepository;
  constructor() {
    this.repository = new AuthRepository();
  }

  async login(email: string, password: string): Promise<string> {
    try {
      const user = await this.repository.FindUserByEmailOrUsername(email, true);
      if (!user) {
        throw new AppError({ message: 'Invalid credentials' });
      }
      const isPasswordValid = await comparePassword(
        password,
        user.passwordHash
      );
      if (!isPasswordValid) {
        throw new AppError({ message: 'Invalid credentials' });
      }
      const token = createToken(user);
      await this.repository.updateLastLogin(user.id);
      return token;
    } catch (error: any) {
      logger.error('Error during login %s', error.message);
      throw new AppError({ message: 'Login failed' });
    }
  }

  async register(userData: CreateUserDTO): Promise<string> {
    try {
      const existingUser = await this.repository.FindUserByEmailOrUsername(
        userData.email
      );
      if (existingUser) {
        throw new AppError({ message: 'Email already in use' });
      }
      const hashedPassword = await hashPassword(userData.password);
      const userToCreate: RegisterUserType = mapperGeneric<
        CreateUserDTO,
        RegisterUserType
      >(userData, user => ({
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        role: user.role,
        passwordHash: hashedPassword,
      }));
      return this.repository.RegisterUser(userToCreate);
    } catch (error: any) {
      logger.error('Error during user registration %s', error.message);
      throw new AppError({ message: 'Registration failed' });
    }
  }

  async getProfile(
    username: string,
    showPassword: boolean = false
  ): Promise<UserType> {
    const user = await this.repository.FindUserByEmailOrUsername(
      username,
      showPassword
    );
    if (!user) throw new AppError({ message: 'User not found' });
    return user;
  }
}
