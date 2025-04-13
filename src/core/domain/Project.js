// Entidad de dominio que representa un proyecto
const Project = {
  create: (data) => ({
    id: data.id || crypto.randomUUID(),
    name: data.name,
    source: data.source,
    url: data.url,
    structure: data.structure || [],
    metadata: {
      languages: data.languages || [],
      lastUpdated: data.lastUpdated || new Date().toISOString(),
      owner: data.owner || null
    },
    validate() {
      if (!this.name) throw new Error('El nombre del proyecto es obligatorio');
      if (!this.source) throw new Error('La fuente del proyecto es obligatoria');
      return true;
    }
  })
};

export default Project;