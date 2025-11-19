import { CSSProperties } from "react";

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
  textSecondary: string;
  chartLine: string;
  chartPoint: string;
  chartLineBackground: string;
  graphLine: string;
  // Dashboard specific colors
  exportBg: string;
  exportBorder: string;
  dropdownBg: string;
  dropdownBorder: string;
  dropdownText: string;
  lastUpdatedBg: string;
  // Chart and tooltip colors
  tooltipBg: string;
  tooltipBorder: string;
  tooltipText: string;
  gridColor: string;
  // Icon colors
  iconPurple: string;
  iconPurpleBg: string;
  iconOrange: string;
  iconBlue: string;
  iconGreen: string;
  white: string;
}

// Define complete theme interface
export interface AppTheme {
  colors: ThemeColors;
  isDark: boolean;
}

// Light theme colors - Modern palette inspired by Stripe/Linear
const lightColors: ThemeColors = {
  bodyBg: "#F7F8FA",
  bodyColor: "#0A0D14",
  cardBg: "#FFFFFF",
  borderColor: "#E5E7EB",
  primary: "#5E5CE6",
  secondary: "#4B5563",
  success: "#34C759",
  info: "#5AC8FA",
  warning: "#FF9500",
  danger: "#FF3B30",
  textMuted: "#9CA3AF",
  textSecondary: "#5B6168",
  chartLine: "rgb(255, 255, 255)",
  graphLine: "#5E5CE6",
  chartPoint: "#7C7CFF",
  chartLineBackground: "rgba(94, 92, 230, 0.2)",
  // Dashboard specific
  exportBg: "#EBF0FA",
  exportBorder: "#D2D2D3",
  dropdownBg: "#FCFDFD",
  dropdownBorder: "#A9ABAC",
  dropdownText: "#5B6168",
  lastUpdatedBg: "#EBF0FA",
  // Chart and tooltip
  tooltipBg: "#4D4D4D",
  tooltipBorder: "#EEF0F1",
  tooltipText: "#FFFFFF",
  gridColor: "#D2D2D3",
  // Icon colors
  iconPurple: "#8280FF",
  iconPurpleBg: "#E5E4FF",
  iconOrange: "#FF9500",
  iconBlue: "#8280FF",
  iconGreen: "#00C617",
  white: "#FFFFFF",
};

// Dark theme colors - Modern dark palette
const darkColors: ThemeColors = {
  bodyBg: "#0A0A0B",
  bodyColor: "#FAFAFA",
  cardBg: "#141416",
  borderColor: "#27272A",
  primary: "#7C7CFF",
  secondary: "#A1A1AA",
  success: "#4ADE80",
  info: "#67E8F9",
  warning: "#FB923C",
  danger: "#F87171",
  textMuted: "#52525B",
  textSecondary: "#A1A1AA",
  chartLine: "rgb(255, 255, 255)",
  graphLine: "#7C7CFF",
  chartPoint: "#5E5CE6",
  chartLineBackground: "rgba(124, 124, 255, 0.25)",
  // Dashboard specific
  exportBg: "#1E1E22",
  exportBorder: "#3F3F46",
  dropdownBg: "#1E1E22",
  dropdownBorder: "#3F3F46",
  dropdownText: "#D4D4D8",
  lastUpdatedBg: "#1E1E22",
  // Chart and tooltip
  tooltipBg: "#2C2C2E",
  tooltipBorder: "#3F3F46",
  tooltipText: "#FAFAFA",
  gridColor: "#3F3F46",
  // Icon colors
  iconPurple: "#9D9BFF",
  iconPurpleBg: "#2D2C4A",
  iconOrange: "#FFB84D",
  iconBlue: "#9D9BFF",
  iconGreen: "#34D158",
  white: "#FFFFFF",
};

// Theme getter function
export const getTheme = (isDarkMode: boolean): AppTheme => ({
  colors: isDarkMode ? darkColors : lightColors,
  isDark: isDarkMode,
});

// Helper for creating dynamic styles based on theme
export type StyleCreator<Props = object> = (
  theme: AppTheme,
  props?: Props
) => CSSProperties;
