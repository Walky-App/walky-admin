import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

// Import CoreUI styles
import "@coreui/coreui/dist/css/coreui.min.css";

// Import custom styles
import "./index.css";
import "./styles-v2/ThemeComponents.css";
import "./styles/modern-theme.css";
import "./styles/sidebar-modern.css";
import "./styles/logo-background-fix.css";
import "./styles/badge-fixes.css";
import "./styles/visibility-fixes.css";
import "./styles/enhanced-table.css";
import "./styles-v2/design-tokens.css";
import "./styles-v2/global.css";
import App from "./App.tsx";
import { ThemeProvider } from "./contexts/ThemeProvider.tsx";
import { SchoolProvider } from "./contexts/SchoolContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SchoolProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SchoolProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
