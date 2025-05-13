# CoreUI Theming Guide

This guide explains how to work with our custom theming system built on top of CoreUI. Following these guidelines will ensure that all components support both light and dark modes consistently.

## Table of Contents

- [How Our Theme System Works](#how-our-theme-system-works)
- [Using the Theme in Components](#using-the-theme-in-components)
- [Adding New Components](#adding-new-components)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## How Our Theme System Works

Our theme system extends CoreUI's built-in theming with a centralized approach:

1. **Theme Configuration**: All theme colors and values are defined in `src/theme.ts`
2. **Theme Provider**: The `ThemeContext` manages the current theme state
3. **CSS Variables**: Theme colors are applied as CSS variables with the `--app-*` prefix
4. **CoreUI Integration**: We maintain compatibility with CoreUI by setting the `data-coreui-theme` attribute

### Theme Structure

Our theme is structured as an object with the following properties:

```typescript
// Theme object structure
{
  colors: {
    bodyBg: string;       // Background color for pages
    bodyColor: string;    // Default text color
    cardBg: string;       // Background for cards and containers
    borderColor: string;  // Color for borders
    primary: string;      // Primary brand color
    secondary: string;    // Secondary brand color
    success: string;      // Success state color
    info: string;         // Info state color
    warning: string;      // Warning state color
    danger: string;       // Danger/error state color
    textMuted: string;    // Muted text color
    chartLine: string;    // Color for chart lines
    chartPoint: string;   // Color for chart points
  },
  isDark: boolean;        // Whether the current theme is dark mode
}
```

## Using the Theme in Components

To use the theme in your components:

1. Import the `useTheme` hook:

```tsx
import { useTheme } from '../hooks/useTheme';
```

2. Access the theme object in your component:

```tsx
const MyComponent = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div style={{ backgroundColor: theme.colors.cardBg, color: theme.colors.bodyColor }}>
      <h2 style={{ color: theme.colors.primary }}>Themed Component</h2>
      <button onClick={toggleTheme}>
        Switch to {theme.isDark ? 'Light' : 'Dark'} Mode
      </button>
    </div>
  );
};
```

3. For CSS styling, use the CSS variables:

```css
.my-component {
  background-color: var(--app-cardBg);
  color: var(--app-bodyColor);
  border: 1px solid var(--app-borderColor);
}

.my-component h2 {
  color: var(--app-primary);
}
```

## Adding New Components

When creating new components with CoreUI:

1. **Avoid Hardcoded Colors**: Never use hardcoded color values like `#ffffff` or `rgb(0,0,0)`

2. **Use Theme Properties**: Always reference colors from the theme object:

```tsx
import { useTheme } from '../hooks/useTheme';
import { CCard, CCardBody, CCardTitle } from '@coreui/react';

const NewComponent = () => {
  const { theme } = useTheme();
  
  return (
    <CCard>
      <CCardBody>
        <CCardTitle style={{ color: theme.colors.primary }}>
          New Component
        </CCardTitle>
        <div style={{ 
          backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          padding: '1rem'
        }}>
          Content with dynamic background
        </div>
      </CCardBody>
    </CCard>
  );
};
```

3. **Create Style Objects**: For complex styling, create style objects:

```tsx
const NewComponent = () => {
  const { theme } = useTheme();
  
  const styles = {
    container: {
      backgroundColor: theme.colors.cardBg,
      borderRadius: '4px',
      padding: '1rem',
      boxShadow: theme.isDark 
        ? '0 2px 5px rgba(0,0,0,0.3)' 
        : '0 1px 3px rgba(0,0,0,0.1)'
    },
    title: {
      color: theme.colors.primary,
      fontSize: '1.2rem',
      marginBottom: '0.5rem'
    }
  };
  
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Styled Component</h3>
      <p>Content here</p>
    </div>
  );
};
```

4. **For Chart Components**: Update both the data and options with theme colors:

```tsx
import { CChartLine } from '@coreui/react-chartjs';
import { useTheme } from '../hooks/useTheme';

const ThemedChart = () => {
  const { theme } = useTheme();
  
  const chartOptions = {
    scales: {
      x: {
        grid: { color: `${theme.colors.borderColor}33` }
      },
      y: {
        grid: { color: `${theme.colors.borderColor}33` }
      }
    },
    elements: {
      line: { borderColor: theme.colors.chartLine },
      point: { backgroundColor: theme.colors.chartPoint }
    }
  };
  
  return (
    <CChartLine
      data={{
        labels: ['Jan', 'Feb', 'Mar'],
        datasets: [{
          label: 'Data',
          backgroundColor: `${theme.colors.primary}33`,
          borderColor: theme.colors.primary,
          data: [10, 20, 15]
        }]
      }}
      options={chartOptions}
    />
  );
};
```

## Best Practices

1. **CSS Variables First**: Prefer CSS variables for styling when possible:

```css
.component {
  background-color: var(--app-cardBg);
  color: var(--app-bodyColor);
}
```

2. **Inline Styles for Dynamic Content**: Use inline styles with theme properties for dynamic content:

```tsx
<div style={{ backgroundColor: theme.colors.cardBg }}>
  Dynamic content
</div>
```

3. **Alpha Transparency**: To create transparency variations, use hex with alpha or rgba:

```tsx
// Adding 33 for ~20% opacity
const bgWithOpacity = `${theme.colors.primary}33`;

// Or with rgba
const textWithOpacity = `rgba(${hexToRgb(theme.colors.primary)}, 0.7)`;
```

4. **Avoid Theme Checks**: Instead of checking `theme.isDark`, use the appropriate theme color directly:

```tsx
// ❌ Avoid this
const textColor = theme.isDark ? 'white' : 'black';

// ✅ Do this instead
const textColor = theme.colors.bodyColor;
```

5. **Extend the Theme**: If you need a new color, add it to the theme system in `src/theme.ts`:

```typescript
// Add to ThemeColors interface
export interface ThemeColors {
  // existing colors...
  newColor: string;
}

// Add to both light and dark theme objects
const lightColors: ThemeColors = {
  // existing colors...
  newColor: '#yourLightColor',
};

const darkColors: ThemeColors = {
  // existing colors...
  newColor: '#yourDarkColor',
};
```

## Troubleshooting

### Component Not Updating with Theme

If your component doesn't update when the theme changes:

1. Verify you're using the `useTheme` hook correctly
2. Check if the component is memoized without theme dependency
3. Ensure you're referencing theme properties, not destructured variables

### CSS Styles Not Applying

If CSS styles aren't applying correctly:

1. Check that you're using the correct CSS variable name (`--app-propertyName`)
2. Inspect the DOM to verify CSS variables are being set
3. Ensure no other styles are overriding your themed styles (check specificity)

### Adding New Theme Properties

When extending the theme with new properties:

1. Add the property to the `ThemeColors` interface in `src/theme.ts`
2. Add values for both light and dark themes
3. Restart your development server to ensure TypeScript picks up the changes

---

For any questions or issues with theming, please contact the senior developer on your team. 