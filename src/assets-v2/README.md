# Assets V2 - Design System Assets

This directory contains all assets for the V2 design system.

## Structure

```
assets-v2/
├── svg/           # SVG icon files
├── images/        # Image files (PNG, JPG, WebP)
└── fonts/         # Custom fonts (if needed)
```

## SVG Icons

Place your `.svg` files in the `svg/` directory and run:

```bash
yarn generate:icons
```

This will:

1. Scan all SVG files in `src/assets-v2/svg/`
2. Generate TypeScript types for icon names
3. Create a React component `<AssetIcon />` in `src/components-v2/`

### File Naming Convention

Use kebab-case for SVG filenames:

- ✅ `user-icon.svg` → `<AssetIcon name="user-icon" />`
- ✅ `calendar-event.svg` → `<AssetIcon name="calendar-event" />`
- ✅ `trend-up.svg` → `<AssetIcon name="trend-up" />`
- ❌ `UserIcon.svg` (avoid PascalCase)
- ❌ `user_icon.svg` (avoid snake_case)

### Usage Example

```tsx
import { AssetIcon } from '@/components-v2';

// Basic usage
<AssetIcon name="user-icon" />

// With size
<AssetIcon name="user-icon" width={32} height={32} />

// With color (uses CSS currentColor by default)
<AssetIcon name="user-icon" color="#8280FF" />

// With custom className
<AssetIcon name="user-icon" className="my-icon" />

// With click handler
<AssetIcon
  name="user-icon"
  onClick={() => console.log('clicked')}
/>
```

### SVG Requirements

- SVGs should be clean and optimized
- Remove unnecessary attributes (like `id`, `class`, etc.)
- Use `fill` and `stroke` attributes (they will be replaced with `currentColor` for dynamic coloring)
- Include `viewBox` attribute for proper scaling

### Example SVG File

```xml
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#8280FF"/>
  <circle cx="12" cy="12" r="8" stroke="#8280FF" stroke-width="2"/>
</svg>
```

## Workflow

1. **Add SVG**: Place your `.svg` file in `src/assets-v2/svg/`
2. **Generate**: Run `yarn generate:icons`
3. **Use**: Import and use `<AssetIcon name="your-icon" />` in your components
4. **TypeScript**: Get autocomplete for icon names (type-safe!)

## Benefits

- ✅ Type-safe icon names with TypeScript autocomplete
- ✅ Automatic component generation
- ✅ Centralized icon management
- ✅ Dynamic coloring with CSS
- ✅ Consistent sizing and styling
- ✅ Tree-shaking friendly (only used icons are bundled)
