import i18n from '@/shared/config/i18next'
import { ENameSpaces } from '@/shared/config/i18next/models/i18n.namespaces'
import en from './en'
import ru from './ru'

export const registerSettingsI18n = () => {
    i18n.addResourceBundle('en', ENameSpaces.SETTINGS, en, true, true)
    i18n.addResourceBundle('ru', ENameSpaces.SETTINGS, ru, true, true)
}
