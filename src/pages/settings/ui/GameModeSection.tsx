import { Radio } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSessionsStore, useGameModeSettings } from '@/app/store'
import { ENameSpaces } from '@/shared/config/i18next/models/i18n.namespaces'
import type { GameModeType } from '@/shared/types/gameMode'
import { SettingsSection } from './SettingsSection'
import { CustomFeaturesSection } from './CustomFeaturesSection'

const GAME_MODE_OPTIONS: { value: GameModeType }[] = [
    { value: 'regular' },
    { value: 'randomChallenge' },
    { value: 'custom' },
]

export function GameModeSection() {
    const { t } = useTranslation(ENameSpaces.SETTINGS)
    const sessionsStore = useSessionsStore()
    const { gameMode, customFeatures, setGameMode, setCustomFeature } =
        useGameModeSettings()

    const handleGameModeChange = (newMode: GameModeType) => {
        setGameMode(newMode)
        void sessionsStore.endCurrentSession()
    }

    return (
        <SettingsSection
            title={t('gameMode.title')}
            description={t('gameMode.description')}
        >
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
                                    <Radio
                                        value={opt.value}
                                        classNames={{
                                            icon:
                                                gameMode === opt.value
                                                    ? 'bg-amber-500 border-amber-800'
                                                    : '',
                                        }}
                                    />
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
                <CustomFeaturesSection
                    customFeatures={customFeatures}
                    setCustomFeature={setCustomFeature}
                />
            )}
        </SettingsSection>
    )
}
