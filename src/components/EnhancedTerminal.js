import React, { useState, useEffect, useRef, useContext } from 'react';
import { ThemeContext } from './ThemeProvider';

const EnhancedTerminal = ({ onCommandSubmit, agentResponse }) => {
  const theme = useContext(ThemeContext);
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState(['Bienvenido a CodeAgent Pro']);
  const terminalRef = useRef(null);

  useEffect(() => {
    if (agentResponse) {
      setHistory(prev => [...prev, agentResponse]);
    }
  }, [agentResponse]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!command.trim()) return;
    
    setHistory(prev => [...prev, `$ ${command}`]);
    onCommandSubmit(command);
    setCommand('');
  };

  const getPromptSymbol = () => {
    return (
      <span className={`mr-2 ${theme.colors.accent}`}>
        {theme.darkMode ? '➜' : '→'}
      </span>
    );
  };

  return (
    <div 
      className={`h-full rounded-xl overflow-hidden ${theme.darkMode ? 'bg-gray-800' : 'bg-white'}`}
      style={{ boxShadow: theme.darkMode ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)' }}
    >
      <div className={`p-3 border-b ${theme.darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex items-center">
          <div className="flex space-x-2 mr-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className={`text-sm font-mono ${theme.darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            terminal
          </div>
        </div>
      </div>
      
      <div 
        ref={terminalRef}
        className={`p-4 h-64 overflow-y-auto font-mono text-sm ${theme.darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}
      >
        {history.map((line, i) => (
          <div key={i} className={`mb-1 ${line.startsWith('$') ? 'text-blue-400' : theme.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {line.startsWith('$') ? getPromptSymbol() : ''}
            {line.replace(/^\$ /, '')}
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className={`p-3 border-t ${theme.darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex items-center">
          {getPromptSymbol()}
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            className={`flex-1 bg-transparent outline-none ${theme.darkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
            placeholder="Escribe un comando..."
            autoComplete="off"
          />
        </div>
      </form>
    </div>
  );
};

export default EnhancedTerminal;

// DONE