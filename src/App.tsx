import { useEffect } from "react";

import { Routes, Route, Navigate } from "react-router-dom";

import { useTheme } from "./hooks/useTheme";

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
  );
}

export default App;
