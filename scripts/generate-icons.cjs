#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const SVG_DIR = path.join(__dirname, "../src/assets-v2/svg");
const OUTPUT_DIR = path.join(__dirname, "../src/components-v2/AssetIcon");
const INDEX_FILE = path.join(__dirname, "../src/components-v2/index.ts");
const ICON_MAP_FILE = path.join(OUTPUT_DIR, "icons.generated.ts");
const ICON_COMPONENT_FILE = path.join(OUTPUT_DIR, "AssetIcon.tsx");
const ICON_TYPES_FILE = path.join(OUTPUT_DIR, "AssetIcon.types.ts");

function kebabToCamel(str) {
  return str
    .split("-")
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join("");
}

function getSvgFiles() {
  if (!fs.existsSync(SVG_DIR)) {
    fs.mkdirSync(SVG_DIR, { recursive: true });
    return [];
  }
  return fs
    .readdirSync(SVG_DIR)
    .filter((f) => f.endsWith(".svg"))
    .sort();
}

function generateTypesFile(iconNames) {
  const content = `export type IconName = ${
    iconNames.length > 0 ? iconNames.map((n) => `'${n}'`).join(" | ") : "string"
  };

export interface AssetIconProps {
  name: IconName;
  size?: number | string;
  color?: string;
  strokeColor?: string;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}
`;
  fs.writeFileSync(ICON_TYPES_FILE, content, "utf-8");
}

function generateIconMapFile(svgFiles) {
  const imports = svgFiles
    .map((f) => {
      const name = f.replace(".svg", "");
      const varName = kebabToCamel(name);
      return `import ${varName} from '../../assets-v2/svg/${f}?react';`;
    })
    .join("\n");

  const mapEntries = svgFiles
    .map((f) => {
      const name = f.replace(".svg", "");
      const varName = kebabToCamel(name);
      return `  '${name}': ${varName},`;
    })
    .join("\n");

  const content = `import { FC, SVGProps } from 'react';
${imports}

const IconMap: Record<string, FC<SVGProps<SVGSVGElement>>> = {
${mapEntries}
};

export default IconMap;
export type GeneratedIconKeys = keyof typeof IconMap;
`;
  fs.writeFileSync(ICON_MAP_FILE, content, "utf-8");
}

function generateComponentFile(iconNames) {
  const content = `import React from 'react';
import IconMap from './icons.generated';
import { AssetIconProps } from './AssetIcon.types';

const AssetIcon: React.FC<AssetIconProps> = ({
  name,
  size = 24,
  color,
  strokeColor,
  className = '',
  onClick,
  style = {},
}) => {
  const SvgIcon = IconMap[name];
  if (!SvgIcon) {
    console.warn(\`Icon "\${name}" not found\`);
    return null;
  }
  return (
    <SvgIcon
      width={size}
      height={size}
      className={className}
      onClick={onClick}
      style={{
        color: color || 'currentColor',
        fill: color || 'currentColor',
        stroke: strokeColor || color || 'currentColor',
        ...style,
      }}
    />
  );
};

export default AssetIcon;
export { AssetIcon };
export type { AssetIconProps, IconName } from './AssetIcon.types';
`;
  fs.writeFileSync(ICON_COMPONENT_FILE, content, "utf-8");
}

function generateIndexFile() {
  const indexContent = `/**
 * V2 Components - Auto-generated exports
 */

export { default as AssetIcon } from './AssetIcon/AssetIcon';
export type { AssetIconProps, IconName } from './AssetIcon/AssetIcon.types';
export type { GeneratedIconKeys } from './AssetIcon/icons.generated';
`;

  fs.writeFileSync(INDEX_FILE, indexContent, "utf-8");
}

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const svgFiles = getSvgFiles();
const iconNames = svgFiles.map((f) => f.replace(".svg", ""));

console.log("\n🎨 SVG Icon Generator - V2 Design System");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

if (svgFiles.length === 0) {
  console.log("⚠️  No SVG files found in src/assets-v2/svg/\n");
  console.log("To add icons:");
  console.log("  1. Place your .svg files in src/assets-v2/svg/");
  console.log("  2. Run: yarn generate:icons\n");
  process.exit(0);
}

console.log(
  `📁 Found ${svgFiles.length} SVG file${svgFiles.length > 1 ? "s" : ""}:\n`
);

svgFiles.forEach((file, index) => {
  const iconName = file.replace(".svg", "");
  const filePath = path.join(SVG_DIR, file);
  const content = fs.readFileSync(filePath, "utf-8");

  // Extract dimensions
  const widthMatch = content.match(/width="([^"]*)"/);
  const heightMatch = content.match(/height="([^"]*)"/);
  const viewBoxMatch = content.match(/viewBox="([^"]*)"/);

  const width = widthMatch ? widthMatch[1] : "?";
  const height = heightMatch ? heightMatch[1] : "?";
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : "none";

  console.log(`  ${index + 1}. ✅ ${file}`);
  console.log(`     ├─ Icon Name: "${iconName}"`);
  console.log(`     ├─ Dimensions: ${width}x${height}`);
  console.log(`     └─ ViewBox: ${viewBox}\n`);
});

console.log("🔨 Generating components...\n");

generateTypesFile(iconNames);
console.log("  ✓ Generated AssetIcon.types.ts");

generateIconMapFile(svgFiles);
console.log("  ✓ Generated icons.generated.ts");

generateComponentFile(iconNames);
console.log("  ✓ Generated AssetIcon.tsx");

generateIndexFile();
console.log("  ✓ Generated index.ts\n");

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("✨ Icon generation complete!\n");
console.log("📦 Generated files:");
console.log(`   ├─ ${OUTPUT_DIR}/AssetIcon.tsx`);
console.log(`   ├─ ${OUTPUT_DIR}/AssetIcon.types.ts`);
console.log(`   ├─ ${OUTPUT_DIR}/icons.generated.ts`);
console.log(`   └─ ${OUTPUT_DIR}/index.ts\n`);
console.log("💡 Usage:");
console.log('   import { AssetIcon } from "@/components-v2";\n');
console.log(
  `   <AssetIcon name="${
    iconNames[0] || "icon-name"
  }" size={24} color="#8280FF" />\n`
);
console.log("📝 Available icons:");
iconNames.forEach((name) => {
  console.log(`   • ${name}`);
});
console.log("");
