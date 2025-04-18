import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Import CoreUI styles
import '@coreui/coreui/dist/css/coreui.min.css'

// Import custom styles
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
