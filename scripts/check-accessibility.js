#!/usr/bin/env node

/**
 * Script para verificar atributos de acessibilidade em componentes React
 * Executa no pre-commit para garantir WCAG compliance
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ACCESSIBILITY_CHECKS = {
  img: {
    required: ["alt"],
    message: "Imagens devem ter atributo alt",
  },
  input: {
    required: ["aria-label", "aria-required"],
    optional: true, // Pelo menos um é necessário
    message: "Inputs devem ter aria-label ou aria-required",
  },
  button: {
    required: ["aria-label"],
    message: "Botões devem ter aria-label",
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
        issue: "Faltando atributo alt",
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
        issue: "Faltando aria-label ou id (para associar com label)",
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
          issue: "Faltando aria-label ou conteúdo de texto",
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

console.log("♿ Verificando acessibilidade (WCAG)...\n");

TARGET_DIRS.forEach((dir) => {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    scanDirectory(fullPath);
  }
});

if (hasErrors) {
  console.error("❌ Problemas de acessibilidade encontrados:\n");

  const groupedErrors = errors.reduce((acc, error) => {
    if (!acc[error.file]) acc[error.file] = [];
    acc[error.file].push(error);
    return acc;
  }, {});

  Object.entries(groupedErrors).forEach(([file, fileErrors]) => {
    console.error(`  📄 ${file}`);
    fileErrors.forEach((error) => {
      console.error(`    Linha ${error.line}: ${error.issue}`);
      console.error(`      ${error.snippet}\n`);
    });
  });

  console.error(`\n⚠️  Total de problemas: ${errors.length}`);
  console.error("💡 Dicas:");
  console.error('   - Adicione alt="" às imagens');
  console.error("   - Adicione aria-label aos inputs e buttons");
  console.error('   - Use aria-required="true" em campos obrigatórios\n');
  process.exit(1);
} else {
  console.log("✅ Todos os componentes estão acessíveis!\n");
  process.exit(0);
}
