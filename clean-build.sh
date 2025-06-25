#!/bin/bash

echo "Cleaning TypeScript artifacts and build files..."

# Remove any declaration files and source maps from project root
echo "Cleaning project root..."
find . -maxdepth 1 -type f \( -name "*.d.ts" -o -name "*.d.ts.map" -o -name "*.js.map" -o -name "*.tsbuildinfo" \) -not -path "*/node_modules/*" -exec rm -f {} \;

# Remove any TypeScript generated files from src directory (excluding vite-env.d.ts)
echo "Cleaning src directory..."
find src -type f \( -name "*.js" -o -name "*.js.map" -o -name "*.d.ts.map" \) -exec rm -f {} \;
find src -type f -name "*.d.ts" ! -name "vite-env.d.ts" -exec rm -f {} \;

# Clean dist directory if it exists
if [ -d "dist" ]; then
  echo "Removing dist directory..."
  rm -rf dist
fi

# Clean any temporary tsconfig files
echo "Cleaning temporary TypeScript files..."
find . -maxdepth 1 -type f -name "tsconfig.*.json" ! -name "tsconfig.json" ! -name "tsconfig.app.json" ! -name "tsconfig.node.json" -exec rm -f {} \;

echo "Cleanup complete!"
exit 0  