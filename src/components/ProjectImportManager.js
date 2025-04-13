import React, { useState, useContext } from 'react';
import ErrorHandler from '../core/utils/ErrorHandler';
import ImportValidationService from '../core/services/ImportValidationService';

const ProjectImportManager = ({ onImport }) => {
  const [activeMethod, setActiveMethod] = useState('github');
  const [importUrl, setImportUrl] = useState('');
  const [importStatus, setImportStatus] = useState({
    loading: false,
    error: null,
    success: false
  });

  const handleImportMethodChange = (method) => {
    setActiveMethod(method);
    setImportUrl('');
    setImportStatus({ loading: false, error: null, success: false });
  };

  const handleUrlChange = (e) => {
    setImportUrl(e.target.value);
    setImportStatus(prev => ({ ...prev, error: null }));
  };

  const performImport = async () => {
    setImportStatus({ loading: true, error: null, success: false });

    try {
      let importedProject;

      if (activeMethod === 'github') {
        if (!ImportValidationService.validateGitHubUrl(importUrl)) {
          throw new Error('URL_INVALID');
        }
        importedProject = await importFromGitHub(importUrl);
      } else {
        if (!ImportValidationService.validateLocalImport()) {
          throw new Error('DIRECTORY_UNSUPPORTED');
        }
        importedProject = await importFromLocalDirectory();
      }

      onImport(importedProject);
      setImportStatus({ loading: false, error: null, success: true });
    } catch (error) {
      const errorMessage = ErrorHandler.handle(error, setImportStatus);
      setImportStatus(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
    }
  };

  const importFromGitHub = async (url) => {
    // Simulación de importación de GitHub
    const [, owner, repo] = url.match(/github\.com\/([^/]+)\/([^/]+)/) || [];
    
    return ImportValidationService.sanitizeImportData({
      name: repo,
      source: 'github',
      url: url,
      structure: generateMockRepoStructure(repo),
      metadata: {
        languages: ['JavaScript', 'TypeScript'],
        owner: owner
      }
    });
  };

  const importFromLocalDirectory = async () => {
    const directoryHandle = await window.showDirectoryPicker();
    const structure = await readDirectoryStructure(directoryHandle);

    return ImportValidationService.sanitizeImportData({
      name: directoryHandle.name,
      source: 'local',
      structure,
      metadata: {
        languages: detectLanguages(structure)
      }
    });
  };

  const readDirectoryStructure = async (handle, depth = 0) => {
    if (depth > 3) return [];

    const structure = [];
    
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
    
    return structure;
  };

  const detectLanguage = (filename) => {
    const extensionMap = {
      '.js': 'JavaScript',
      '.ts': 'TypeScript',
      '.jsx': 'React',
      '.tsx': 'React TypeScript'
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

  const generateMockRepoStructure = (repoName) => [
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

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      <div className="flex mb-4 space-x-2">
        {['github', 'local'].map(method => (
          <button
            key={method}
            onClick={() => handleImportMethodChange(method)}
            className={`
              flex-1 py-2 rounded-lg transition-colors
              ${activeMethod === method 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}
            `}
          >
            {method === 'github' ? 'GitHub' : 'Local'}
          </button>
        ))}
      </div>

      {activeMethod === 'github' && (
        <div className="space-y-4">
          <input
            type="text"
            value={importUrl}
            onChange={handleUrlChange}
            placeholder="https://github.com/usuario/repositorio"
            className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />
          <button
            onClick={performImport}
            disabled={importStatus.loading}
            className={`
              w-full py-2 rounded-lg
              ${importStatus.loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'}
            `}
          >
            {importStatus.loading ? 'Importando...' : 'Importar Repositorio'}
          </button>
        </div>
      )}

      {activeMethod === 'local' && (
        <button
          onClick={performImport}
          className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Seleccionar Directorio
        </button>
      )}

      {importStatus.error && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg">
          {importStatus.error}
        </div>
      )}
    </div>
  );
};

export default ProjectImportManager;

// DONE