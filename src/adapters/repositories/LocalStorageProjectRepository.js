import ProjectRepositoryPort from '../../core/ports/ProjectRepositoryPort';

class LocalStorageProjectRepository extends ProjectRepositoryPort {
  constructor() {
    super();
    this.storageKey = 'codeVisionProjects';
  }

  async save(project) {
    const projects = await this.findAll();
    const existingIndex = projects.findIndex(p => p.id === project.id);

    if (existingIndex !== -1) {
      projects[existingIndex] = project;
    } else {
      projects.push(project);
    }

    localStorage.setItem(this.storageKey, JSON.stringify(projects));
    return project;
  }

  async findById(id) {
    const projects = await this.findAll();
    return projects.find(p => p.id === id);
  }

  async findAll() {
    const storedProjects = localStorage.getItem(this.storageKey);
    return storedProjects ? JSON.parse(storedProjects) : [];
  }
}

export default LocalStorageProjectRepository;