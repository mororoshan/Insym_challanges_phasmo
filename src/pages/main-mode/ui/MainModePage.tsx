import { useCallback, useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { ENameSpaces } from '@/shared/config/i18next/models/i18n.namespaces'
import { useTranslation } from 'react-i18next'
import { SessionsStoreContext, useGameModeSettings } from '@/app/store'
import { MODE_IDS } from '@/shared/types/session'
import { useMainModeState } from '../model'
import { ChallengeWheelModal } from './ChallengeWheelModal'
import { EndGameModal } from './EndGameModal'
import { EvidenceSection } from './EvidenceSection'
import { GhostList } from './GhostList'
import { ItemWheelSection } from './ItemWheelSection'
import { WheelSection } from './WheelSection'

export const MainModePage = observer(function MainModePage() {
    const { t } = useTranslation(ENameSpaces.MAIN_MODE)
    const sessionsStore = useContext(SessionsStoreContext)
    const { gameMode } = useGameModeSettings()
    const [endGameModalOpen, setEndGameModalOpen] = useState(false)
    const {
        activePreset,
        selectedEvidence,
        crossedOutGhostIds,
        availableGhosts,
        spunGhost,
        toggleEvidence,
        toggleGhostCrossOut,
        onWheelComplete,
        itemsInWheel,
        availableForUse,
        onItemWheelComplete,
        endGameWithResult,
    } = useMainModeState()

    const currentSession = sessionsStore.currentSession
    const hasMainSession = currentSession?.modeId === MODE_IDS.MAIN
    const showChallengeWheel =
        gameMode === 'randomChallenge' && !hasMainSession

    // In regular mode, auto-start a classic session when entering with no session
    useEffect(() => {
        if (
            gameMode === 'regular' &&
            !hasMainSession &&
            sessionsStore.isHydrated
        ) {
            void sessionsStore.startNewSession(MODE_IDS.MAIN, {
                presetId: 'classic',
            })
        }
    }, [gameMode, hasMainSession, sessionsStore])

    const handlePresetChosen = useCallback(
        (preset: { id: string }) => {
            void sessionsStore.startNewSession(MODE_IDS.MAIN, {
                presetId: preset.id,
            })
        },
        [sessionsStore]
    )

    if (showChallengeWheel) {
        return (
            <main className="py-6">
                <h1 className="mb-6 text-2xl font-bold">{t('title')}</h1>
                <ChallengeWheelModal
                    open
                    onPresetChosen={handlePresetChosen}
                />
            </main>
        )
    }

    return (
        <main className="py-6">
            <div className="mb-6 flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold">{t('title')}</h1>
                <span
                    className="rounded bg-amber-200 px-2 py-0.5 text-sm font-medium text-amber-900"
                    title={t('challengeWheel.presetBadgeTitle')}
                >
                    {t(`presets.${activePreset.id}`, activePreset.name)}
                </span>
            </div>

            {activePreset.evidenceSection !== false && (
                <EvidenceSection
                    selectedEvidence={selectedEvidence}
                    onToggleEvidence={toggleEvidence}
                />
            )}

            {activePreset.ghostList !== false && (
                <GhostList
                    crossedOutGhostIds={crossedOutGhostIds}
                    onToggleGhost={toggleGhostCrossOut}
                />
            )}

            {activePreset.wheels.itemWheel && (
                <ItemWheelSection
                    itemsInWheel={itemsInWheel}
                    availableForUse={availableForUse}
                    onItemWheelComplete={onItemWheelComplete}
                />
            )}

            <EndGameModal
                open={endGameModalOpen}
                onClose={() => setEndGameModalOpen(false)}
                onConfirm={(believersWon, actualGhostId) => {
                    void endGameWithResult(believersWon, actualGhostId)
                    setEndGameModalOpen(false)
                }}
            />
            {activePreset.wheels.ghostWheel && (
                <WheelSection
                    availableGhosts={availableGhosts}
                    onWheelComplete={onWheelComplete}
                    onEndGame={() => setEndGameModalOpen(true)}
                    spunGhosts={spunGhost}
                />
            )}
        </main>
    )
})
