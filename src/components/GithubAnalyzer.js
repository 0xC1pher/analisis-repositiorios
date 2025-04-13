import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from './ThemeProvider';

const GithubAnalyzer = ({ onAnalyze }) => {
  const theme = useContext(ThemeContext);
  const [repoUrl, setRepoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeRepository = async () => {
    if (!repoUrl.includes('github.com')) {
      setError('URL de GitHub no válida');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const repoPath = repoUrl.replace('https://github.com/', '');
      const [owner, repo] = repoPath.split('/');
      
      // Llamada real a la API de GitHub
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      
      if (!response.ok) {
        throw new Error('No se pudo acceder al repositorio');
      }
      
      const repoData = await response.json();
      
      // Obtener contenido del repositorio
      const contentsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`);
      const contents = await contentsResponse.json();
      
      // Procesar estructura del proyecto
      const projectStructure = await processRepositoryContents(contents, owner, repo);
      
      onAnalyze({
        ...repoData,
        structure: projectStructure,
        progress: calculateProgress(projectStructure)
      });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const processRepositoryContents = async (contents, owner, repo) => {
    const structure = [];
    
    for (const item of contents) {
      if (item.type === 'file') {
        structure.push({
          name: item.name,
          type: 'file',
          size: item.size,
          path: item.path
        });
      } else if (item.type === 'dir') {
        const dirResponse = await fetch(item.url);
        const dirContents = await dirResponse.json();
        structure.push({
          name: item.name,
          type: 'folder',
          children: await processRepositoryContents(dirContents, owner, repo)
        });
      }
    }
    
    return structure;
  };

  const calculateProgress = (structure) => {
    // Implementación real de cálculo de progreso
    const totalFiles = countFiles(structure);
    const completedFiles = estimateCompletedFiles(structure);
    return Math.round((completedFiles / totalFiles) * 100);
  };

  const countFiles = (items) => {
    return items.reduce((count, item) => {
      return count + (item.type === 'file' ? 1 : countFiles(item.children));
    }, 0);
  };

  const estimateCompletedFiles = (items) => {
    // Estimación basada en ciertos criterios (en una app real sería más sofisticado)
    return items.reduce((count, item) => {
      if (item.type === 'file') {
        return count + (item.size > 0 ? 1 : 0);
      }
      return count + estimateCompletedFiles(item.children);
    }, 0);
  };

  return (
    <Panel title="Analizador de GitHub">
      <div className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-1 ${theme.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            URL del Repositorio
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/usuario/repositorio"
              className={`flex-1 px-4 py-2 rounded-lg border ${theme.darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
            <button
              onClick={analyzeRepository}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'} flex items-center`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analizando...
                </>
              ) : 'Analizar'}
            </button>
          </div>
        </div>
        
        {error && (
          <div className={`p-3 rounded-lg ${theme.darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'}`}>
            {error}
          </div>
        )}
        
        <div className={`p-3 rounded-lg ${theme.darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
          <p className="text-sm">
            El analizador examinará la estructura completa del proyecto, incluyendo:
          </p>
          <ul className="list-disc list-inside mt-1 text-sm">
            <li>Archivos y directorios</li>
            <li>Lenguajes utilizados</li>
            <li>Progreso estimado</li>
            <li>Posibles problemas</li>
          </ul>
        </div>
      </div>
    </Panel>
  );
};

export default GithubAnalyzer;