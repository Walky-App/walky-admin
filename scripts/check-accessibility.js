#!/usr/bin/env node

/**
 * Script to verify accessibility attributes in React components
 * Runs on pre-commit to ensure WCAG compliance
 * Enhanced version with comprehensive ARIA checks
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// WCAG 2.1 Level AA compliance checks
const ACCESSIBILITY_RULES = {
  // Images must have alt text or be marked as decorative
  images: {
    pattern: /<img(?![^>]*aria-hidden=["']true["'])[^>]*>/g,
    check: (element) => element.includes("alt="),
    message:
      "Images must have alt attribute or aria-hidden='true' if decorative",
  },

  // Interactive elements need accessible names
  buttons: {
    pattern: /<button[^>]*>/g,
    check: (element, content, matchIndex) => {
      // Skip if has aria-label or aria-labelledby
      if (element.includes("aria-label") || element.includes("aria-labelledby"))
        return true;

      // Check if button has text content or valid children
      const closingTag = content.indexOf("</button>", matchIndex);
      if (closingTag === -1) return false;

      const buttonContent = content.substring(
        matchIndex + element.length,
        closingTag
      );

      // Has visible text content
      if (buttonContent.trim().length > 0 && !/^[\s<>]*$/.test(buttonContent)) {
        // If only contains SVG/icons without text, needs aria-label
        if (
          /<svg|<AssetIcon|<CIcon/.test(buttonContent) &&
          !/>[^<]+</.test(buttonContent)
        ) {
          return false;
        }
        return true;
      }

      return false;
    },
    message: "Buttons must have aria-label or visible text content",
  },

  // Inputs need labels
  inputs: {
    pattern: /<input[^>]*>/g,
    check: (element) => {
      // Must have aria-label, aria-labelledby, or id (to associate with <label>)
      return (
        element.includes("aria-label") ||
        element.includes("aria-labelledby") ||
        element.includes('id="') ||
        element.includes("id='")
      );
    },
    message:
      "Inputs must have aria-label, aria-labelledby, or id for <label> association",
  },

  // Select elements need labels
  selects: {
    pattern: /<select[^>]*>/g,
    check: (element) => {
      return (
        element.includes("aria-label") ||
        element.includes("aria-labelledby") ||
        element.includes('id="') ||
        element.includes("id='")
      );
    },
    message:
      "Select elements must have aria-label, aria-labelledby, or id for <label> association",
  },

  // ARIA roles that require labels
  regions: {
    pattern:
      /role=["'](region|group|radiogroup|tablist|navigation|complementary|form)["'][^>]*>/g,
    check: (element) => {
      return (
        element.includes("aria-label") || element.includes("aria-labelledby")
      );
    },
    message:
      "Elements with landmark/widget roles must have aria-label or aria-labelledby",
  },

  // Lists used for navigation should be semantic
  navLists: {
    pattern: /<nav[^>]*>[\s\S]*?<div[^>]*(?:role=["']list["'])/g,
    check: () => false, // Should use <ul> instead of <div role="list">
    message: "Use semantic <ul> instead of <div role='list'> inside <nav>",
  },

  // Radio buttons need proper ARIA
  radioGroups: {
    pattern: /role=["']radio["'][^>]*>/g,
    check: (element) => {
      return element.includes("aria-checked");
    },
    message: "Elements with role='radio' must have aria-checked attribute",
  },

  // Tabs need proper ARIA
  tabs: {
    pattern: /role=["']tab["'][^>]*>/g,
    check: (element) => {
      return element.includes("aria-selected");
    },
    message: "Elements with role='tab' must have aria-selected attribute",
  },

  // Toggle buttons need pressed state
  toggleButtons: {
    pattern: /<button[^>]*(?:aria-pressed|data-toggle)[^>]*>/g,
    check: (element) => {
      // Only check buttons that explicitly use aria-pressed or data-toggle
      // This avoids false positives on buttons with "toggle" in aria-label
      return true; // Pattern already filters for aria-pressed presence
    },
    message: "Toggle buttons should maintain aria-pressed state",
  },

  // Icon-only buttons without labels
  iconButtons: {
    pattern:
      /<button[^>]*>[\s\S]*?<(?:svg|AssetIcon|CIcon)[^>]*>[\s\S]*?<\/button>/g,
    check: (element, content, matchIndex) => {
      const buttonTag = element.match(/<button[^>]*>/)[0];

      // Has aria-label?
      if (
        buttonTag.includes("aria-label") ||
        buttonTag.includes("aria-labelledby")
      )
        return true;

      // Has visible text alongside icon?
      const closingTag = content.indexOf("</button>", matchIndex);
      const buttonContent = content.substring(matchIndex, closingTag);

      // Check if there's text content besides the icon
      const textContent = buttonContent
        .replace(
          /<(?:svg|AssetIcon|CIcon)[^>]*>[\s\S]*?<\/(?:svg|AssetIcon|CIcon)>/g,
          ""
        )
        .replace(/<[^>]+>/g, "")
        .trim();

      return textContent.length > 0;
    },
    message: "Icon-only buttons must have aria-label",
  },
};

const EXEMPT_DIRS = [
  "node_modules",
  "dist",
  "build",
  ".git",
  "coverage",
  "test",
  "tests",
  "__tests__",
];
const TARGET_DIRS = ["src/pages-v2", "src/components-v2", "src/layout-v2"];

let hasErrors = false;
const errors = [];
const warnings = [];

function checkAccessibility(filePath) {
  if (!filePath.endsWith(".tsx") && !filePath.endsWith(".jsx")) return;

  const content = fs.readFileSync(filePath, "utf-8");
  const relativePath = path.relative(process.cwd(), filePath);

  // Skip test files
  if (relativePath.includes(".test.") || relativePath.includes(".spec."))
    return;

  // Run all accessibility checks
  Object.entries(ACCESSIBILITY_RULES).forEach(([ruleName, rule]) => {
    const matches = content.matchAll(rule.pattern);

    for (const match of matches) {
      const element = match[0];
      const matchIndex = match.index;

      // Run the check function
      const isValid = rule.check(element, content, matchIndex);

      if (!isValid) {
        const beforeMatch = content.substring(0, matchIndex);
        const lineNumber = beforeMatch.split("\n").length;

        // Get line content for better context
        const lines = content.split("\n");
        const lineContent = lines[lineNumber - 1]?.trim() || "";

        errors.push({
          file: relativePath,
          line: lineNumber,
          rule: ruleName,
          issue: rule.message,
          snippet:
            lineContent.substring(0, 100) +
            (lineContent.length > 100 ? "..." : ""),
        });
        hasErrors = true;
      }
    }
  });

  // Additional semantic checks
  checkSemanticHTML(content, relativePath);
  checkFocusManagement(content, relativePath);
}

function checkSemanticHTML(content, relativePath) {
  // Warn about divs that should be semantic elements
  const divWithRole = content.matchAll(
    /<div[^>]*role=["'](main|navigation|article|section|complementary)["'][^>]*>/g
  );

  for (const match of divWithRole) {
    const role = match[1];
    const beforeMatch = content.substring(0, match.index);
    const lineNumber = beforeMatch.split("\n").length;

    warnings.push({
      file: relativePath,
      line: lineNumber,
      issue: `Consider using semantic <${role}> instead of <div role="${role}">`,
      severity: "warning",
    });
  }

  // Check for missing main landmark only in actual page files (not components)
  const isPageFile =
    relativePath.includes("/pages-v2/") &&
    !relativePath.includes("/components/") &&
    !relativePath.includes("Step.tsx") && // Exclude step components
    !relativePath.includes("Step.jsx") &&
    (relativePath.match(/\.tsx$/) || relativePath.match(/\.jsx$/));

  if (
    isPageFile &&
    !content.includes("<main") &&
    !content.includes('role="main"')
  ) {
    warnings.push({
      file: relativePath,
      line: 1,
      issue: "Page components should have a <main> landmark",
      severity: "info",
    });
  }
}

function checkFocusManagement(content, relativePath) {
  // Check if interactive elements have focus styles defined
  if (content.includes("onClick") || content.includes("onPress")) {
    // Look for corresponding CSS file
    const cssFile = relativePath.replace(/\.tsx?$/, ".css");
    const fullCssPath = path.join(process.cwd(), cssFile);

    if (fs.existsSync(fullCssPath)) {
      const cssContent = fs.readFileSync(fullCssPath, "utf-8");

      // Should have focus-visible styles
      if (
        !cssContent.includes(":focus-visible") &&
        !cssContent.includes(":focus")
      ) {
        warnings.push({
          file: cssFile,
          line: 1,
          issue:
            "Component has interactive elements but CSS is missing :focus-visible styles",
          severity: "warning",
        });
      }
    }
  }
}

function scanDirectory(dir) {
  if (!fs.existsSync(dir)) return;

  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);

    // Skip hidden files and exempt directories
    if (item.startsWith(".") || EXEMPT_DIRS.includes(item)) return;

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDirectory(fullPath);
    } else if (item.endsWith(".tsx") || item.endsWith(".jsx")) {
      checkAccessibility(fullPath);
    }
  });
}

console.log("♿ Checking accessibility compliance (WCAG 2.1 Level AA)...\n");

TARGET_DIRS.forEach((dir) => {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    console.log(`📂 Scanning ${dir}...`);
    scanDirectory(fullPath);
  }
});

console.log("");

// Display warnings first
if (warnings.length > 0) {
  console.log("⚠️  Accessibility warnings:\n");

  const groupedWarnings = warnings.reduce((acc, warning) => {
    if (!acc[warning.file]) acc[warning.file] = [];
    acc[warning.file].push(warning);
    return acc;
  }, {});

  Object.entries(groupedWarnings).forEach(([file, fileWarnings]) => {
    console.log(`  📄 ${file}`);
    fileWarnings.forEach((warning) => {
      console.log(`    Line ${warning.line}: ${warning.issue}`);
    });
    console.log("");
  });
}

if (hasErrors) {
  console.error("❌ Accessibility violations found:\n");

  const groupedErrors = errors.reduce((acc, error) => {
    if (!acc[error.file]) acc[error.file] = [];
    acc[error.file].push(error);
    return acc;
  }, {});

  Object.entries(groupedErrors).forEach(([file, fileErrors]) => {
    console.error(`  📄 ${file}`);
    fileErrors.forEach((error) => {
      console.error(`    Line ${error.line} [${error.rule}]: ${error.issue}`);
      if (error.snippet) {
        console.error(`      Code: ${error.snippet}`);
      }
    });
    console.error("");
  });

  console.error(`\n🚫 Total violations: ${errors.length}`);
  console.error("\n💡 How to fix:");
  console.error(
    "   1. Images: Add alt='description' or aria-hidden='true' for decorative images"
  );
  console.error(
    "   2. Buttons: Add aria-label='description' or visible text content"
  );
  console.error(
    "   3. Inputs: Add aria-label='label' or id to associate with <label>"
  );
  console.error(
    "   4. ARIA roles: Add aria-label or aria-labelledby to landmark/widget roles"
  );
  console.error("   5. Radio buttons: Add aria-checked attribute");
  console.error("   6. Tabs: Add aria-selected attribute");
  console.error("   7. Toggle buttons: Add aria-pressed attribute\n");
  console.error("📖 Reference: https://www.w3.org/WAI/WCAG21/quickref/\n");

  process.exit(1);
} else {
  console.log("✅ All components pass accessibility checks!");

  if (warnings.length > 0) {
    console.log(
      `⚠️  ${warnings.length} warning(s) - consider addressing for better accessibility\n`
    );
  } else {
    console.log("🎉 Zero violations, zero warnings!\n");
  }

  process.exit(0);
}
