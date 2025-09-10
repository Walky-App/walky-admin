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

// Light theme colors - Modern palette inspired by Stripe/Linear
const lightColors: ThemeColors = {
  bodyBg: '#F7F8FA',
  bodyColor: '#0A0D14',
  cardBg: '#FFFFFF',
  borderColor: '#E5E7EB',
  primary: '#5E5CE6',
  secondary: '#4B5563',
  success: '#34C759',
  info: '#5AC8FA',
  warning: '#FF9500',
  danger: '#FF3B30',
  textMuted: '#9CA3AF',
  chartLine: 'rgb(255, 255, 255)',
  graphLine: '#5E5CE6',
  chartPoint: '#7C7CFF',
  chartLineBackground: 'rgba(94, 92, 230, 0.2)',
};

// Dark theme colors - Modern dark palette
const darkColors: ThemeColors = {
  bodyBg: '#0A0A0B',
  bodyColor: '#FAFAFA',
  cardBg: '#141416',
  borderColor: '#27272A',
  primary: '#7C7CFF',
  secondary: '#A1A1AA',
  success: '#4ADE80',
  info: '#67E8F9',
  warning: '#FB923C',
  danger: '#F87171',
  textMuted: '#52525B',
  chartLine: 'rgb(255, 255, 255)',
  graphLine: '#7C7CFF',
  chartPoint: '#5E5CE6',
  chartLineBackground: 'rgba(124, 124, 255, 0.25)',
};

// Theme getter function
export const getTheme = (isDarkMode: boolean): AppTheme => ({
  colors: isDarkMode ? darkColors : lightColors,
  isDark: isDarkMode,
});

// Helper for creating dynamic styles based on theme
export type StyleCreator<Props = object> = (theme: AppTheme, props?: Props) => CSSProperties; 