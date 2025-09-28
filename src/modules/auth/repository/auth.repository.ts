import { UserModel } from '@/models/users/user.models';
import { RegisterUserType, UserType } from '@/models/users/users.type';
import { Op } from 'sequelize';

export class AuthRepository {
  async RegisterUser(user: RegisterUserType): Promise<string> {
    const result = await UserModel.create(user);
    return result.dataValues.id;
  }

  async FindUserByEmailOrUsername(
    username: string,
    showPassword: boolean = false
  ): Promise<UserType | null> {
    const user = await UserModel.findOne({
      where: { [Op.or]: [{ email: username }, { username }] },
      attributes: showPassword ? undefined : { exclude: ['passwordHash'] },
    });
    if (!user) {
      return null;
    }
    return user.dataValues;
  }

  async updateLastLogin(userId: string): Promise<void> {
    await UserModel.update(
      { lastLogin: new Date() },
      { where: { id: userId } }
    );
  }
}
