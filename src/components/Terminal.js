import React, { useState } from 'react';

const Terminal = ({ output, onCommandSubmit }) => {
  const [command, setCommand] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (command.trim()) {
      onCommandSubmit(command);
      setCommand('');
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg h-full flex flex-col">
      <div className="p-2 border-b border-gray-700 text-gray-300 font-mono text-sm">
        Terminal - Ollama
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 font-mono text-sm text-green-400 whitespace-pre-wrap">
        {output}
      </div>
      
      <form onSubmit={handleSubmit} className="p-2 border-t border-gray-700 flex">
        <span className="text-green-400 mr-2">$</span>
        <input
          type="text"
          className="flex-1 bg-gray-800 text-gray-100 border-none focus:outline-none"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          autoComplete="off"
        />
      </form>
    </div>
  );
};

export default Terminal;

// DONE