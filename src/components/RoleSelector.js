import React, { useState, useContext } from 'react';
import { ThemeContext } from './ThemeProvider';

const RoleSelector = ({ roles, selectedRole, onSelect }) => {
  const theme = useContext(ThemeContext);
  
  return (
    <div className={`p-4 rounded-xl ${theme.darkMode ? 'bg-gray-800' : 'bg-white'} mb-6`}>
      <h3 className={`text-lg font-semibold mb-3 ${theme.darkMode ? 'text-white' : 'text-gray-900'}`}>
        Rol del Agente
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {Object.keys(roles).map(role => (
          <button
            key={role}
            onClick={() => onSelect(role)}
            className={`p-3 rounded-lg border transition-all ${selectedRole === role 
              ? `border-${theme.colors.primary} bg-${theme.colors.primary} bg-opacity-10`
              : theme.darkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'}`}
          >
            <div className={`font-medium ${selectedRole === role ? `text-${theme.colors.primary}` : theme.darkMode ? 'text-white' : 'text-gray-900'}`}>
              {role === 'backendExpert' ? 'Experto Backend' : 'Arquitecto Software'}
            </div>
            <div className={`text-xs mt-1 ${theme.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {roles[role].system.split('\n')[0]}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoleSelector;