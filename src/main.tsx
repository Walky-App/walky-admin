import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Import CoreUI styles
import '@coreui/coreui/dist/css/coreui.min.css'

// Import custom styles
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './components/ThemeProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
