import { registerCommonI18n } from '@/shared/config/i18next/common'
import { registerMainPageI18n } from '@/pages/home/i18next'
import { registerMainModeI18n } from '@/pages/main-mode/i18next'
import { AppRouter } from './router'

function App() {
    registerCommonI18n()
    registerMainPageI18n()
    registerMainModeI18n()
    return <AppRouter />
}

export default App
