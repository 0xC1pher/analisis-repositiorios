import React, { useState, useEffect } from 'react';

const StandardCard = ({ title, compliance, description, issues }) => {
  const complianceColor = compliance >= 80 ? 'bg-green-500' : 
                        compliance >= 50 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center">
          <div className={`w-12 h-12 rounded-full ${complianceColor} flex items-center justify-center text-white font-bold`}>
            {compliance}%
          </div>
        </div>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      {issues > 0 && (
        <div className="text-sm text-red-500">
          {issues} {issues === 1 ? 'incidencia' : 'incidencias'} encontradas
        </div>
      )}
    </div>
  );
};

const ProgressChart = ({ percentage, label }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg className="w-24 h-24" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xl font-bold"
        >
          {percentage}%
        </text>
      </svg>
      <span className="mt-2 text-sm font-medium text-gray-600">{label}</span>
    </div>
  );
};

const CodeStandardsDashboard = ({ repoData }) => {
  const [standards, setStandards] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [selectedStandard, setSelectedStandard] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeCodeStandards = async () => {
    setIsAnalyzing(true);
    
    try {
      // Simulación de análisis de estándares (en producción sería una llamada a API)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockStandards = [
        {
          id: 1,
          title: 'ESLint Airbnb',
          compliance: 85,
          description: 'Cumplimiento de reglas de estilo JavaScript',
          issues: 12,
          details: '15 archivos analizados, 3 errores críticos'
        },
        {
          id: 2,
          title: 'Patrones SOLID',
          compliance: 65,
          description: 'Principios de diseño orientado a objetos',
          issues: 8,
          details: '7 clases no cumplen con Single Responsibility'
        },
        {
          id: 3,
          title: 'Seguridad OWASP',
          compliance: 92,
          description: 'Protección contra vulnerabilidades comunes',
          issues: 3,
          details: '2 endpoints sin validación de entrada'
        },
        {
          id: 4,
          title: 'Rendimiento',
          compliance: 78,
          description: 'Optimización de tiempos de ejecución',
          issues: 5,
          details: '3 bucles potencialmente ineficientes'
        }
      ];

      const mockMetrics = {
        overallCompliance: 80,
        filesAnalyzed: 42,
        issuesFound: 28,
        testCoverage: 65,
        complexity: 42
      };

      setStandards(mockStandards);
      setMetrics(mockMetrics);
    } catch (error) {
      console.error("Error analyzing standards:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (repoData) {
      analyzeCodeStandards();
    }
  }, [repoData]);

  if (!repoData) return <div className="text-center py-8">Selecciona un repositorio para analizar</div>;

  if (isAnalyzing) return <div className="text-center py-8">Analizando estándares de código...</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Métricas Generales</h2>
        <div className="flex flex-wrap justify-around gap-6">
          <ProgressChart percentage={metrics?.overallCompliance || 0} label="Cumplimiento" />
          <ProgressChart percentage={metrics?.testCoverage || 0} label="Cobertura" />
          <ProgressChart percentage={100 - (metrics?.complexity || 0)} label="Simplicidad" />
          <div className="flex flex-col items-center justify-center">
            <div className="text-3xl font-bold">{metrics?.filesAnalyzed || 0}</div>
            <span className="text-sm font-medium text-gray-600">Archivos</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-red-500">{metrics?.issuesFound || 0}</div>
            <span className="text-sm font-medium text-gray-600">Problemas</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Estándares de Código</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {standards.map(standard => (
            <StandardCard 
              key={standard.id}
              title={standard.title}
              compliance={standard.compliance}
              description={standard.description}
              issues={standard.issues}
            />
          ))}
        </div>
      </div>

      {selectedStandard && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4">{selectedStandard.title}</h3>
          <p className="text-gray-600 mb-4">{selectedStandard.details}</p>
          <button
            onClick={() => setSelectedStandard(null)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Volver
          </button>
        </div>
      )}
    </div>
  );
};

export default CodeStandardsDashboard;