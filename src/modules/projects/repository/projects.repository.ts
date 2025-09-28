import { ProjectsModel } from '@/models/projects/projects.model';
import { ProjectsType } from '@/models/projects/projects.type';

export class ProjectsRepository {
  async getProjectById(projectId: string): Promise<ProjectsType | null> {
    const project = await ProjectsModel.findByPk(projectId);
    return project ? project.dataValues : null;
  }
}
