import React from 'react';
import { AppTheme } from '../theme';
type ThemeContextType = {
    theme: AppTheme;
    toggleTheme: () => void;
};
export declare const ThemeContext: React.Context<ThemeContextType>;
export declare const ThemeProvider: React.FC<{
    children: React.ReactNode;
}>;
export default ThemeProvider;
//# sourceMappingURL=ThemeContext.d.ts.map