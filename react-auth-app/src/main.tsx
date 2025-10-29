import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { PublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import './index.css'
import App from './App.tsx'
import { msalConfig } from './authConfig.ts'

const publicClientApplication = new PublicClientApplication(msalConfig)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MsalProvider instance={publicClientApplication}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MsalProvider>
  </StrictMode>
)
