import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/config/routes'
import { ENameSpaces } from '@/shared/config/i18next/models/i18n.namespaces'
import { useTranslation } from 'react-i18next'

export function HomePage() {
    const { t } = useTranslation(ENameSpaces.MAIN_PAGE)

    return (
        <main className="py-8 text-white">
            <div className="mb-10 text-center">
                <h1 className="mb-2 text-3xl font-bold">
                    {t('title')}
                </h1>
                <p className="text-lg text-white/90">{t('tagline')}</p>
            </div>

            <section className="mb-10">
                <h2 className="mb-3 text-xl font-semibold">
                    {t('whatIs')}
                </h2>
                <p className="max-w-prose text-white/90">
                    {t('whatIsBody')}
                </p>
            </section>

            <section className="mb-10">
                <h2 className="mb-6 text-xl font-semibold">
                    {t('howItWorks')}
                </h2>
                <ul className="flex flex-col gap-6">
                    <li className="flex items-center gap-3">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                        <div>
                            <h3 className="font-medium">{t('step1Title')}</h3>
                            <p className="text-white/90">{t('step1Body')}</p>
                        </div>
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                        <div>
                            <h3 className="font-medium">{t('step2Title')}</h3>
                            <p className="text-white/90">{t('step2Body')}</p>
                        </div>
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                        <div>
                            <h3 className="font-medium">{t('step3Title')}</h3>
                            <p className="text-white/90">{t('step3Body')}</p>
                        </div>
                    </li>
                </ul>
            </section>

            <div className="flex justify-center">
                <Link
                    to={ROUTES.MAIN_MODE}
                    className="rounded-lg bg-amber-500 px-6 py-3 font-medium text-white transition hover:bg-amber-600"
                >
                    {t('getStarted')} → {t('mainMode')}
                </Link>
            </div>
        </main>
    )
}
