import React, { useState, useContext } from 'react';
import { ThemeContext } from './ThemeProvider';
import ImportMethodSelector from './ImportMethodSelector';
import GithubImportForm from './GithubImportForm';
import LocalImportForm from './LocalImportForm';

const ProjectImporter = ({ onImport }) => {
  const theme = useContext(ThemeContext);
  const [importMethod, setImportMethod] = useState('github');

  const handleImport = (projectData) => {
    onImport(projectData);
  };

  return (
    <div className={`
      rounded-xl p-6 
      ${theme.darkMode 
        ? 'bg-gray-900 border-gray-800' 
        : 'bg-white border-gray-200'}
      border shadow-lg
    `}>
      <h2 className={`
        text-2xl font-bold mb-6 
        ${theme.darkMode ? 'text-white' : 'text-gray-900'}
      `}>
        Importar Proyecto
      </h2>

      <ImportMethodSelector 
        activeMethod={importMethod}
        onMethodChange={setImportMethod}
      />

      {importMethod === 'github' ? (
        <GithubImportForm onImport={handleImport} />
      ) : (
        <LocalImportForm onImport={handleImport} />
      )}
    </div>
  );
};

export default ProjectImporter;

// DONE