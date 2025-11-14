#!/usr/bin/env node

/**
 * Script to verify if React components have data-testid
 * Runs on pre-commit to ensure testability
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REQUIRED_PATTERNS = {
  button: /(<button[\s\S]*?>)/g,
  input: /(<input[\s\S]*?\/>)/g,
  form: /(<form[\s\S]*?>)/g,
};

const EXEMPT_DIRS = ["node_modules", "dist", "build", ".git", "coverage"];
const TARGET_DIRS = ["src/pages-v2", "src/components-v2"];

let hasErrors = false;
const errors = [];

function checkFile(filePath) {
  if (!filePath.endsWith(".tsx")) return;

  const content = fs.readFileSync(filePath, "utf-8");
  const relativePath = path.relative(process.cwd(), filePath);

  // Verifica cada padrão
  Object.entries(REQUIRED_PATTERNS).forEach(([elementType, pattern]) => {
    const matches = content.matchAll(pattern);

    for (const match of matches) {
      let element = match[0];

      // Para inputs auto-fechados, pega mais contexto se necessário
      if (elementType === "input" && !element.includes("/>")) {
        // Busca até encontrar o fechamento />
        const restOfContent = content.substring(match.index);
        const closingIndex = restOfContent.indexOf("/>");
        if (closingIndex > -1) {
          element = restOfContent.substring(0, closingIndex + 2);
        }
      }

      // Ignora se já tem data-testid
      if (element.includes("data-testid")) continue;

      // Ignora buttons que são apenas de navegação (como links)
      if (
        elementType === "button" &&
        element.includes('className="resend-link"')
      )
        continue; // Encontra a linha do erro
      const beforeMatch = content.substring(0, match.index);
      const lineNumber = beforeMatch.split("\n").length;

      errors.push({
        file: relativePath,
        line: lineNumber,
        element: elementType,
        snippet:
          element.substring(0, 100).replace(/\n/g, " ").replace(/\s+/g, " ") +
          "...",
      });
      hasErrors = true;
    }
  });
}

function scanDirectory(dir) {
  if (!fs.existsSync(dir)) return;

  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!EXEMPT_DIRS.includes(item)) {
        scanDirectory(fullPath);
      }
    } else {
      checkFile(fullPath);
    }
  });
}

console.log("🔍 Checking data-testid in components...\n");

TARGET_DIRS.forEach((dir) => {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    scanDirectory(fullPath);
  }
});

if (hasErrors) {
  console.error("❌ Components without data-testid found:\n");
  errors.forEach((error) => {
    console.error(`  ${error.file}:${error.line}`);
    console.error(`    Element: <${error.element}> missing data-testid`);
    console.error(`    Snippet: ${error.snippet}\n`);
  });
  console.error(`\n⚠️  Total elements without test ID: ${errors.length}`);
  console.error(
    '💡 Add data-testid="descriptive-element" to interactive elements\n'
  );
  process.exit(1);
} else {
  console.log("✅ All interactive elements have data-testid!\n");
  process.exit(0);
}
