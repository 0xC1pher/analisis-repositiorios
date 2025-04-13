import React, { useState, useContext } from 'react';
import { ThemeContext } from './ThemeProvider';

const ProjectImportTabs = ({ onImport }) => {
  const theme = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('github');
  const [repoUrl, setRepoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const importMethods = [
    { 
      id: 'github', 
      label: 'Repositorio GitHub',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    },
    { 
      id: 'local', 
      label: 'Directorio Local',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  const handleGithubImport = async () => {
    // Validación de URL de GitHub más robusta
    const githubUrlRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+(\/?)?$/;
    if (!githubUrlRegex.test(repoUrl)) {
      setError('Por favor, ingresa una URL de GitHub válida');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simular llamada a API de GitHub
      const projectData = await fetchGitHubRepoData(repoUrl);
      onImport(projectData);
    } catch (err) {
      setError(err.message || 'Error al importar repositorio');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGitHubRepoData = async (url) => {
    // Simulación de obtención de datos de repositorio
    const [, owner, repo] = url.match(/github\.com\/([^/]+)\/([^/]+)/i) || [];

    if (!owner || !repo) {
      throw new Error('No se pudo extraer información del repositorio');
    }

    // Simular estructura de repositorio más detallada
    return {
      name: repo,
      fullName: `${owner}/${repo}`,
      source: 'github',
      url: url,
      structure: generateMockRepoStructure(repo),
      metadata: {
        owner: owner,
        languages: ['JavaScript', 'TypeScript', 'HTML', 'CSS'],
        stars: Math.floor(Math.random() * 1000),
        lastUpdated: new Date().toISOString()
      }
    };
  };

  const generateMockRepoStructure = (repoName) => {
    // Generar estructura de repositorio simulada
    return [
      {
        name: 'src',
        type: 'directory',
        children: [
          {
            name: 'components',
            type: 'directory',
            children: [
              { name: 'Header.js', type: 'file', size: 1024, language: 'JavaScript' },
              { name: 'Footer.js', type: 'file', size: 768, language: 'JavaScript' }
            ]
          },
          { name: 'App.js', type: 'file', size: 2048, language: 'JavaScript' }
        ]
      },
      { name: 'package.json', type: 'file', size: 512, language: 'JSON' },
      { name: 'README.md', type: 'file', size: 256, language: 'Markdown' }
    ];
  };

  const handleLocalImport = async () => {
    try {
      // Verificar soporte de File System Access API
      if (!('showDirectoryPicker' in window)) {
        throw new Error('Su navegador no soporta importación de directorios');
      }

      const directoryHandle = await window.showDirectoryPicker();
      const projectData = await readDirectoryStructure(directoryHandle);
      
      onImport(projectData);
    } catch (err) {
      setError(err.message || 'Error al seleccionar directorio');
    }
  };

  const readDirectoryStructure = async (handle, depth = 0) => {
    // Límite de profundidad para evitar recursión excesiva
    if (depth > 3) return [];

    const structure = [];
    
    try {
      for await (const entry of handle.values()) {
        if (entry.kind === 'file') {
          const file = await entry.getFile();
          structure.push({
            name: entry.name,
            type: 'file',
            size: file.size,
            language: detectLanguage(entry.name)
          });
        } else if (entry.kind === 'directory') {
          const children = await readDirectoryStructure(entry, depth + 1);
          structure.push({
            name: entry.name,
            type: 'directory',
            children
          });
        }
      }
    } catch (err) {
      console.error('Error leyendo estructura de directorios', err);
    }

    return {
      name: handle.name,
      source: 'local',
      structure,
      metadata: {
        languages: detectLanguages(structure),
        lastUpdated: new Date().toISOString()
      }
    };
  };

  const detectLanguage = (filename) => {
    const extensionMap = {
      '.js': 'JavaScript',
      '.ts': 'TypeScript',
      '.jsx': 'React',
      '.tsx': 'React TypeScript',
      '.py': 'Python',
      '.java': 'Java',
      '.json': 'JSON',
      '.md': 'Markdown',
      '.html': 'HTML',
      '.css': 'CSS'
    };
    
    const ext = '.' + filename.split('.').pop().toLowerCase();
    return extensionMap[ext] || 'Unknown';
  };

  const detectLanguages = (structure) => {
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
  };

  return (
    <div className={`
      rounded-2xl p-6 shadow-2xl 
      ${theme.darkMode 
        ? 'bg-gray-900 border-gray-800 text-white' 
        : 'bg-white border-gray-200 text-gray-900'}
      border transition-all duration-300 transform hover:scale-[1.01]
    `}>
      <div className="flex mb-6 space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {importMethods.map(method => (
          <button
            key={method.id}
            onClick={() => setActiveTab(method.id)}
            className={`
              flex-1 flex items-center justify-center space-x-2 py-3 rounded-md transition-all duration-300
              ${activeTab === method.id 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}
            `}
          >
            {method.icon}
            <span className="font-medium">{method.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'github' ? (
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/usuario/repositorio"
              className={`
                w-full px-4 py-3 rounded-lg border 
                ${theme.darkMode 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'}
                focus:ring-2 focus:ring-blue-500 transition-all
              `}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          
          <button
            onClick={handleGithubImport}
            disabled={isLoading}
            className={`
              w-full py-3 rounded-lg font-bold uppercase tracking-wider transition-all duration-300
              ${isLoading 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'}
              flex items-center justify-center space-x-2
            `}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Importar Repositorio'
            )}
          </button>

          {error && (
            <div className={`
              p-3 rounded-lg text-sm 
              ${theme.darkMode 
                ? 'bg-red-900 text-red-200' 
                : 'bg-red-100 text-red-800'}
            `}>
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <button
            onClick={handleLocalImport}
            className={`
              w-full py-4 rounded-lg font-bold uppercase tracking-wider transition-all duration-300
              bg-green-600 hover:bg-green-700 text-white
              flex items-center justify-center space-x-2
            `}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Seleccionar Directorio</span>
          </button>

          {error && (
            <div className={`
              p-3 rounded-lg text-sm 
              ${theme.darkMode 
                ? 'bg-red-900 text-red-200' 
                : 'bg-red-100 text-red-800'}
            `}>
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectImportTabs;

// DONE