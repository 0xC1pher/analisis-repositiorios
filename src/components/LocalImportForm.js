import React, { useState, useContext } from 'react';
import { ThemeContext } from './ThemeProvider';

const LocalImportForm = ({ onImport }) => {
  const theme = useContext(ThemeContext);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState(null);

  const handleDirectorySelect = async () => {
    try {
      const directoryHandle = await window.showDirectoryPicker();
      const structure = await readDirectoryStructure(directoryHandle);
      
      onImport({
        source: 'local',
        name: directoryHandle.name,
        structure,
        metadata: {
          languages: detectLanguages(structure)
        }
      });
    } catch (err) {
      setError(err.message || 'Error al seleccionar directorio');
    }
  };

  const readDirectoryStructure = async (handle, depth = 0) => {
    if (depth > 3) return []; // Limitar profundidad de recursión

    const structure = [];
    
    for await (const entry of handle.values()) {
      if (entry.kind === 'file') {
        const file = await entry.getFile();
        structure.push({
          name: entry.name,
          type: 'file',
          size: file.size
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
          Seleccionar Directorio Local
        </label>
        <button
          onClick={handleDirectorySelect}
          className={`
            w-full px-4 py-3 rounded-lg font-medium transition-colors
            ${theme.darkMode 
              ? 'bg-blue-800 hover:bg-blue-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'}
            flex items-center justify-center space-x-2
          `}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Seleccionar Carpeta</span>
        </button>
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
          <li>Se analizará la estructura completa del directorio</li>
          <li>Se detectarán lenguajes de programación</li>
          <li>Se generará un resumen del proyecto</li>
          <li>Profundidad máxima de análisis: 3 niveles</li>
        </ul>
      </div>
    </div>
  );
};

export default LocalImportForm;