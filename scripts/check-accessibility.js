#!/usr/bin/env node

/**
 * Script to verify accessibility attributes in React components
 * Runs on pre-commit to ensure WCAG compliance
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ACCESSIBILITY_CHECKS = {
  img: {
    required: ["alt"],
    message: "Images must have alt attribute",
  },
  input: {
    required: ["aria-label", "aria-required"],
    optional: true, // At least one is required
    message: "Inputs must have aria-label or aria-required",
  },
  button: {
    required: ["aria-label"],
    message: "Buttons must have aria-label",
  },
};

const EXEMPT_DIRS = ["node_modules", "dist", "build", ".git", "coverage"];
const TARGET_DIRS = ["src/pages-v2", "src/components-v2"];

let hasErrors = false;
const errors = [];

function checkAccessibility(filePath) {
  if (!filePath.endsWith(".tsx")) return;

  const content = fs.readFileSync(filePath, "utf-8");
  const relativePath = path.relative(process.cwd(), filePath);

  // Verifica imagens sem alt
  const imgPattern = /<img[\s\S]*?>/g;
  const imgMatches = content.matchAll(imgPattern);

  for (const match of imgMatches) {
    const element = match[0];

    // Ignora se é decorativo (aria-hidden)
    if (element.includes('aria-hidden="true"')) continue;

    if (!element.includes("alt=")) {
      const beforeMatch = content.substring(0, match.index);
      const lineNumber = beforeMatch.split("\n").length;

      errors.push({
        file: relativePath,
        line: lineNumber,
        type: "img",
        issue: "Missing alt attribute",
        snippet: element.substring(0, 80) + "...",
      });
      hasErrors = true;
    }
  }

  // Verifica inputs sem aria-label ou aria-required
  const inputPattern = /<input[\s\S]*?>/g;
  const inputMatches = content.matchAll(inputPattern);

  for (const match of inputMatches) {
    const element = match[0];

    // Input deve ter pelo menos aria-label OU estar associado a um label
    const hasAriaLabel = element.includes("aria-label");
    const hasId = element.includes("id=");

    if (!hasAriaLabel && !hasId) {
      const beforeMatch = content.substring(0, match.index);
      const lineNumber = beforeMatch.split("\n").length;

      errors.push({
        file: relativePath,
        line: lineNumber,
        type: "input",
        issue: "Missing aria-label or id (to associate with label)",
        snippet: element.substring(0, 80) + "...",
      });
      hasErrors = true;
    }
  }

  // Verifica buttons sem aria-label
  const buttonPattern = /<button[\s\S]*?>/g;
  const buttonMatches = content.matchAll(buttonPattern);

  for (const match of buttonMatches) {
    const element = match[0];

    // Button deve ter aria-label ou texto interno visível
    const hasAriaLabel = element.includes("aria-label");

    // Se não tem aria-label, verifica se tem conteúdo de texto
    // (isso é uma verificação simplificada)
    const closingTag = content.indexOf("</button>", match.index);
    if (closingTag > -1) {
      const buttonContent = content.substring(
        match.index + element.length,
        closingTag
      );
      const hasTextContent =
        buttonContent.trim().length > 0 && !buttonContent.includes("<svg");

      if (!hasAriaLabel && !hasTextContent) {
        const beforeMatch = content.substring(0, match.index);
        const lineNumber = beforeMatch.split("\n").length;

        errors.push({
          file: relativePath,
          line: lineNumber,
          type: "button",
          issue: "Missing aria-label or text content",
          snippet: element.substring(0, 80) + "...",
        });
        hasErrors = true;
      }
    }
  }
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
      checkAccessibility(fullPath);
    }
  });
}

console.log("♿ Checking accessibility (WCAG)...\n");

TARGET_DIRS.forEach((dir) => {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    scanDirectory(fullPath);
  }
});

if (hasErrors) {
  console.error("❌ Accessibility issues found:\n");

  const groupedErrors = errors.reduce((acc, error) => {
    if (!acc[error.file]) acc[error.file] = [];
    acc[error.file].push(error);
    return acc;
  }, {});

  Object.entries(groupedErrors).forEach(([file, fileErrors]) => {
    console.error(`  📄 ${file}`);
    fileErrors.forEach((error) => {
      console.error(`    Line ${error.line}: ${error.issue}`);
      console.error(`      ${error.snippet}\n`);
    });
  });

  console.error(`\n⚠️  Total issues: ${errors.length}`);
  console.error("💡 Tips:");
  console.error('   - Add alt="" to images');
  console.error("   - Add aria-label to inputs and buttons");
  console.error('   - Use aria-required="true" on required fields\n');
  process.exit(1);
} else {
  console.log("✅ All components are accessible!\n");
  process.exit(0);
}
