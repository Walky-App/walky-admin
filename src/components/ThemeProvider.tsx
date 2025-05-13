import React, { useState, useEffect } from 'react';
import { getTheme } from '../theme';
import { ThemeContext } from '../contexts/ThemeContext';

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize theme from localStorage or system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Check if user prefers dark mode
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Get the current theme based on dark mode state
  const theme = getTheme(isDarkMode);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // Apply theme to the document element
  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Apply theme class to the document element
    document.documentElement.setAttribute('data-coreui-theme', isDarkMode ? 'dark' : 'light');
    
    // Apply CSS variables for our custom theme colors
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--app-${key}`, value);
    });
    
    // Add/remove dark mode class from body for custom styles
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkMode, theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 