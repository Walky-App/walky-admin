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

<<<<<<< HEAD
// Light theme colors - Modern & Professional
const lightColors: ThemeColors = {
  bodyBg: '#f8fafc',
  bodyColor: '#1e293b',
  cardBg: '#ffffff',
  borderColor: '#e2e8f0',
  primary: '#3b82f6',
  secondary: '#64748b',
  success: '#10b981',
  info: '#06b6d4',
  warning: '#f59e0b',
  danger: '#ef4444',
  textMuted: '#64748b',
  chartLine: 'rgb(255, 255, 255)',
  graphLine: 'rgb(59, 130, 246)',
  chartPoint: '#8b5cf6',
  chartLineBackground: 'rgba(59, 130, 246, 0.1)',
};

// Dark theme colors - Modern & Sleek
const darkColors: ThemeColors = {
  bodyBg: '#0f172a',
  bodyColor: '#f1f5f9',
  cardBg: '#1e293b',
  borderColor: '#334155',
  primary: '#60a5fa',
  secondary: '#94a3b8',
  success: '#34d399',
  info: '#22d3ee',
  warning: '#fbbf24',
  danger: '#f87171',
  textMuted: '#94a3b8',
  chartLine: 'rgb(255, 255, 255)',
  graphLine: 'rgb(96, 165, 250)',
  chartPoint: '#a78bfa',
  chartLineBackground: 'rgba(96, 165, 250, 0.2)',
=======
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
>>>>>>> 3e959abb (fix: styles)
};

// Theme getter function
export const getTheme = (isDarkMode: boolean): AppTheme => ({
  colors: isDarkMode ? darkColors : lightColors,
  isDark: isDarkMode,
});

// Helper for creating dynamic styles based on theme
export type StyleCreator<Props = object> = (theme: AppTheme, props?: Props) => CSSProperties; 