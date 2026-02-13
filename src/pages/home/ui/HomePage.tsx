import { ENameSpaces } from '@/shared/config/i18next/models/i18n.namespaces'
import { useTranslation } from 'react-i18next'

export function HomePage() {
    const { t } = useTranslation(ENameSpaces.COMMON)

    return (
        <main>
            <h1>Home</h1>
            <p>Welcome to the app.</p>
            <p>{t('accept')}</p>
        </main>
    )
}
