import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        exportType: "default",
        ref: true,
        svgo: false,
        titleProp: true,
      },
      include: "**/*.svg?react",
    }),
  ],
  // Strip console.log/info/debug in production builds (keeps warn/error).
  // Dev keeps them since esbuild only drops `pure` calls during minification.
  esbuild: {
    pure: ["console.log", "console.info", "console.debug"],
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          coreui: [
            "@coreui/react",
            "@coreui/coreui",
            "@coreui/icons-react",
            "@coreui/icons",
          ],
          charts: ["recharts"],
          query: ["@tanstack/react-query"],
        },
      },
    },
  },
});
