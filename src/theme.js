// Light theme colors
const lightColors = {
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
    chartLineBackground: 'rgba(15, 143, 222, 0.36)',
};
// Dark theme colors
const darkColors = {
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
export const getTheme = (isDarkMode) => ({
    colors: isDarkMode ? darkColors : lightColors,
    isDark: isDarkMode,
});
