import React, { useState, useContext } from 'react';
import { ThemeContext } from './ThemeProvider';

const GithubImportForm = ({ onImport }) => {
  const theme = useContext(ThemeContext);
  const [repoUrl, setRepoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateGithubUrl = (url) => {
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+$/;
    return githubRegex.test(url);
  };

  const handleImport = async () => {
    if (!validateGithubUrl(repoUrl)) {
      setError('URL de GitHub inválida');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [, owner, repo] = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
      
      // Simular llamada a API de GitHub
      const projectStructure = await fetchRepositoryStructure(owner, repo);
      
      onImport({
        source: 'github',
        name: repo,
        url: repoUrl,
        structure: projectStructure,
        metadata: {
          owner,
          languages: detectLanguages(projectStructure)
        }
      });
    } catch (err) {
      setError(err.message || 'Error al importar repositorio');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRepositoryStructure = async (owner, repo) => {
    // Simulación de estructura de repositorio
    return [
      {
        name: 'src',
        type: 'directory',
        children: [
          { name: 'index.js', type: 'file', size: 1024 },
          { 
            name: 'components', 
            type: 'directory', 
            children: [
              { name: 'Header.js', type: 'file', size: 512 },
              { name: 'Footer.js', type: 'file', size: 512 }
            ]
          }
        ]
      },
      { name: 'package.json', type: 'file', size: 256 },
      { name: 'README.md', type: 'file', size: 128 }
    ];
  };

  const detectLanguages = (structure) => {
    const languageMap = {
      '.js': 'JavaScript',
      '.ts': 'TypeScript',
      '.py': 'Python',
      '.java': 'Java',
      '.go': 'Go'
    };

    const languages = new Set();
    
    const scan = (items) => {
      items.forEach(item => {
        if (item.type === 'file') {
          const ext = item.name.split('.').pop();
          if (languageMap[`.${ext}`]) {
            languages.add(languageMap[`.${ext}`]);
          }
        }
        if (item.children) scan(item.children);
      });
    };

    scan(structure);
    return Array.from(languages);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className={`block mb-2 ${theme.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          URL del Repositorio GitHub
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/usuario/repositorio"
            className={`
              flex-1 px-4 py-2 rounded-lg border 
              ${theme.darkMode 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-white border-gray-300 text-gray-900'}
              focus:ring-2 focus:ring-blue-500
            `}
          />
          <button
            onClick={handleImport}
            disabled={isLoading}
            className={`
              px-4 py-2 rounded-lg font-medium transition-colors
              ${isLoading 
                ? 'bg-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'}
              flex items-center
            `}
          >
            {isLoading ? 'Importando...' : 'Importar'}
          </button>
        </div>
      </div>

      {error && (
        <div className={`
          p-3 rounded-lg 
          ${theme.darkMode 
            ? 'bg-red-900 text-red-200' 
            : 'bg-red-100 text-red-800'}
        `}>
          {error}
        </div>
      )}

      <div className={`
        p-3 rounded-lg 
        ${theme.darkMode 
          ? 'bg-gray-800 text-gray-300' 
          : 'bg-gray-100 text-gray-700'}
      `}>
        <h4 className="font-semibold mb-2">Qué sucederá</h4>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>Se analizará la estructura completa del repositorio</li>
          <li>Se detectarán lenguajes de programación</li>
          <li>Se generará un resumen del proyecto</li>
        </ul>
      </div>
    </div>
  );
};

export default GithubImportForm;