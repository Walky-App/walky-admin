import { CSSProperties } from 'react';
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
export interface AppTheme {
    colors: ThemeColors;
    isDark: boolean;
}
export declare const getTheme: (isDarkMode: boolean) => AppTheme;
export type StyleCreator<Props = object> = (theme: AppTheme, props?: Props) => CSSProperties;
//# sourceMappingURL=theme.d.ts.map