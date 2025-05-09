import { CSSProperties } from 'react';

// Define theme interface
export interface ThemeColors {
  bodyBg: string;
  bodyColor: string;
  cardBg: string;
  borderColor: string;
  primary: string;
  secondary: string;
  success: string;
  info: string;
  warning: string;
  danger: string;
  textMuted: string;
  chartLine: string;
  chartPoint: string;
  chartLineBackground: string;
  graphLine: string;
}

// Define complete theme interface
export interface AppTheme {
  colors: ThemeColors;
  isDark: boolean;
}

// Light theme colors
const lightColors: ThemeColors = {
  bodyBg: '#f8f9fa',
  bodyColor: '#333',
  cardBg: '#fff',
  borderColor: '#dee2e6',
  primary: '#321fdb',
  secondary: '#9da5b1',
  success: '#2eb85c',
  info: '#39f',
  warning: '#f9b115',
  danger: 'rgb(253, 120, 120)',
  textMuted: '#6c757d',
  chartLine: 'rgb(255, 255, 255)',
  graphLine: 'rgb(15, 143, 222)',
  chartPoint: '#5856d6',
  chartLineBackground: 'rgba(15, 143, 222, 0.37)',
};

// Dark theme colors
const darkColors: ThemeColors = {
  bodyBg: '#1e2125',
  bodyColor: '#e1e5eb',
  cardBg: '#212631',
  borderColor: '#495057',
  primary: '#4e5ec7',
  secondary: '#a6aab2',
  success: '#3dd273',
  info: '#4dabf7',
  warning: '#fbc43d',
  danger: 'rgb(253, 120, 120)',
  textMuted: '#adb5bd',
  chartLine: 'rgb(255, 255, 255)',
  graphLine: 'rgb(15, 143, 222)',
  chartPoint: '#7c7bff',
  chartLineBackground: 'rgba(15, 143, 222, 0.37)',
};

// Theme getter function
export const getTheme = (isDarkMode: boolean): AppTheme => ({
  colors: isDarkMode ? darkColors : lightColors,
  isDark: isDarkMode,
});

// Helper for creating dynamic styles based on theme
export type StyleCreator<Props = object> = (theme: AppTheme, props?: Props) => CSSProperties; 