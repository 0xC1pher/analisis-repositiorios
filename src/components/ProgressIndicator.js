import React, { useContext } from 'react';
import { ThemeContext } from './ThemeProvider';

const ProgressIndicator = ({ progress, languageDistribution }) => {
  const theme = useContext(ThemeContext);
  
  return (
    <Panel title="Progreso del Proyecto">
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className={`text-sm font-medium ${theme.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Completado
            </span>
            <span className={`text-sm font-bold ${theme.darkMode ? 'text-white' : 'text-gray-900'}`}>
              {progress}%
            </span>
          </div>
          <div className={`w-full h-3 rounded-full ${theme.darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div 
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <h4 className={`text-sm font-medium mb-3 ${theme.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Distribución de Lenguajes
          </h4>
          <div className="space-y-2">
            {Object.entries(languageDistribution).map(([lang, percent]) => (
              <div key={lang} className="flex items-center">
                <span className={`w-20 text-sm ${theme.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {lang}
                </span>
                <div className="flex-1 mx-2">
                  <div className={`w-full h-2 rounded-full ${theme.darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div 
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
                <span className={`text-xs font-medium ${theme.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {percent}%
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className={`p-3 rounded-lg ${theme.darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <h4 className={`text-sm font-medium mb-2 ${theme.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Recomendaciones
          </h4>
          <ul className="space-y-2 text-sm">
            {progress < 30 && (
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">•</span>
                <span className={theme.darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  El proyecto está en etapas iniciales. Considera definir una arquitectura clara.
                </span>
              </li>
            )}
            {progress >= 30 && progress < 70 && (
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span className={theme.darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Buen progreso. Revisa las dependencias y documentación faltante.
                </span>
              </li>
            )}
            {progress >= 70 && (
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span className={theme.darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Proyecto avanzado. Enfócate en testing y optimización.
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </Panel>
  );
};

export default ProgressIndicator;

// DONE