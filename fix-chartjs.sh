#!/bin/bash

# Fix for chart.js TypeScript error
# The @coreui/react-chartjs package depends on chart.js but it's not listed as a dependency

echo "Fixing chart.js TypeScript error..."

# Install chart.js (v4.x to match the @types/chart.js version)
yarn add chart.js@^4.0.0

# Remove the old @types/chart.js as chart.js v4 includes its own types
yarn remove @types/chart.js

echo "Done! Now try running 'yarn run build' again."