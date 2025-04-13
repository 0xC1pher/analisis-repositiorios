import React, { useState } from 'react';
import RepositoryView from './RepositoryView';

const GitHubIntegration = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [repoData, setRepoData] = useState(null);
  const [error, setError] = useState(null);

  const extractRepoInfo = (url) => {
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    return match ? { owner: match[1], repo: match[2] } : null;
  };

  const fetchRepoData = async () => {
    const repoInfo = extractRepoInfo(repoUrl);
    if (!repoInfo || !accessToken) return;

    setError(null);
    try {
      const response = await fetch(
        `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}`,
        {
          headers: {
            'Authorization': `token ${accessToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Error al acceder al repositorio');
      }

      const data = await response.json();
      setRepoData(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Análisis de Repositorio</h1>
      
      {!repoData ? (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL del Repositorio GitHub</label>
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/usuario/repositorio"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Token de Acceso Personal</label>
              <input
                type="password"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && <div className="text-red-500">{error}</div>}

            <button
              onClick={fetchRepoData}
              disabled={!repoUrl || !accessToken}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              Conectar Repositorio
            </button>
          </div>
        </div>
      ) : (
        <RepositoryView repoData={repoData} accessToken={accessToken} />
      )}
    </div>
  );
};

export default GitHubIntegration;