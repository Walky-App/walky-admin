import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

// Import CoreUI styles
import "@coreui/coreui/dist/css/coreui.min.css";

// Import custom styles
import "./index.css";
import "./components/ThemeComponents.css";
import "./styles/modern-theme.css";
import "./styles/sidebar-modern.css";
import "./styles/logo-background-fix.css";
import "./styles/badge-fixes.css";
import "./styles/visibility-fixes.css";
import "./styles/enhanced-table.css";
import App from "./App.tsx";
import { ThemeProvider } from "./components/ThemeProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
