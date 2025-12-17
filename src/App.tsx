import { useEffect } from "react";

import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { useTheme } from "./hooks/useTheme";
import { DeactivatedUserProvider } from "./contexts/DeactivatedUserContext";

import V2Routes from "./routes/v2Routes";

import "./App.css";

import LoginV2 from "./pages-v2/LoginV2/LoginV2";
import RecoverPasswordV2 from "./pages-v2/RecoverPasswordV2/RecoverPasswordV2/RecoverPasswordV2.tsx";
import ForcePasswordChange from "./pages-v2/ForcePasswordChange/ForcePasswordChange";

// Component to handle /v2/* redirects
const V2RedirectHandler = () => {
  const pathname = window.location.pathname;
  const newPath = pathname.replace("/v2", "");
  return <Navigate to={newPath} replace />;
};

function App() {
  const { theme } = useTheme();
  useEffect(() => {
    document.body.classList.toggle("dark-mode", theme.isDark);
  }, [theme.isDark]);

  return (
    <DeactivatedUserProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#ffffff',
            color: '#5B6168',
            fontFamily: '"Lato", sans-serif',
            fontSize: '16px',
            fontWeight: 600,
            padding: '16px 16px 16px 32px',
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            minWidth: '350px',
          },
          success: {
            style: {
              borderLeft: '5px solid #1c9e3e',
            },
            iconTheme: {
              primary: '#429b5f',
              secondary: '#FFFFFF',
            },
          },
          error: {
            style: {
              borderLeft: '5px solid #e53935',
            },
            iconTheme: {
              primary: '#e53935',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginV2 />} />

        {/* V2 Auth Routes */}
        <Route path="/recover-password" element={<RecoverPasswordV2 />} />
        <Route path="/force-password-change" element={<ForcePasswordChange />} />

        {/* Redirect old /v2/* paths to new root paths */}
        <Route path="/v2/*" element={<V2RedirectHandler />} />

        {/* V2 Layout Routes - New Design System (Default) */}
        <Route path="/*" element={<V2Routes />} />
      </Routes>
    </DeactivatedUserProvider>
  );
}

export default App;
