const githubConfig = {
  // Configuración de acceso a la API de GitHub
  api: {
    baseUrl: 'https://api.github.com',
    timeout: 5000,
    defaultHeaders: {
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    }
  },

  // Parámetros para análisis de repositorios
  repositoryAnalysis: {
    maxDepth: 3,
    exclude: ['node_modules', '.git', 'dist', 'build'],
    includeFileTypes: ['.js', '.ts', '.jsx', '.tsx', '.py', '.java'],
    rateLimit: {
      requests: 10,
      interval: 60000 // 1 minuto
    }
  },

  // Plantillas para issues y pull requests
  templates: {
    bugReport: {
      title: '[BUG] ',
      body: '## Descripción del error\n\n## Pasos para reproducir\n1.\n2.\n3.\n\n## Comportamiento esperado\n\n## Screenshots (opcional)'
    },
    featureRequest: {
      title: '[FEATURE] ',
      body: '## Descripción de la funcionalidad\n\n## Beneficios\n\n## Posible implementación'
    }
  },

  // Configuración de webhooks
  webhooks: {
    events: ['push', 'pull_request', 'issues'],
    secret: process.env.GITHUB_WEBHOOK_SECRET
  }
};

export default githubConfig;