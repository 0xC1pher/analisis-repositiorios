import React, { useState, useEffect } from 'react';
import ThemeProvider from './ThemeProvider';
import AppLayout from './AppLayout';
import GithubAnalyzer from './GithubAnalyzer';
import ArchitectureVisualizer from './ArchitectureVisualizer';
import ProgressIndicator from './ProgressIndicator';
import ErrorManager from './ErrorManager';

const App = () => {
  const [projectData, setProjectData] = useState(null);
  const [errors, setErrors] = useState([]);
  const [activeTab, setActiveTab] = useState('analysis');

  // Simular detección de errores al cargar proyecto
  useEffect(() => {
    if (projectData) {
      const detectedErrors = [
        {
          id: 1,
          message: 'Componente sin documentación',
          level: 'warning',
          file: 'src/components/DataTable.js',
          type: 'Documentación'
        },
        {
          id: 2,
          message: 'Posible memory leak en useEffect',
          level: 'critical',
          file: 'src/hooks/useDataLoader.js',
          type: 'Performance'
        }
      ];
      setErrors(detectedErrors);
    }
  }, [projectData]);

  const handleAnalyzeComplete = (data) => {
    setProjectData({
      ...data,
      progress: Math.min(100, Math.floor(Math.random() * 100)), // Simular progreso
      languageDistribution: {
        JavaScript: 65,
        TypeScript: 20,
        CSS: 10,
        HTML: 5
      }
    });
  };

  const handleErrorResolve = (errorId) => {
    setErrors(prev => prev.filter(err => err.id !== errorId));
  };

  return (
    <ThemeProvider>
      <AppLayout>
        <div className="col-span-12 mb-6">
          <div className={`p-1 rounded-lg inline-flex ${projectData ? 'bg-gray-200 dark:bg-gray-700' : 'bg-blue-100 dark:bg-blue-900'}`}>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`px-4 py-2 rounded-md ${activeTab === 'analysis' ? 'bg-white dark:bg-gray-800 shadow' : 'bg-transparent'}`}
            >
              Análisis
            </button>
            {projectData && (
              <>
                <button
                  onClick={() => setActiveTab('architecture')}
                  className={`px-4 py-2 rounded-md ${activeTab === 'architecture' ? 'bg-white dark:bg-gray-800 shadow' : 'bg-transparent'}`}
                >
                  Arquitectura
                </button>
                <button
                  onClick={() => setActiveTab('errors')}
                  className={`px-4 py-2 rounded-md ${activeTab === 'errors' ? 'bg-white dark:bg-gray-800 shadow' : 'bg-transparent'}`}
                >
                  Errores ({errors.length})
                </button>
              </>
            )}
          </div>
        </div>

        {activeTab === 'analysis' && (
          <>
            <div className="col-span-8">
              <GithubAnalyzer onAnalyze={handleAnalyzeComplete} />
            </div>
            <div className="col-span-4">
              {projectData ? (
                <ProgressIndicator 
                  progress={projectData.progress} 
                  languageDistribution={projectData.languageDistribution} 
                />
              ) : (
                <Panel title="Bienvenido a CodeVision">
                  <div className={`p-4 text-center ${theme.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Importa un proyecto de GitHub para comenzar el análisis
                  </div>
                </Panel>
              )}
            </div>
          </>
        )}

        {activeTab === 'architecture' && projectData && (
          <div className="col-span-12">
            <ArchitectureVisualizer projectStructure={projectData.structure} />
          </div>
        )}

        {activeTab === 'errors' && projectData && (
          <div className="col-span-12">
            <ErrorManager errors={errors} onResolve={handleErrorResolve} />
          </div>
        )}
      </AppLayout>
    </ThemeProvider>
  );
};

export default App;

// DONE