import React from 'react';
import { ThemeContext } from './ThemeProvider';

const AppLayout = ({ children }) => {
  return (
    <ThemeContext.Consumer>
      {theme => (
        <div className={`min-h-screen ${theme.darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-12 gap-6">
              {children}
            </div>
          </div>
        </div>
      )}
    </ThemeContext.Consumer>
  );
};

export default AppLayout;