import React, { createContext, useState } from 'react';

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true);
  
  const theme = {
    darkMode,
    toggleTheme: () => setDarkMode(!darkMode),
    colors: darkMode ? {
      primary: '#3B82F6',
      secondary: '#10B981',
      background: '#1F2937',
      surface: '#374151',
      text: '#F9FAFB',
      accent: '#F59E0B',
      error: '#EF4444',
      success: '#10B981'
    } : {
      primary: '#2563EB',
      secondary: '#059669',
      background: '#F9FAFB',
      surface: '#FFFFFF',
      text: '#111827',
      accent: '#D97706',
      error: '#DC2626',
      success: '#059669'
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;