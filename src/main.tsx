import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from '@/app/index'
import '@/shared/config/i18next'
import { SessionsStoreProvider } from '@/app/store'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <SessionsStoreProvider>
            <App />
        </SessionsStoreProvider>
    </StrictMode>
)
