import React, { useState } from 'react';
import GitHubIntegration from './components/GitHubIntegration';
import UserSettings from './components/UserSettings';
import ThemeToggle from './components/ThemeToggle';
import { ROLES, AI_PERSONAS } from './config/settings';

const App = () => {
  const [currentRole, setCurrentRole] = useState(ROLES.DEVELOPER);
  const [currentPersona, setCurrentPersona] = useState(AI_PERSONAS.HELPFUL);

  const handleRoleChange = (roleKey) => {
    setCurrentRole(ROLES[roleKey]);
  };

  const handlePersonaChange = (personaKey) => {
    setCurrentPersona(AI_PERSONAS[personaKey]);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">CodeInsight Pro</h1>
          <ThemeToggle />
        </div>
        
        <UserSettings 
          onRoleChange={handleRoleChange} 
          onPersonaChange={handlePersonaChange} 
        />
        
        <GitHubIntegration 
          currentRole={currentRole} 
          currentPersona={currentPersona} 
        />
      </div>
    </div>
  );
};

export default App;

// DONE