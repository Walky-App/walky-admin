// sort-imports-ignore
import ReactDOM from 'react-dom/client'

import { PrimeReactProvider } from 'primereact/api'
import * as Sentry from '@sentry/react'

import { App } from './App'

import './index.css'

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  Sentry.init({
    dsn: 'https://2e79edc9b716205b6c471134985f035f@o4507866596179968.ingest.us.sentry.io/4507866598080512',
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  })
}

const container = document.getElementById('root')
if (!container) throw new Error('Failed to find the root element')
const root = ReactDOM.createRoot(container)

root.render(
  <PrimeReactProvider>
    <App />
  </PrimeReactProvider>,
)
