export const getToolTip = (isDark: boolean): React.CSSProperties => ({
  '--cui-tooltip-bg': isDark ? '#000' : '#000',
  '--cui-tooltip-color': isDark ? '#fff' : '#fff',
  '--cui-tooltip-border-color': isDark ? '#333' : '#000',
} as React.CSSProperties);
