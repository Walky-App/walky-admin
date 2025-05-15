import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// Import CoreUI styles
import '@coreui/coreui/dist/css/coreui.min.css';
// Import custom styles
import './index.css';
import App from './App.tsx';
import { ThemeProvider } from './components/ThemeProvider';
createRoot(document.getElementById('root')).render(_jsx(StrictMode, { children: _jsx(ThemeProvider, { children: _jsx(BrowserRouter, { children: _jsx(App, {}) }) }) }));
