import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '@/shared/config/routes'
import { ENameSpaces } from '@/shared/config/i18next/models/i18n.namespaces'

export function Header() {
    const { t } = useTranslation(ENameSpaces.COMMON)
    return (
        <div className="w-full">
            <nav className="flex items-center gap-4 px-4 py-3">
                <div className="flex flex-1 gap-4">
                    <Link
                        to={ROUTES.MAIN_MODE}
                        className="text-inherit hover:underline"
                    >
                        {t('nav.mainMode')}
                    </Link>
                    <Link
                        to={ROUTES.SETTINGS}
                        className="text-inherit hover:underline"
                    >
                        {t('nav.settings')}
                    </Link>
                </div>
            </nav>
        </div>
    )
}
