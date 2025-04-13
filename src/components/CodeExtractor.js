import React, { useState, useEffect } from 'react';

const CodeExtractor = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [extractedFiles, setExtractedFiles] = useState([]);
  const [processingStatus, setProcessingStatus] = useState('idle');
  const [selectedFile, setSelectedFile] = useState(null);
  const [chunks, setChunks] = useState([]);

  // Simulación de extracción de archivos
  const extractCodeFromRepo = async () => {
    setProcessingStatus('extracting');
    
    // Simulación de delay para extracción
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Datos simulados (en producción sería la respuesta real de GitHub API)
    const mockFiles = [
      { path: 'src/App.js', content: '// Código de la aplicación principal...', language: 'javascript' },
      { path: 'src/components/Header.js', content: '// Componente de encabezado...', language: 'javascript' },
      { path: 'README.md', content: '# Documentación del proyecto...', language: 'markdown' },
      { path: 'package.json', content: '{"name": "mi-proyecto", "dependencies": {...}}', language: 'json' }
    ];
    
    setExtractedFiles(mockFiles);
    setProcessingStatus('extracted');
  };

  // Procesar archivo seleccionado en chunks
  const processFileForModel = (fileContent) => {
    const CHUNK_SIZE = 1000; // Tamaño de chunk en caracteres
    const fileChunks = [];
    
    for (let i = 0; i < fileContent.length; i += CHUNK_SIZE) {
      fileChunks.push({
        id: i,
        content: fileContent.substring(i, i + CHUNK_SIZE),
        tokens: Math.ceil(fileContent.substring(i, i + CHUNK_SIZE).length / 4) // Estimación aproximada
      });
    }
    
    return fileChunks;
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setChunks(processFileForModel(file.content));
  };

  const sendToOllama = async (chunk) => {
    setProcessingStatus('processing');
    try {
      // Aquí iría la llamada real a Ollama API
      console.log("Enviando a Ollama:", chunk.content.substring(0, 50) + "...");
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setProcessingStatus('ready');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Extracción y Procesamiento de Código</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Panel de configuración */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">URL del Repositorio</label>
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/usuario/repositorio"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Token de Acceso</label>
            <input
              type="password"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={extractCodeFromRepo}
            disabled={processingStatus === 'extracting' || !repoUrl || !accessToken}
            className={`w-full py-2 px-4 rounded-lg ${
              processingStatus === 'extracting' || !repoUrl || !accessToken 
                ? 'bg-gray-300' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white transition-colors`}
          >
            {processingStatus === 'extracting' ? 'Extrayendo código...' : 'Extraer Código'}
          </button>

          {extractedFiles.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Archivos Extraídos</h3>
              <div className="max-h-60 overflow-y-auto border rounded-lg">
                {extractedFiles.map((file, index) => (
                  <div 
                    key={index}
                    onClick={() => handleFileSelect(file)}
                    className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedFile?.path === file.path ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="font-medium">{file.path}</div>
                    <div className="text-sm text-gray-500">{file.language}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Panel de procesamiento */}
        <div className="space-y-4">
          {selectedFile ? (
            <>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Preparando contexto para Ollama</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {selectedFile.language}
                </span>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span>Fragmentos generados: {chunks.length}</span>
                  <span>Tokens totales: {chunks.reduce((sum, chunk) => sum + chunk.tokens, 0)}</span>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {chunks.map((chunk) => (
                    <div key={chunk.id} className="bg-white p-3 rounded border">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Chunk #{chunk.id / 1000 + 1}</span>
                        <span>{chunk.tokens} tokens</span>
                      </div>
                      <pre className="text-sm bg-gray-50 p-2 rounded overflow-x-auto">
                        {chunk.content.substring(0, 150)}...
                      </pre>
                      <button
                        onClick={() => sendToOllama(chunk)}
                        disabled={processingStatus === 'processing'}
                        className="mt-2 text-sm py-1 px-3 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                      >
                        Enviar a Ollama
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg p-8 text-center">
              <div>
                <div className="text-gray-400 mb-2">Selecciona un archivo para procesar</div>
                <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinecap="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeExtractor;