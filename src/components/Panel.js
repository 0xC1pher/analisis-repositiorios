import React, { useContext } from 'react';
import { ThemeContext } from './ThemeProvider';

const Panel = ({ title, children, className = '', ...props }) => {
  const theme = useContext(ThemeContext);
  
  return (
    <div 
      className={`rounded-xl shadow-lg overflow-hidden transition-all duration-200 ${theme.darkMode ? 'bg-gray-800' : 'bg-white'} ${className}`}
      {...props}
    >
      {title && (
        <div className={`px-6 py-4 border-b ${theme.darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h3 className={`text-lg font-semibold ${theme.darkMode ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Panel;