import { createContext } from 'react';
import { AppTheme, getTheme } from '../theme';

// Theme context type definition
export type ThemeContextType = {
  theme: AppTheme;
  toggleTheme: () => void;
};

// Create theme context with default values
export const ThemeContext = createContext<ThemeContextType>({
  theme: getTheme(false),
  toggleTheme: () => {},
}); 