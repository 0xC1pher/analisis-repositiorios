import React, { useState } from 'react';
import CodeStandardsDashboard from './CodeStandardsDashboard';
import DependencyAnalyzer from './DependencyAnalyzer';
import DiagramViewer from './DiagramViewer';
import ChatInterface from './ChatInterface';

const RepositoryView = ({ repoData, accessToken }) => {
  const [activeTab, setActiveTab] = useState('standards');

  return (
    <div>
      <div className="flex overflow-x-auto border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('standards')}
          className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'standards' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          Estándares
        </button>
        <button
          onClick={() => setActiveTab('dependencies')}
          className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'dependencies' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          Dependencias
        </button>
        <button
          onClick={() => setActiveTab('diagrams')}
          className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'diagrams' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          Diagramas
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'chat' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          Chat con IA
        </button>
      </div>

      {activeTab === 'standards' && <CodeStandardsDashboard repoData={repoData} />}
      {activeTab === 'dependencies' && <DependencyAnalyzer repoData={repoData} accessToken={accessToken} />}
      {activeTab === 'diagrams' && <DiagramViewer repoData={repoData} />}
      {activeTab === 'chat' && <ChatInterface repoData={repoData} />}
    </div>
  );
};

export default RepositoryView;