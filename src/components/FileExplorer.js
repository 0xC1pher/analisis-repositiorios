import React, { useState } from 'react';

const FileExplorer = () => {
  const [url, setUrl] = useState('');
  const [urlDetails, setUrlDetails] = useState(null);

  const parseUrl = (inputUrl) => {
    try {
      const parsedUrl = new URL(inputUrl);
      return {
        protocol: parsedUrl.protocol.replace(':', ''),
        domain: parsedUrl.hostname,
        path: parsedUrl.pathname,
        params: Array.from(parsedUrl.searchParams.entries()),
        hash: parsedUrl.hash
      };
    } catch (error) {
      return null;
    }
  };

  const handleUrlAnalysis = () => {
    const details = parseUrl(url);
    setUrlDetails(details);
  };

  const renderUrlGraph = () => {
    if (!urlDetails) return null;

    return (
      <div className="bg-white rounded-xl shadow-md p-6 mt-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Estructura de la URL</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="font-medium text-blue-600 mr-2">Protocolo:</span>
            <span className="text-gray-700">{urlDetails.protocol}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-blue-600 mr-2">Dominio:</span>
            <span className="text-gray-700">{urlDetails.domain}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-blue-600 mr-2">Ruta:</span>
            <span className="text-gray-700">{urlDetails.path || '/'}</span>
          </div>
          {urlDetails.params.length > 0 && (
            <div>
              <span className="font-medium text-blue-600 mr-2">Parámetros:</span>
              {urlDetails.params.map(([key, value]) => (
                <div key={key} className="ml-4 text-gray-700">
                  {key}: {value}
                </div>
              ))}
            </div>
          )}
          {urlDetails.hash && (
            <div className="flex items-center">
              <span className="font-medium text-blue-600 mr-2">Hash:</span>
              <span className="text-gray-700">{urlDetails.hash}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-2xl mx-auto p-6">
      <div className="mb-4">
        <label htmlFor="urlInput" className="block text-sm font-medium text-gray-700 mb-2">
          Ingresa una URL para analizar
        </label>
        <div className="flex">
          <input
            id="urlInput"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://ejemplo.com/ruta?param=valor"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleUrlAnalysis}
            className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
          >
            Analizar
          </button>
        </div>
      </div>

      {renderUrlGraph()}
    </div>
  );
};

export default FileExplorer;