import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'

export const SUPPORTED_LANGUAGES = ['en', 'ru'] as const
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: true,
        fallbackLng: 'en',
        supportedLngs: [...SUPPORTED_LANGUAGES],
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
        backend: {
            loadPath: '/locales/{{lng}}/translation.json',
        },
    })

export default i18n
