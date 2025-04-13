import React, { useState, useEffect, useRef, useContext } from 'react';
import { ThemeContext } from './ThemeProvider';

const ArchitectureVisualizer = ({ projectStructure }) => {
  const theme = useContext(ThemeContext);
  const canvasRef = useRef(null);
  const [activeTab, setActiveTab] = useState('components');
  const [is3DEnabled, setIs3DEnabled] = useState(true);

  // Simulación de datos de arquitectura
  const architectureData = {
    components: [
      { id: 1, name: 'App', type: 'component', dependencies: [2, 3], methods: 5 },
      { id: 2, name: 'API Service', type: 'service', dependencies: [4], methods: 8 },
      { id: 3, name: 'UI Manager', type: 'component', dependencies: [5], methods: 12 },
      { id: 4, name: 'Database', type: 'service', dependencies: [], methods: 3 },
      { id: 5, name: 'State Store', type: 'store', dependencies: [2], methods: 6 }
    ],
    classes: [
      { id: 101, name: 'UserModel', methods: 4, properties: 3 },
      { id: 102, name: 'AuthService', methods: 7, properties: 2 }
    ],
    functions: [
      { id: 201, name: 'formatDate', dependencies: [] },
      { id: 202, name: 'validateInput', dependencies: [201] }
    ]
  };

  useEffect(() => {
    if (canvasRef.current && is3DEnabled) {
      // Inicialización simulada de Three.js (en un entorno real se importaría la librería)
      const canvas = canvasRef.current;
      const { width, height } = canvas.getBoundingClientRect();
      
      // Configuración inicial del canvas
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      // Limpiar canvas
      ctx.clearRect(0, 0, width, height);
      
      // Dibujar elementos arquitectónicos
      drawArchitecture(ctx, width, height);
    }
  }, [activeTab, is3DEnabled, projectStructure]);

  const drawArchitecture = (ctx, width, height) => {
    // Establecer estilo basado en el tema
    ctx.fillStyle = theme.darkMode ? '#374151' : '#F3F4F6';
    ctx.fillRect(0, 0, width, height);
    
    // Dibujar nodos basados en la pestaña activa
    const items = architectureData[activeTab] || [];
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.4;
    
    items.forEach((item, index) => {
      const angle = (index / items.length) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      // Dibujar nodo
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.fillStyle = getNodeColor(item.type || activeTab);
      ctx.fill();
      ctx.strokeStyle = theme.darkMode ? '#4B5563' : '#D1D5DB';
      ctx.stroke();
      
      // Dibujar texto
      ctx.fillStyle = theme.darkMode ? '#FFFFFF' : '#111827';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '12px Arial';
      ctx.fillText(item.name, x, y);
    });
  };

  const getNodeColor = (type) => {
    const colors = {
      component: '#3B82F6',
      service: '#10B981',
      store: '#F59E0B',
      class: '#8B5CF6',
      function: '#EC4899'
    };
    return colors[type] || '#6B7280';
  };

  const renderListItems = () => {
    const items = architectureData[activeTab] || [];
    return items.map(item => (
      <div 
        key={item.id}
        className={`p-3 mb-2 rounded-lg ${theme.darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors cursor-pointer`}
      >
        <div className="flex justify-between items-center">
          <span className={`font-medium ${theme.darkMode ? 'text-white' : 'text-gray-900'}`}>
            {item.name}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${theme.darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
            {item.type || activeTab}
          </span>
        </div>
        {item.methods && (
          <div className={`text-xs mt-1 ${theme.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Métodos: {item.methods}
          </div>
        )}
      </div>
    ));
  };

  return (
    <Panel title="Visualización Arquitectónica">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('components')}
              className={`px-3 py-1 text-sm rounded-lg ${activeTab === 'components' ? 'bg-blue-600 text-white' : theme.darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
            >
              Componentes
            </button>
            <button
              onClick={() => setActiveTab('classes')}
              className={`px-3 py-1 text-sm rounded-lg ${activeTab === 'classes' ? 'bg-blue-600 text-white' : theme.darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
            >
              Clases
            </button>
            <button
              onClick={() => setActiveTab('functions')}
              className={`px-3 py-1 text-sm rounded-lg ${activeTab === 'functions' ? 'bg-blue-600 text-white' : theme.darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
            >
              Funciones
            </button>
          </div>
          <button
            onClick={() => setIs3DEnabled(!is3DEnabled)}
            className={`px-3 py-1 text-sm rounded-lg ${is3DEnabled ? 'bg-purple-600 text-white' : theme.darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
          >
            {is3DEnabled ? '3D Activado' : '3D Desactivado'}
          </button>
        </div>

        {is3DEnabled ? (
          <div className="relative h-96 rounded-lg overflow-hidden">
            <canvas 
              ref={canvasRef} 
              className={`w-full h-full ${theme.darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
            />
            <div className={`absolute bottom-2 left-2 px-2 py-1 rounded text-xs ${theme.darkMode ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-600'}`}>
              Vista de arquitectura interactiva
            </div>
          </div>
        ) : (
          <div className="h-96 overflow-y-auto">
            {renderListItems()}
          </div>
        )}

        <div className={`p-3 rounded-lg ${theme.darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
          <h4 className="text-sm font-medium mb-2">Leyenda</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
              Componentes
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
              Servicios
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
              Stores
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
              Clases
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
};

export default ArchitectureVisualizer;