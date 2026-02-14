import i18n from '@/shared/config/i18next'
import { ENameSpaces } from '@/shared/config/i18next/models/i18n.namespaces'
import en from './en'
import ru from './ru'

export const registerNotFoundI18n = () => {
    i18n.addResourceBundle('en', ENameSpaces.NOT_FOUND, en, true, true)
    i18n.addResourceBundle('ru', ENameSpaces.NOT_FOUND, ru, true, true)
}
