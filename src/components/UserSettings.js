import React, { useState } from 'react';
import { ROLES, AI_PERSONAS } from '../config/settings';

const UserSettings = ({ onRoleChange, onPersonaChange }) => {
  const [selectedRole, setSelectedRole] = useState('DEVELOPER');
  const [selectedPersona, setSelectedPersona] = useState('HELPFUL');

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
    onRoleChange(e.target.value);
  };

  const handlePersonaChange = (e) => {
    setSelectedPersona(e.target.value);
    onPersonaChange(e.target.value);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Configuración de Usuario</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rol</label>
          <select
            value={selectedRole}
            onChange={handleRoleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {Object.entries(ROLES).map(([key, role]) => (
              <option key={key} value={key}>
                {role.name} - {role.description}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Personalidad de IA</label>
          <select
            value={selectedPersona}
            onChange={handlePersonaChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            {Object.entries(AI_PERSONAS).map(([key, persona]) => (
              <option key={key} value={key}>
                {persona.name} - {persona.prompt.substring(0, 40)}...
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;