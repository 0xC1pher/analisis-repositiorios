import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from './ThemeProvider';

const ProjectAnalysis = ({ project }) => {
  const theme = useContext(ThemeContext);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    if (project) {
      // Simular análisis del proyecto
      const analyzeProject = async () => {
        // Análisis de estructura de archivos
        const totalFiles = countFiles(project.files);
        const fileTypes = analyzeFileTypes(project.files);
        
        // Simular detección de errores (en una implementación real esto vendría del backend)
        const detectedErrors = detectPotentialIssues(project.files);
        
        // Calcular progreso estimado
        const progress = estimateProjectProgress(project.files);
        
        setAnalysis({
          totalFiles,
          fileTypes,
          errors: detectedErrors,
          progress,
          lastUpdated: new Date().toLocaleString()
        });
      };
      
      analyzeProject();
    }
  }, [project]);

  const countFiles = (files) => {
    let count = 0;
    files.forEach(file => {
      if (file.type === 'file') count++;
      if (file.children) count += countFiles(file.children);
    });
    return count;
  };

  const analyzeFileTypes = (files) => {
    const types = {};
    
    const analyze = (items) => {
      items.forEach(item => {
        if (item.type === 'file') {
          const extension = item.name.split('.').pop();
          types[extension] = (types[extension] || 0) + 1;
        }
        if (item.children) analyze(item.children);
      });
    };
    
    analyze(files);
    return types;
  };

  const detectPotentialIssues = (files) => {
    // Simulación de detección de problemas
    const issues = [];
    
    if (Math.random() > 0.5) {
      issues.push({
        type: 'Security',
        message: 'No se encontró archivo de configuración de seguridad',
        level: 'warning'
      });
    }
    
    if (Math.random() > 0.7) {
      issues.push({
        type: 'Performance',
        message: 'Posibles problemas de rendimiento detectados',
        level: 'critical'
      });
    }
    
    return issues;
  };

  const estimateProjectProgress = (files) => {
    // Simulación de cálculo de progreso
    const total = countFiles(files);
    if (total === 0) return 0;
    
    const completed = Math.floor(total * 0.6); // Simular 60% completado
    return Math.min(100, Math.round((completed / total) * 100));
  };

  if (!analysis) return (
    <div className={`p-4 rounded-xl ${theme.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="animate-pulse">
        <div className={`h-6 w-1/2 rounded mb-4 ${theme.darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
        <div className="space-y-2">
          <div className={`h-4 w-full rounded ${theme.darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          <div className={`h-4 w-5/6 rounded ${theme.darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`rounded-xl overflow-hidden ${theme.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className={`p-4 border-b ${theme.darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className={`text-lg font-semibold ${theme.darkMode ? 'text-white' : 'text-gray-900'}`}>
          Análisis del Proyecto
        </h3>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className={`text-sm ${theme.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Progreso estimado</span>
            <span className={`text-sm font-medium ${theme.darkMode ? 'text-white' : 'text-gray-900'}`}>
              {analysis.progress}%
            </span>
          </div>
          <div className={`w-full h-2 rounded-full ${theme.darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div 
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-500"
              style={{ width: `${analysis.progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className={`grid grid-cols-2 gap-4 mb-4 ${theme.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          <div>
            <div className="text-sm">Archivos totales</div>
            <div className="text-xl font-bold">{analysis.totalFiles}</div>
          </div>
          <div>
            <div className="text-sm">Última actualización</div>
            <div className="text-sm">{analysis.lastUpdated}</div>
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className={`text-sm font-medium mb-2 ${theme.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Tipos de archivos
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(analysis.fileTypes).map(([type, count]) => (
              <span 
                key={type}
                className={`px-2 py-1 rounded-full text-xs ${theme.darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-800'}`}
              >
                {type}: {count}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectAnalysis;

// DONE