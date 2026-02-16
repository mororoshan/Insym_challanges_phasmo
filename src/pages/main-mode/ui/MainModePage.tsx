import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Switch } from 'antd'
import { ENameSpaces } from '@/shared/config/i18next/models/i18n.namespaces'
import { useTranslation } from 'react-i18next'
import { useMainModeState } from '../model'
import { EndGameModal } from './EndGameModal'
import { EvidenceSection } from './EvidenceSection'
import { GhostList } from './GhostList'
import { ItemWheelSection } from './ItemWheelSection'
import { WheelSection } from './WheelSection'

export const MainModePage = observer(function MainModePage() {
    const { t } = useTranslation(ENameSpaces.MAIN_MODE)
    const [showItemsWheel, setShowItemsWheel] = useState(false)
    const [endGameModalOpen, setEndGameModalOpen] = useState(false)
    const {
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

    return (
        <main className="py-6">
            <h1 className="mb-6 text-2xl font-bold">{t('title')}</h1>

            <EvidenceSection
                selectedEvidence={selectedEvidence}
                onToggleEvidence={toggleEvidence}
            />

            <GhostList
                crossedOutGhostIds={crossedOutGhostIds}
                onToggleGhost={toggleGhostCrossOut}
            />

            <section className="mb-6 flex items-center gap-2">
                <Switch
                    checked={showItemsWheel}
                    onChange={setShowItemsWheel}
                    aria-label={t('itemsWheel.showSection')}
                />
                <span className="text-sm">{t('itemsWheel.showSection')}</span>
            </section>

            {showItemsWheel && (
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
            <WheelSection
                availableGhosts={availableGhosts}
                onWheelComplete={onWheelComplete}
                onEndGame={() => setEndGameModalOpen(true)}
                spunGhosts={spunGhost}
            />
        </main>
    )
})
