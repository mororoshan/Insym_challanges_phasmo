import i18n from '@/shared/config/i18next'
import en from './en'
import ru from './ru'
import { ENameSpaces } from '@/shared/config/i18next/models/i18n.namespaces'

export const registerMainModeI18n = () => {
    i18n.addResourceBundle('en', ENameSpaces.MAIN_MODE, en, true, true)
    i18n.addResourceBundle('ru', ENameSpaces.MAIN_MODE, ru, true, true)
}
