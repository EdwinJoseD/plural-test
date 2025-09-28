import { UserModel } from '@/models/users/user.models';
import { UserType } from '@/models/users/users.type';

export class UserRepository {
  async getUserById(userId: string): Promise<UserType | null> {
    const user = await UserModel.findByPk(userId);
    return user ? user.dataValues : null;
  }
}
