import { registerNotFoundI18n } from '@/pages/not-found/i18next'
import { registerSettingsI18n } from '@/pages/settings/i18next'
import { registerCommonI18n } from '@/shared/config/i18next/common'
import { registerMainModeI18n } from '@/pages/main-mode/i18next'
import { AppRouter } from './router'

function App() {
    registerCommonI18n()
    registerMainModeI18n()
    registerNotFoundI18n()
    registerSettingsI18n()
    return <AppRouter />
}

export default App
