import { registerCommonI18n } from '@/shared/config/i18next/common'
import { AppRouter } from './router'

function App() {
    registerCommonI18n()
    return <AppRouter />
}

export default App
