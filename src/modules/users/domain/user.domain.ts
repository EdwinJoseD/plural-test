import { UserType } from '@/models/users/users.type';
import { UserRepository } from '../repository/user.repository';

export class UserDomain {
  private readonly repository: UserRepository;
  constructor() {
    this.repository = new UserRepository();
  }

  async getUserById(userId: string): Promise<UserType | null> {
    return this.repository.getUserById(userId);
  }
}
