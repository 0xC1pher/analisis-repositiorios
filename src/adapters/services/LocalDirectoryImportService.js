import ImportServicePort from '../../core/ports/ImportServicePort';
import Project from '../../core/domain/Project';

class LocalDirectoryImportService extends ImportServicePort {
  async importFromLocalDirectory() {
    try {
      if (!('showDirectoryPicker' in window)) {
        throw new Error('Su navegador no soporta importación de directorios');
      }

      const directoryHandle = await window.showDirectoryPicker();
      const structure = await this.readDirectoryStructure(directoryHandle);

      const projectData = {
        name: directoryHandle.name,
        source: 'local',
        structure,
        languages: this.detectLanguages(structure)
      };

      const project = Project.create(projectData);
      project.validate();

      return project;
    } catch (error) {
      console.error('Error en importación local:', error);
      throw error;
    }
  }

  async readDirectoryStructure(handle, depth = 0) {
    if (depth > 3) return [];

    const structure = [];
    
    for await (const entry of handle.values()) {
      if (entry.kind === 'file') {
        const file = await entry.getFile();
        structure.push({
          name: entry.name,
          type: 'file',
          size: file.size,
          language: this.detectLanguage(entry.name)
        });
      } else if (entry.kind === 'directory') {
        const children = await this.readDirectoryStructure(entry, depth + 1);
        structure.push({
          name: entry.name,
          type: 'directory',
          children
        });
      }
    }
    
    return structure;
  }

  detectLanguage(filename) {
    const extensionMap = {
      '.js': 'JavaScript',
      '.ts': 'TypeScript',
      '.jsx': 'React',
      '.tsx': 'React TypeScript'
    };
    
    const ext = '.' + filename.split('.').pop().toLowerCase();
    return extensionMap[ext] || 'Unknown';
  }

  detectLanguages(structure) {
    const languages = new Set();
    
    const scan = (items) => {
      items.forEach(item => {
        if (item.type === 'file' && item.language) {
          languages.add(item.language);
        }
        if (item.children) scan(item.children);
      });
    };

    scan(structure);
    return Array.from(languages);
  }

  validateImportSource() {
    // Método de validación para importación local
    return true;
  }
}

export default LocalDirectoryImportService;