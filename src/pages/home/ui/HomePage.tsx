import { ENameSpaces } from '@/shared/config/i18next/models/i18n.namespaces'
import { useTranslation } from 'react-i18next'

export function HomePage() {
    const { t } = useTranslation(ENameSpaces.MAIN_PAGE)

    return (
        <main>
            <h1>{t('hello')}</h1>
            <p>Welcome to the app.</p>
        </main>
    )
}
