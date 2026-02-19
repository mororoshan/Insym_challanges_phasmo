import { useTranslation } from 'react-i18next'
import { ENameSpaces } from '@/shared/config/i18next/models/i18n.namespaces'
import { LanguageSection } from './LanguageSection'
import { GameModeSection } from './GameModeSection'

export function SettingsPage() {
    const { t } = useTranslation(ENameSpaces.SETTINGS)

    return (
        <main className="py-6 text-white">
            <h1 className="mb-6 text-2xl font-bold">{t('title')}</h1>

            <div className="flex flex-col gap-6">
                <LanguageSection />
                <GameModeSection />
            </div>
        </main>
    )
}
