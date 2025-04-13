import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from './ThemeProvider';

const ErrorManager = ({ errors, onResolve }) => {
  const theme = useContext(ThemeContext);
  const [activeError, setActiveError] = useState(null);

  const getErrorLevelColor = (level) => {
    switch(level) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`rounded-xl overflow-hidden ${theme.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className={`p-4 border-b ${theme.darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h3 className={`flex items-center text-lg font-semibold ${theme.darkMode ? 'text-white' : 'text-gray-900'}`}>
          <span className={`w-3 h-3 rounded-full mr-2 ${errors.length ? 'bg-red-500' : 'bg-green-500'}`}></span>
          Gestión de Errores
          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${theme.darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-800'}`}>
            {errors.length} {errors.length === 1 ? 'error' : 'errores'}
          </span>
        </h3>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-64 overflow-y-auto">
        {errors.length > 0 ? (
          errors.map((error, index) => (
            <div 
              key={index} 
              className={`p-4 cursor-pointer transition-colors ${activeError === index ? (theme.darkMode ? 'bg-gray-700' : 'bg-gray-100') : ''}`}
              onClick={() => setActiveError(index)}
            >
              <div className="flex items-start">
                <span className={`w-2 h-2 mt-1.5 rounded-full mr-2 ${getErrorLevelColor(error.level)}`}></span>
                <div className="flex-1">
                  <div className={`font-medium ${theme.darkMode ? 'text-white' : 'text-gray-900'}`}>{error.message}</div>
                  <div className={`text-xs mt-1 ${theme.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {error.file} • {error.type}
                  </div>
                </div>
              </div>
              
              {activeError === index && (
                <div className="mt-3">
                  <div className={`text-sm mb-2 ${theme.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {error.details}
                  </div>
                  <button
                    onClick={() => onResolve(index)}
                    className={`px-3 py-1 text-sm rounded-lg ${theme.darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white`}
                  >
                    Marcar como resuelto
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-4 text-center">
            <div className={`${theme.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No se encontraron errores
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorManager;