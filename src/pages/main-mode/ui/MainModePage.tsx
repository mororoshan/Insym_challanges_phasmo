import { ENameSpaces } from '@/shared/config/i18next/models/i18n.namespaces'
import { useTranslation } from 'react-i18next'
import { useMainModeState } from '../model'
import { EvidenceSection } from './EvidenceSection'
import { GhostList } from './GhostList'
import { WheelSection } from './WheelSection'

export function MainModePage() {
    const { t } = useTranslation(ENameSpaces.MAIN_MODE)
    const {
        selectedEvidence,
        crossedOutGhostIds,
        availableGhosts,
        spunGhost,
        toggleEvidence,
        toggleGhostCrossOut,
        onWheelComplete,
        reset,
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

            <WheelSection
                availableGhosts={availableGhosts}
                onWheelComplete={onWheelComplete}
                onReset={reset}
                spunGhosts={spunGhost}
            />
        </main>
    )
}
