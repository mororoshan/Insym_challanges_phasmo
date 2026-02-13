import i18n from '..'
import { ENameSpaces } from '../models/i18n.namespaces'
import en from './en'
import ru from './ru'

export const registerCommonI18n = () => {
    i18n.addResourceBundle('en', ENameSpaces.COMMON, en, true, true)
    i18n.addResourceBundle('ru', ENameSpaces.COMMON, ru, true, true)
}
