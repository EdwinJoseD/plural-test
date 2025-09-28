import { CreateUserDTO } from '@/models/users/users.type';

export interface IAuthDomain {
  login(email: string, password: string): Promise<string>;
  register(user: CreateUserDTO): Promise<string>;
  getProfile(userId: string): Promise<any>;
}
