// Puerto para servicio de importación de proyectos
class ImportServicePort {
  async importFromGitHub(url) {
    throw new Error('Método importFromGitHub debe ser implementado');
  }

  async importFromLocalDirectory() {
    throw new Error('Método importFromLocalDirectory debe ser implementado');
  }

  validateImportSource(source) {
    throw new Error('Método validateImportSource debe ser implementado');
  }
}

export default ImportServicePort;