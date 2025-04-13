import React, { useState, useEffect, useRef } from 'react';

const ChatMessage = ({ message, type }) => {
  const isUser = type === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        className={`
          max-w-[70%] p-3 rounded-2xl 
          ${isUser 
            ? 'bg-blue-500 text-white rounded-br-none' 
            : 'bg-gray-200 text-gray-800 rounded-bl-none'}
        `}
      >
        {message}
      </div>
    </div>
  );
};

const RepositoryAnalyzer = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [activeTab, setActiveTab] = useState('diagramas');
  const [ollamaQuery, setOllamaQuery] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [repositoryContext, setRepositoryContext] = useState('');
  const chatEndRef = useRef(null);

  const mockAnalyzeRepository = (url) => {
    return {
      basicInfo: {
        name: 'proyecto-ejemplo',
        language: 'JavaScript',
        stars: 42,
        forks: 15
      },
      codeMetrics: {
        totalLines: 5234,
        filesCount: 87,
        complexity: 'Medio'
      },
      diagramas: {
        arquitectura: 'https://ejemplo.com/diagrama-arquitectura.png',
        flujoComponentes: 'https://ejemplo.com/diagrama-flujo.png',
        modeloDatos: 'https://ejemplo.com/diagrama-datos.png'
      }
    };
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversationHistory]);

  const handleAnalyzeRepository = () => {
    const result = mockAnalyzeRepository(repoUrl);
    setAnalysisResult(result);
    setRepositoryContext(`Repositorio: ${result.basicInfo.name}
Lenguaje: ${result.basicInfo.language}
Líneas de código: ${result.codeMetrics.totalLines}
Archivos: ${result.codeMetrics.filesCount}`);
  };

  const handleOllamaQuery = async () => {
    if (!ollamaQuery.trim()) return;

    const userMessage = { type: 'user', content: ollamaQuery };
    setConversationHistory(prev => [...prev, userMessage]);
    setOllamaQuery('');

    try {
      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "llama2",
          messages: [
            { role: "system", content: "Eres un asistente experto en análisis de código" },
            { role: "user", content: `Contexto del repositorio: ${repositoryContext}. Pregunta: ${ollamaQuery}` }
          ]
        })
      });

      const data = await response.json();
      const assistantMessage = { 
        type: 'assistant', 
        content: data.message.content 
      };

      setConversationHistory(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error consultando a Ollama:", error);
      const errorMessage = { 
        type: 'assistant', 
        content: "Error al conectar con Ollama. Verifica que esté corriendo." 
      };
      setConversationHistory(prev => [...prev, errorMessage]);
    }
  };

  const renderChatInterface = () => {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="h-[500px] overflow-y-auto p-4 space-y-4">
          {conversationHistory.map((message, index) => (
            <ChatMessage 
              key={index} 
              message={message.content} 
              type={message.type} 
            />
          ))}
          <div ref={chatEndRef} />
        </div>
        
        <div className="border-t border-gray-200 p-4 flex space-x-2">
          <input
            type="text"
            value={ollamaQuery}
            onChange={(e) => setOllamaQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleOllamaQuery()}
            placeholder="Pregunta sobre el repositorio..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleOllamaQuery}
            className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-blue-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  const renderTabs = () => {
    const tabs = [
      { id: 'diagramas', label: 'Diagramas' },
      { id: 'conversacion', label: 'Conversación' }
    ];

    return (
      <div className="flex border-b border-gray-200 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 -mb-px border-b-2 ${
              activeTab === tab.id 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  };

  const renderDiagramas = () => {
    if (!analysisResult) return null;

    return (
      <div className="grid md:grid-cols-3 gap-4">
        {Object.entries(analysisResult.diagramas).map(([nombre, url]) => (
          <div key={nombre} className="bg-white rounded-xl p-4 shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-gray-800 capitalize">{nombre}</h3>
            <img 
              src={url} 
              alt={`Diagrama de ${nombre}`} 
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-xl">
      <div className="mb-6 flex space-x-2">
        <input
          type="text"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="URL del repositorio de GitHub"
          className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAnalyzeRepository}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Analizar
        </button>
      </div>

      {analysisResult && (
        <>
          {renderTabs()}
          {activeTab === 'diagramas' && renderDiagramas()}
          {activeTab === 'conversacion' && renderChatInterface()}
        </>
      )}
    </div>
  );
};

export default RepositoryAnalyzer;