import { describe, it, expect, jest } from '@jest/globals';
import { TaskCommentsRepository } from './taskComments.repository';
import { TaskCommentsModel } from '@/models/taskComments/taskComments.model';

describe('should validate TaskCommentsRepository', () => {
  const taskCommentsRepository = new TaskCommentsRepository();

  it('should be defined', () => {
    expect(taskCommentsRepository).toBeDefined();
  });

  it('should validate getCommentsByTaskId method', async () => {
    const taskId = 'taskId';
    const mockComments = [
      { id: '1', userId: '1', taskId, content: 'Comment 1' },
      { id: '2', userId: '2', taskId, content: 'Comment 2' },
    ];

    const findAllMock = jest
      .spyOn(TaskCommentsModel, 'findAll')
      .mockResolvedValue({
        map: () => mockComments,
        toJSON: () => jest.fn().mockReturnValue(mockComments),
        get: () => mockComments,
      } as any);

    const result = await taskCommentsRepository.getCommentsByTaskId(taskId);

    expect(result).toEqual(mockComments);
    expect(findAllMock).toHaveBeenCalledWith({ where: { taskId } });
  });
  it(' should return empty array if no comments found', async () => {
    const taskId = 'nonExistingTaskId';

    const findAllMock = jest
      .spyOn(TaskCommentsModel, 'findAll')
      .mockResolvedValue(null as any);

    const result = await taskCommentsRepository.getCommentsByTaskId(taskId);

    expect(result).toEqual([]);
    expect(findAllMock).toHaveBeenCalledWith({ where: { taskId } });
  });

  it('should validate createComment method', async () => {
    const commentData = {
      userId: 'userId',
      taskId: 'taskId',
      content: 'New Comment',
    };
    const mockCreatedComment = { id: '1', ...commentData };

    const createMock = jest
      .spyOn(TaskCommentsModel, 'create')
      .mockResolvedValue({ dataValues: mockCreatedComment } as any);
    const result = await taskCommentsRepository.createComment(commentData);

    expect(result).toEqual(mockCreatedComment);
    expect(createMock).toHaveBeenCalledWith(commentData);
  });
});
