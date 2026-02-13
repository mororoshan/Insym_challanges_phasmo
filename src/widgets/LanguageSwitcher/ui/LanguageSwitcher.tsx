import { useTranslation } from 'react-i18next'
import {
    SUPPORTED_LANGUAGES,
    type SupportedLanguage,
} from '@/shared/config/i18next'

const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
    en: 'EN',
    ru: 'RU',
}

type Props = {}

export function LanguageSwitcher({}: Props) {
    const { i18n } = useTranslation()

    const currentLang =
        (SUPPORTED_LANGUAGES.find(
            (code) => code === i18n.language || i18n.language?.startsWith(code)
        ) as SupportedLanguage) ?? 'en'

    return (
        <div
            className="flex items-center gap-1 rounded-lg border border-[#646cff]/30 bg-[#1a1a1a]/50 px-1 py-0.5"
            role="group"
            aria-label="Language"
        >
            {SUPPORTED_LANGUAGES.map((code) => (
                <button
                    key={code}
                    type="button"
                    onClick={() => i18n.changeLanguage(code)}
                    className={`rounded-md px-2.5 py-1 text-sm font-medium transition-colors ${
                        currentLang === code
                            ? 'bg-[#646cff] text-white'
                            : 'text-current opacity-70 hover:opacity-100'
                    }`}
                >
                    {LANGUAGE_LABELS[code]}
                </button>
            ))}
        </div>
    )
}
