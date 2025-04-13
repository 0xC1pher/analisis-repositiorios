import React, { useState, useEffect } from 'react';

const DiagramViewer = ({ repoData }) => {
  const [diagrams, setDiagrams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateDiagrams = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // En producción, esto generaría diagramas reales basados en el código
      // Aquí simulamos una respuesta después de un delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDiagrams([
        { 
          type: 'Arquitectura', 
          description: 'Diagrama de componentes principales',
          svg: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="20" width="60" height="40" fill="#3b82f6" rx="5" />
            <rect x="120" y="20" width="60" height="40" fill="#10b981" rx="5" />
            <rect x="20" y="90" width="60" height="40" fill="#f59e0b" rx="5" />
            <rect x="120" y="90" width="60" height="40" fill="#ef4444" rx="5" />
            <path d="M80 40L120 40" stroke="#6b7280" stroke-width="2" />
            <path d="M80 110L120 110" stroke="#6b7280" stroke-width="2" />
            <path d="M70 60L70 90" stroke="#6b7280" stroke-width="2" />
            <path d="M130 60L130 90" stroke="#6b7280" stroke-width="2" />
          </svg>`
        },
        { 
          type: 'Flujo de Datos', 
          description: 'Diagrama de flujo entre módulos',
          svg: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="20" fill="#3b82f6" />
            <circle cx="150" cy="50" r="20" fill="#10b981" />
            <circle cx="50" cy="100" r="20" fill="#f59e0b" />
            <circle cx="150" cy="100" r="20" fill="#ef4444" />
            <path d="M70 50L130 50" stroke="#6b7280" stroke-width="2" />
            <path d="M50 70L50 80" stroke="#6b7280" stroke-width="2" />
            <path d="M150 70L150 80" stroke="#6b7280" stroke-width="2" />
            <path d="M70 100L130 100" stroke="#6b7280" stroke-width="2" />
          </svg>`
        },
        { 
          type: 'Base de Datos', 
          description: 'Modelo entidad-relación',
          svg: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
            <rect x="30" y="30" width="60" height="30" fill="#8b5cf6" rx="3" />
            <rect x="110" y="30" width="60" height="30" fill="#8b5cf6" rx="3" />
            <rect x="30" y="90" width="60" height="30" fill="#8b5cf6" rx="3" />
            <rect x="110" y="90" width="60" height="30" fill="#8b5cf6" rx="3" />
            <path d="M60 60L60 90" stroke="#6b7280" stroke-width="2" stroke-dasharray="4" />
            <path d="M140 60L140 90" stroke="#6b7280" stroke-width="2" stroke-dasharray="4" />
            <path d="M90 45L110 45" stroke="#6b7280" stroke-width="2" />
            <path d="M90 105L110 105" stroke="#6b7280" stroke-width="2" />
          </svg>`
        }
      ]);
    } catch (error) {
      setError("Error al generar diagramas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (repoData) {
      generateDiagrams();
    }
  }, [repoData]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold dark:text-white">Diagramas del Sistema</h2>
      
      {loading ? (
        <div className="text-center py-8 dark:text-white">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
          <div>Generando diagramas...</div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 p-4 rounded-lg">
          {error}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {diagrams.map((diagram, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-2">{diagram.type}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{diagram.description}</p>
              <div 
                className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg p-4"
                dangerouslySetInnerHTML={{ __html: diagram.svg }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiagramViewer;