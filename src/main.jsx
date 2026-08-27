import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Registreer de service worker alleen in productie (op Netlify), zodat de
// app tijdens lokale ontwikkeling nooit een verouderde versie cachet.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Stil falen: offline-ondersteuning is een extra, geen vereiste.
    })
  })
}
