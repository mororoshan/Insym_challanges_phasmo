import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ENameSpaces } from '@/shared/config/i18next/models/i18n.namespaces'

export function NotFoundPage() {
    const { t } = useTranslation(ENameSpaces.NOT_FOUND)

    return (
        <main className="flex min-h-[60vh] flex-col items-center justify-center py-12 text-center">
            <p
                className="font-mono text-8xl font-bold tabular-nums text-amber-500/90 drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                aria-hidden
            >
                404
            </p>
            <h1 className="mt-4 text-xl font-semibold text-neutral-200">
                {t('title')}
            </h1>
            <p className="mt-2 max-w-sm text-sm text-neutral-500">
                {t('description')}
            </p>
            <Link
                to="/"
                className="mt-8 rounded border border-amber-500/50 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-400 transition hover:bg-amber-500/20 hover:border-amber-500/70"
            >
                {t('returnLink')}
            </Link>
        </main>
    )
}
