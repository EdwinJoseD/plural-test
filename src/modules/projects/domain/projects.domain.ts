import { ProjectsType } from '@/models/projects/projects.type';
import { ProjectsRepository } from '../repository/projects.repository';

export class ProjectsDomain {
  private readonly projectsRepository: ProjectsRepository;

  constructor() {
    this.projectsRepository = new ProjectsRepository();
  }

  async getProjectById(projectId: string): Promise<ProjectsType | null> {
    return this.projectsRepository.getProjectById(projectId);
  }
}
