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
      // Coverage ratchet: raise these floors at the end of each testing phase
      // so coverage can only go up. Left unenforced for the bootstrap PR
      // (Phase 0 + 1) because most of the app is still untested; enabling a
      // global floor now would fail CI on pre-existing untested code.
      // Enable once Phase 2+ lands real breadth:
      // thresholds: { lines: 25, functions: 25, branches: 25, statements: 25 },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
