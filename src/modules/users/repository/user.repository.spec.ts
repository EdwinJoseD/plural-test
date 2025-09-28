import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { UserRepository } from './user.repository';

describe('should valicate user repository', () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
  });

  it('should validate getUserById method', async () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
    };

    const findByPkMock = jest
      .spyOn(UserRepository.prototype, 'getUserById')
      .mockResolvedValue(mockUser as any);

    const result = await userRepository.getUserById('1');

    expect(result).toEqual(mockUser);
    expect(findByPkMock).toHaveBeenCalledWith('1');
  });

  it('should validate getUserPaginated method', async () => {
    const mockUsers = [
      { id: '1', name: 'John Doe', email: 'john.doe@example.com' },
      { id: '2', name: 'Jane Doe', email: 'jane.doe@example.com' },
    ];

    const findAndCountAllMock = jest
      .spyOn(UserRepository.prototype, 'getUserPaginated')
      .mockResolvedValue({
        count: mockUsers.length,
        rows: mockUsers,
      } as any);

    const result = await userRepository.getUserPaginated(1, 10);

    expect(result).toEqual({
      count: mockUsers.length,
      rows: mockUsers,
    });
    expect(findAndCountAllMock).toHaveBeenCalledWith(1, 10);
  });
});
