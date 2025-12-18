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
  // Additional border colors
  borderLight: string;
  borderMedium: string;
  // Shadows
  shadowCard: string;
  // Focus ring
  focusRing: string;
  // Hover states
  bgHover: string;
  // Chart/Data visualization colors
  chartOrange: string;
  chartYellow: string;
  chartBlue: string;
  chartLightGreen: string;
  chartDarkGreen: string;
  chartGray: string;
  // Status/Trend colors
  trendUpGreen: string;
  trendDownRed: string;
  // Icon backgrounds (semantic colors)
  iconBgGreen: string;
  iconBgOrange: string;
  iconBgRed: string;
  iconBgBlue: string;
  // Tooltip icon color
  iconTooltip: string;
}

// Typography tokens
export interface ThemeTypography {
  fontFamily: string;
  fontFamilyHeading: string;
  fontSizeXs: string;
  fontSizeSm: string;
  fontSizeMd: string;
  fontSizeLg: string;
  fontSizeXl: string;
  fontSize2Xl: string;
  fontSize3Xl: string;
  fontWeightNormal: number;
  fontWeightMedium: number;
  fontWeightSemibold: number;
  fontWeightBold: number;
  lineHeightTight: number;
  lineHeightNormal: number;
  lineHeightRelaxed: number;
}

// Spacing tokens
export interface ThemeSpacing {
  spacing0: string;
  spacing1: string;
  spacing2: string;
  spacing3: string;
  spacing4: string;
  spacing5: string;
  spacing6: string;
  spacing8: string;
  spacing10: string;
  spacing12: string;
  spacing16: string;
  spacing20: string;
  spacing24: string;
  spacing32: string;
  spacing40: string;
  spacing48: string;
  spacing64: string;
}

// Border radius tokens
export interface ThemeBorderRadius {
  radiusNone: string;
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusXl: string;
  radiusFull: string;
}

// Define complete theme interface
export interface AppTheme {
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
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
  textMuted: "#5B6168",
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
  // Additional border colors
  borderLight: "#eef0f1",
  borderMedium: "#a9abac",
  // Shadows
  shadowCard: "0px 6px 54px 0px rgba(0, 0, 0, 0.08)",
  // Focus ring
  focusRing: "#546fd9",
  // Hover states
  bgHover: "#f5f5f5",
  // Chart/Data visualization colors
  chartOrange: "#ff9871",
  chartYellow: "#ebb129",
  chartBlue: "#4a4cd9",
  chartLightGreen: "#98f4a0",
  chartDarkGreen: "#389001",
  chartGray: "#a0a0a0",
  // Status/Trend colors
  trendUpGreen: "#18682c",
  trendDownRed: "#d53425",
  // Icon backgrounds (semantic colors)
  iconBgGreen: "#e9fcf4",
  iconBgOrange: "#fcf3e9",
  iconBgRed: "#fce9e9",
  iconBgBlue: "#ebf1ff",
  // Tooltip icon color
  iconTooltip: "#acb6ba",
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
  // Additional border colors
  borderLight: "#27272A",
  borderMedium: "#3F3F46",
  // Shadows
  shadowCard: "0px 6px 54px 0px rgba(0, 0, 0, 0.3)",
  // Focus ring
  focusRing: "#7C7CFF",
  // Hover states
  bgHover: "#1E1E22",
  // Chart/Data visualization colors
  chartOrange: "#FFB84D",
  chartYellow: "#FDE047",
  chartBlue: "#7C7CFF",
  chartLightGreen: "#86EFAC",
  chartDarkGreen: "#4ADE80",
  chartGray: "#71717A",
  // Status/Trend colors
  trendUpGreen: "#4ADE80",
  trendDownRed: "#F87171",
  // Icon backgrounds (semantic colors)
  iconBgGreen: "#1E3A2D",
  iconBgOrange: "#3A2E1E",
  iconBgRed: "#3A1E1E",
  iconBgBlue: "#1E2A3A",
  // Tooltip icon color
  iconTooltip: "#71717A",
};

// Typography tokens (consistent across themes)
const typography: ThemeTypography = {
  fontFamily:
    "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
  fontFamilyHeading:
    "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontSizeXs: "0.75rem", // 12px
  fontSizeSm: "0.875rem", // 14px
  fontSizeMd: "1rem", // 16px
  fontSizeLg: "1.125rem", // 18px
  fontSizeXl: "1.25rem", // 20px
  fontSize2Xl: "1.5rem", // 24px
  fontSize3Xl: "1.875rem", // 30px
  fontWeightNormal: 400,
  fontWeightMedium: 500,
  fontWeightSemibold: 600,
  fontWeightBold: 700,
  lineHeightTight: 1.25,
  lineHeightNormal: 1.5,
  lineHeightRelaxed: 1.75,
};

// Spacing tokens (consistent across themes)
const spacing: ThemeSpacing = {
  spacing0: "0",
  spacing1: "0.25rem", // 4px
  spacing2: "0.5rem", // 8px
  spacing3: "0.75rem", // 12px
  spacing4: "1rem", // 16px
  spacing5: "1.25rem", // 20px
  spacing6: "1.5rem", // 24px
  spacing8: "2rem", // 32px
  spacing10: "2.5rem", // 40px
  spacing12: "3rem", // 48px
  spacing16: "4rem", // 64px
  spacing20: "5rem", // 80px
  spacing24: "6rem", // 96px
  spacing32: "8rem", // 128px
  spacing40: "10rem", // 160px
  spacing48: "12rem", // 192px
  spacing64: "16rem", // 256px
};

// Border radius tokens (consistent across themes)
const borderRadius: ThemeBorderRadius = {
  radiusNone: "0",
  radiusSm: "0.25rem", // 4px
  radiusMd: "0.5rem", // 8px
  radiusLg: "0.75rem", // 12px
  radiusXl: "1rem", // 16px
  radiusFull: "9999px", // Full rounded
};

// Theme getter function
export const getTheme = (isDarkMode: boolean): AppTheme => ({
  colors: isDarkMode ? darkColors : lightColors,
  typography,
  spacing,
  borderRadius,
  isDark: isDarkMode,
});

// Helper for creating dynamic styles based on theme
export type StyleCreator<Props = object> = (
  theme: AppTheme,
  props?: Props
) => CSSProperties;
