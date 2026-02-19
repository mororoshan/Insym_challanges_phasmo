import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from '@/app/index'
import '@/shared/config/i18next'
import { GameModeSettingsProvider, SessionsStoreProvider } from '@/app/store'
import { StyleProvider } from '@ant-design/cssinjs'
import { ConfigProvider } from 'antd'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <StyleProvider layer>
            <ConfigProvider>
                <SessionsStoreProvider>
                    <GameModeSettingsProvider>
                        <App />
                    </GameModeSettingsProvider>
                </SessionsStoreProvider>
            </ConfigProvider>
        </StyleProvider>
    </StrictMode>
)
