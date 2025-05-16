import { createContext } from 'react';
import { getTheme } from '../theme';
// Create theme context with default values
export const ThemeContext = createContext({
    theme: getTheme(false),
    toggleTheme: () => { },
});
