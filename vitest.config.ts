import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    svgr({
      include: "**/*.svg?react",
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/**",
        "dist/**",
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
        "**/test/**",
        "**/*.config.{ts,js}",
        "**/scripts/**",
        // Generated / non-logic files — exclude so the coverage ratchet
        // reflects code we actually author and can meaningfully test.
        "src/main.tsx",
        "src/API/WalkyAPI.ts",
        "src/**/*.d.ts",
        "src/vite-env.d.ts",
        "**/index.ts",
      ],
      // Coverage ratchet: floors are set just below current coverage of the
      // files exercised by the suite (~82% stmts / 70% branch / 81% funcs as of
      // this commit). They can only go UP — when a testing phase raises actual
      // coverage, bump these numbers so the gain is locked in and can't regress.
      // Note: coverage here reflects files imported by tests (Vitest's default
      // `all: false`); the goal is broadening that set over time.
      thresholds: {
        statements: 80,
        branches: 65,
        functions: 78,
        lines: 80,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
