import { UserModel } from '@/models/users/user.models';
import { UserType } from '@/models/users/users.type';
import { Op } from 'sequelize';

export class UserRepository {
  async getUserById(userId: string): Promise<UserType | null> {
    const user = await UserModel.findByPk(userId);
    return user ? user.dataValues : null;
  }

  async getUserPaginated(
    page: number,
    limit: number,
    fieldName?: keyof UserType,
    fieldValue?: string,
    fieldSort?: keyof UserType,
    valueSort?: 'ASC' | 'DESC'
  ): Promise<{ rows: UserType[]; count: number }> {
    const offset = (page - 1) * limit;

    const whereClause =
      fieldName && fieldValue
        ? { [fieldName]: { [Op.iLike]: `%${fieldValue}%` } }
        : {};

    const orderClause = fieldSort
      ? ([[fieldSort, valueSort]] as [string, 'ASC' | 'DESC'][])
      : [];
    const result = await UserModel.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: orderClause,
    });

    return {
      rows: result.rows.map(item => item.dataValues),
      count: result.count,
    };
  }
}
