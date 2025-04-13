import ImportServicePort from '../../core/ports/ImportServicePort';
import Project from '../../core/domain/Project';

class GitHubImportService extends ImportServicePort {
  async importFromGitHub(url) {
    this.validateImportSource(url);

    try {
      const [, owner, repo] = url.match(/github\.com\/([^/]+)\/([^/]+)/i) || [];
      
      if (!owner || !repo) {
        throw new Error('URL de GitHub inválida');
      }

      // Simulación de importación
      const projectData = {
        name: repo,
        source: 'github',
        url: url,
        languages: ['JavaScript', 'TypeScript'],
        owner: owner,
        structure: this.generateMockRepoStructure(repo)
      };

      const project = Project.create(projectData);
      project.validate();

      return project;
    } catch (error) {
      console.error('Error en importación de GitHub:', error);
      throw error;
    }
  }

  validateImportSource(url) {
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+(\/?)?$/;
    if (!githubRegex.test(url)) {
      throw new Error('URL de GitHub inválida');
    }
  }

  generateMockRepoStructure(repoName) {
    return [
      {
        name: 'src',
        type: 'directory',
        children: [
          {
            name: 'components',
            type: 'directory',
            children: [
              { name: 'Header.js', type: 'file', size: 1024 },
              { name: 'Footer.js', type: 'file', size: 768 }
            ]
          },
          { name: 'App.js', type: 'file', size: 2048 }
        ]
      }
    ];
  }
}

export default GitHubImportService;