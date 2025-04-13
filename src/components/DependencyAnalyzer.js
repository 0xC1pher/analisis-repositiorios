import React, { useState, useEffect } from 'react';

const DependencyAnalyzer = ({ repoData, accessToken }) => {
  const [dependencies, setDependencies] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeDependencies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Obtener contenido del repositorio
      const contentsResponse = await fetch(
        `https://api.github.com/repos/${repoData.owner.login}/${repoData.name}/contents`,
        {
          headers: {
            'Authorization': `token ${accessToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );
      
      if (!contentsResponse.ok) {
        throw new Error('No se pudo acceder al repositorio');
      }
      
      const contents = await contentsResponse.json();
      const packageFile = contents.find(file => file.name === 'package.json');
      
      if (!packageFile) {
        throw new Error('No se encontró package.json');
      }
      
      // Obtener package.json
      const packageResponse = await fetch(packageFile.download_url);
      const packageJson = await packageResponse.json();
      
      // Obtener dependencias instaladas
      const nodeModulesResponse = await fetch(
        `https://api.github.com/repos/${repoData.owner.login}/${repoData.name}/contents/node_modules`,
        {
          headers: {
            'Authorization': `token ${accessToken}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );
      
      const installedDeps = nodeModulesResponse.ok 
        ? (await nodeModulesResponse.json()).map(item => item.name.replace(/^@/, ''))
        : [];
      
      // Comparar dependencias
      const allDeps = [
        ...Object.keys(packageJson.dependencies || {}),
        ...Object.keys(packageJson.devDependencies || {})
      ];
      
      const missingDeps = allDeps.filter(dep => 
        !installedDeps.some(installed => installed.startsWith(dep))
      );
      
      setDependencies({
        packageJson,
        allDependencies: allDeps,
        missingDependencies: missingDeps,
        installedDependencies: installedDeps
      });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (repoData && accessToken) {
      analyzeDependencies();
    }
  }, [repoData, accessToken]);

  if (loading) return (
    <div className="text-center py-8 dark:text-white">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
      <div>Analizando dependencias...</div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 p-4 rounded-lg">
      Error: {error}
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold dark:text-white">Análisis de Dependencias</h2>
      
      {dependencies?.missingDependencies?.length > 0 ? (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-600 dark:text-red-300 mb-2">
            Dependencias Faltantes ({dependencies.missingDependencies.length})
          </h3>
          <ul className="space-y-2">
            {dependencies.missingDependencies.map((dep, index) => (
              <li key={index} className="flex items-center">
                <span className="w-4 h-4 bg-red-500 rounded-full mr-2"></span>
                <span className="font-mono dark:text-white">{dep}</span>
                <span className="ml-4 text-sm text-gray-600 dark:text-gray-400">
                  npm install {dep} --save
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <h3 className="text-lg font-medium text-green-600 dark:text-green-300">
            Todas las dependencias están instaladas correctamente
          </h3>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-medium dark:text-white mb-2">Todas las Dependencias</h3>
        <div className="flex flex-wrap gap-2">
          {dependencies?.allDependencies?.map((dep, index) => (
            <span 
              key={index} 
              className={`px-3 py-1 rounded-full text-sm ${
                dependencies.missingDependencies?.includes(dep)
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
              }`}
            >
              {dep}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DependencyAnalyzer;