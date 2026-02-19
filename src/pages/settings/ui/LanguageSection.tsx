import { useTranslation } from 'react-i18next'
import { ENameSpaces } from '@/shared/config/i18next/models/i18n.namespaces'
import { LanguageSwitcher } from '@/widgets/LanguageSwitcher'
import { SettingsSection } from './SettingsSection'

export function LanguageSection() {
    const { t } = useTranslation(ENameSpaces.SETTINGS)
    return (
        <SettingsSection
            title={t('language.title')}
            description={t('language.description')}
        >
            <div className="w-fit overflow-hidden rounded-xl">
                <LanguageSwitcher />
            </div>
        </SettingsSection>
    )
}
