// sort-imports-ignore
import ReactDOM from 'react-dom/client'

import { PrimeReactProvider } from 'primereact/api'

import { App } from './App'

import './index.css'

const container = document.getElementById('root')
if (!container) throw new Error('Failed to find the root element')
const root = ReactDOM.createRoot(container)

root.render(
  <PrimeReactProvider>
    <App />
  </PrimeReactProvider>,
)
