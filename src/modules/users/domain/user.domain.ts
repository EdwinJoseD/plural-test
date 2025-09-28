import { UserType } from '@/models/users/users.type';
import { UserRepository } from '../repository/user.repository';
import { ResponsePaginated } from '@/helpers';

export class UserDomain {
  private readonly repository: UserRepository;
  constructor() {
    this.repository = new UserRepository();
  }

  async getUserById(userId: string): Promise<UserType | null> {
    return this.repository.getUserById(userId);
  }

  async getUserPaginated(
    page: number = 1,
    limit: number = 10,
    fieldName?: keyof UserType,
    fieldValue?: string,
    fieldSort?: keyof UserType,
    valueSort?: 'ASC' | 'DESC'
  ): Promise<ResponsePaginated<UserType>> {
    const result = await this.repository.getUserPaginated(
      page,
      limit,
      fieldName,
      fieldValue,
      fieldSort,
      valueSort
    );
    if (result.count > 0) {
      return {
        currentPage: page,
        totalItems: result.count,
        totalPages: Math.ceil(result.count / limit),
        items: result.rows,
      };
    }
    return {
      currentPage: page,
      totalItems: 0,
      totalPages: 0,
      items: [],
    };
  }
}
