import React from 'react';

const ProductionFeatures = () => {
  const features = [
    {
      title: "Análisis de Repositorios en Tiempo Real",
      description: "Conecta directamente con GitHub API para extraer y analizar la estructura del código, dependencias y métricas clave.",
      icon: "🔍"
    },
    {
      title: "Generación Automática de Diagramas",
      description: "Crea diagramas ER, de arquitectura y flujos de componentes basados en el análisis del código.",
      icon: "📊"
    },
    {
      title: "Integración con Ollama Local",
      description: "Consulta modelos de lenguaje local para análisis detallado y documentación automática del código.",
      icon: "🤖"
    },
    {
      title: "Historial de Conversaciones Persistente",
      description: "Guarda el contexto completo de cada análisis para referencia futura y continuidad en las consultas.",
      icon: "💾"
    },
    {
      title: "Interfaz Optimizada para Equipos",
      description: "Diseño responsive y accesible para uso profesional continuo con navegación intuitiva.",
      icon: "🖥️"
    },
    {
      title: "Exportación de Reportes",
      description: "Genera reportes en formato PDF/PNG con los hallazgos del análisis para compartir con equipos.",
      icon: "📤"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Funcionalidades para Producción</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-blue-50 rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Requisitos de Producción</h2>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start">
            <span className="mr-2">✅</span>
            <span>Node.js 16+ instalado en el servidor</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✅</span>
            <span>Ollama corriendo localmente (para análisis con modelos de lenguaje)</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✅</span>
            <span>Token de acceso a GitHub API (para análisis de repositorios privados)</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✅</span>
            <span>1GB+ de RAM disponible (dependiendo del tamaño de los repositorios a analizar)</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProductionFeatures;