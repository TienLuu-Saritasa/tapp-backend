import CrudController from '../../controllers/base.controller';
import { Project } from '../../interfaces/project';
import { ProjectModel } from './project.model';

export class ProjectController extends CrudController<Project> {
  public readonly path = '/projects';
  readonly model = ProjectModel;

  constructor() {
    super();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
  
    this.router.get(this.path, this.getAll);
    this.router.get(`${this.path}/:id`, this.getById);
    this.router.post(this.path, this.create);
    this.router.put(`${this.path}/:id`, this.update);
    this.router.delete(`${this.path}/:id`, this.deleteById);
  }
}
