export const getToolTip = (isDark: boolean): React.CSSProperties => ({
  '--cui-tooltip-bg': isDark ? '#fff' : '#000',
  '--cui-tooltip-color': isDark ? '#000' : '#fff',
  '--cui-tooltip-border-color': isDark ? '#333' : '#000',
} as React.CSSProperties);
