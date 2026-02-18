import { Radio, Switch } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSessionsStore, useGameModeSettings } from '@/app/store'
import { ENameSpaces } from '@/shared/config/i18next/models/i18n.namespaces'
import type { CustomGameFeatures, GameModeType } from '@/shared/types/gameMode'
import { LanguageSwitcher } from '@/widgets/LanguageSwitcher'

const GAME_MODE_OPTIONS: { value: GameModeType }[] = [
    { value: 'regular' },
    { value: 'randomChallenge' },
    { value: 'custom' },
]

const CUSTOM_FEATURE_KEYS: { key: keyof CustomGameFeatures }[] = [
    { key: 'ghostWheel' },
    { key: 'itemWheel' },
    { key: 'evidenceSection' },
    { key: 'ghostList' },
]

export function SettingsPage() {
    const { t } = useTranslation(ENameSpaces.SETTINGS)
    const sessionsStore = useSessionsStore()
    const { gameMode, customFeatures, setGameMode, setCustomFeature } =
        useGameModeSettings()

    const handleGameModeChange = (newMode: GameModeType) => {
        setGameMode(newMode)
        void sessionsStore.endCurrentSession()
    }

    return (
        <main className="py-6 text-white">
            <h1 className="mb-6 text-2xl font-bold">{t('title')}</h1>

            <section className="mb-8">
                <h2 className="mb-3 text-lg font-semibold">
                    {t('language.title')}
                </h2>
                <p className="mb-4 text-sm text-white/70">
                    {t('language.description')}
                </p>
                <div className="w-fit overflow-hidden rounded-xl">
                    <LanguageSwitcher />
                </div>
            </section>

            <section className="mb-8">
                <h2 className="mb-3 text-lg font-semibold">
                    {t('gameMode.title')}
                </h2>
                <p className="mb-4 text-sm text-white/70">
                    {t('gameMode.description')}
                </p>
                <div className="overflow-hidden rounded-xl border border-white/15">
                    <Radio.Group
                        value={gameMode}
                        onChange={(e) => handleGameModeChange(e.target.value)}
                        className="block w-full"
                    >
                        <ul className="divide-y divide-white/10">
                            {GAME_MODE_OPTIONS.map((opt) => (
                                <li key={opt.value}>
                                    <label
                                        className={`flex cursor-pointer items-center gap-4 px-4 py-3 transition-colors hover:bg-white/5 ${
                                            gameMode === opt.value
                                                ? 'bg-amber-500/15'
                                                : ''
                                        }`}
                                    >
                                        <Radio value={opt.value} />
                                        <span className="text-sm font-medium text-white/88">
                                            {t(`gameMode.${opt.value}`)}
                                        </span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </Radio.Group>
                </div>

                {gameMode === 'custom' && (
                    <div className="mt-6 overflow-hidden rounded-xl border border-white/15">
                        <div className="border-b border-white/10 px-4 py-3">
                            <h3 className="text-sm font-medium text-white/90">
                                {t('customFeatures.sectionTitle')}
                            </h3>
                            <p className="mt-0.5 text-xs text-white/70">
                                {t('customFeatures.sectionDescription')}
                            </p>
                        </div>
                        <ul className="divide-y divide-white/10">
                            {CUSTOM_FEATURE_KEYS.map(({ key }) => (
                                <li
                                    key={key}
                                    className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-white/5"
                                >
                                    <span className="text-sm font-medium">
                                        {t(`customFeatures.${key}`)}
                                    </span>
                                    <span className="shrink-0">
                                        <Switch
                                            checked={customFeatures[key]}
                                            onChange={(checked) =>
                                                setCustomFeature(key, checked)
                                            }
                                            size="small"
                                        />
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </section>
        </main>
    )
}
