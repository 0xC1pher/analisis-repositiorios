import React, { useState, useContext } from 'react';
import { ThemeContext } from './ThemeProvider';

const GithubImporter = ({ onImport }) => {
  const theme = useContext(ThemeContext);
  const [repoUrl, setRepoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImport = async () => {
    if (!repoUrl) return;
    
    setIsLoading(true);
    try {
      // Simulación de análisis de repo GitHub
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const repoData = {
        name: repoUrl.split('/').pop(),
        files: [
          { name: 'package.json', type: 'file' },
          { name: 'src', type: 'folder', children: [] }
        ],
        metadata: {
          languages: ['JavaScript', 'TypeScript'],
          lastCommit: '2 days ago',
          stars: 42
        }
      };
      
      onImport(repoData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={`p-6 rounded-xl border ${theme.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
      style={{ boxShadow: theme.darkMode ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)' }}
    >
      <h3 className={`text-lg font-semibold mb-4 ${theme.darkMode ? 'text-white' : 'text-gray-900'}`}>
        Importar desde GitHub
      </h3>
      
      <div className="flex space-x-2">
        <input
          type="text"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="https://github.com/usuario/repo"
          className={`flex-1 px-4 py-2 rounded-lg border ${theme.darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
        />
        
        <button
          onClick={handleImport}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${isLoading 
            ? 'bg-gray-500 cursor-not-allowed' 
            : `bg-${theme.colors.primary} hover:bg-${theme.colors.primary} text-white`}`}
        >
          {isLoading ? 'Analizando...' : 'Importar'}
        </button>
      </div>
      
      {repoUrl && (
        <div className={`mt-4 p-3 rounded-lg ${theme.darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <p className={`text-sm ${theme.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            El agente analizará la estructura del proyecto y podrás hacer preguntas específicas sobre el código.
          </p>
        </div>
      )}
    </div>
  );
};

export default GithubImporter;