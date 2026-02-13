import { registerCommonI18n } from '@/shared/config/i18next/common'
import { registerMainPageI18n } from '@/pages/home/i18next'
import { AppRouter } from './router'

function App() {
    registerCommonI18n()
    registerMainPageI18n()
    return <AppRouter />
}

export default App
