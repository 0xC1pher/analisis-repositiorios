// Puerto para definir contrato de repositorio de proyectos
class ProjectRepositoryPort {
  async save(project) {
    throw new Error('Método save debe ser implementado');
  }

  async findById(id) {
    throw new Error('Método findById debe ser implementado');
  }

  async findAll() {
    throw new Error('Método findAll debe ser implementado');
  }
}

export default ProjectRepositoryPort;