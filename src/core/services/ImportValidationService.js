class ImportValidationService {
  static validateGitHubUrl(url) {
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+(\/?)?$/;
    return githubRegex.test(url);
  }

  static validateLocalImport() {
    return 'showDirectoryPicker' in window;
  }

  static sanitizeImportData(data) {
    return {
      name: data.name || 'Proyecto Sin Nombre',
      source: data.source || 'unknown',
      url: data.url || null,
      structure: data.structure || [],
      metadata: {
        languages: data.languages || [],
        lastUpdated: data.lastUpdated || new Date().toISOString()
      }
    };
  }
}

export default ImportValidationService;