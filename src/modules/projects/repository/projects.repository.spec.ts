import { describe, it, jest } from '@jest/globals';

import { ProjectsRepository } from './projects.repository';
import { ProjectsModel } from '@/models/projects/projects.model';

describe('should validate ProjectsRepository', () => {
  let projectsRepository: ProjectsRepository;

  beforeEach(() => {
    projectsRepository = new ProjectsRepository();
  });

  it('should validate get project by id', async () => {
    const projectId = '1';
    const mockProject = { id: projectId, name: 'Test Project' };

    // Mock the ProjectsModel.findByPk method
    const findByPkMock = jest
      .spyOn(ProjectsModel, 'findByPk')
      .mockResolvedValue({ dataValues: mockProject } as any);

    const result = await projectsRepository.getProjectById(projectId);

    expect(result).toEqual(mockProject);
    expect(findByPkMock).toHaveBeenCalledWith(projectId);
  });

  it('should return null if project not found', async () => {
    const projectId = '1';

    // Mock the ProjectsModel.findByPk method to return null
    const findByPkMock = jest
      .spyOn(ProjectsModel, 'findByPk')
      .mockResolvedValue(null);

    const result = await projectsRepository.getProjectById(projectId);

    expect(result).toBeNull();
    expect(findByPkMock).toHaveBeenCalledWith(projectId);
  });
});
