# V2 Images

This directory contains PNG and JPEG images for the V2 design system.

## Usage

1. Add your `.png` or `.jpg`/`.jpeg` files to this directory
2. Run `yarn generate:images` to auto-generate React components
3. Use the `AssetImage` component in your code:

```tsx
import { AssetImage } from "@/components-v2";

<AssetImage name="logo" alt="Company Logo" width={200} height={50} />;
```

## File Naming

- Use kebab-case: `company-logo.png`, `user-avatar.jpg`
- Be descriptive: `empty-state-illustration.png`
- Avoid spaces and special characters

## Supported Formats

- `.png`
- `.jpg`
- `.jpeg`

## Auto-generated Files

When you run `yarn generate:images`, the following files are generated:

- `components-v2/AssetImage/AssetImage.tsx` - Main image component
- `components-v2/AssetImage/AssetImage.types.ts` - TypeScript types
- `components-v2/AssetImage/images.generated.ts` - Image imports map
