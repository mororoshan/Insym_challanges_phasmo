import { useCallback, useContext, useMemo, useState } from 'react'
import {
    GHOSTS,
    type EvidenceId,
    type Ghost,
    type GhostId,
} from '@/shared/data/phasmophobia'
import { SessionsStoreContext } from '@/app/store'
import { MODE_IDS } from '@/shared/types/session'

function isGhostCrossedOut(
    ghost: Ghost,
    selectedEvidence: Set<EvidenceId>,
    manualCrossOut: Set<GhostId>
): boolean {
    if (manualCrossOut.has(ghost.id)) return true
    for (const ev of selectedEvidence) {
        if (!ghost.evidence.includes(ev)) return true
    }
    return false
}

export function useMainModeState() {
    const sessionsStore = useContext(SessionsStoreContext)
    const [selectedEvidence, setSelectedEvidence] = useState<Set<EvidenceId>>(
        () => new Set()
    )
    const [manualCrossOut, setManualCrossOut] = useState<Set<GhostId>>(
        () => new Set()
    )
    const [spunGhosts, setSpunGhosts] = useState<Ghost[] | null>(null)

    const crossedOutGhostIds = useMemo(() => {
        const set = new Set<GhostId>()
        for (const ghost of GHOSTS) {
            if (isGhostCrossedOut(ghost, selectedEvidence, manualCrossOut)) {
                set.add(ghost.id)
            }
        }
        return set
    }, [selectedEvidence, manualCrossOut])

    const availableGhosts = useMemo(
        () => GHOSTS.filter((g) => !crossedOutGhostIds.has(g.id)),
        [crossedOutGhostIds]
    )

    const toggleEvidence = (evidenceId: EvidenceId) => {
        setSelectedEvidence((prev) => {
            const next = new Set(prev)
            if (next.has(evidenceId)) next.delete(evidenceId)
            else next.add(evidenceId)
            return next
        })
    }

    const toggleGhostCrossOut = (ghostId: GhostId) => {
        setManualCrossOut((prev) => {
            const next = new Set(prev)
            if (next.has(ghostId)) next.delete(ghostId)
            else next.add(ghostId)
            return next
        })
    }

    const onWheelComplete = useCallback(
        (ghost: Ghost) => {
            setSpunGhosts((prev) => (prev ? [ghost, ...prev] : [ghost]))
            toggleGhostCrossOut(ghost.id)
            sessionsStore.addRoll(MODE_IDS.MAIN, {
                itemId: ghost.id,
                itemSnapshot: {
                    id: ghost.id,
                    name: ghost.name,
                    evidence: ghost.evidence,
                },
                timestamp: Date.now(),
            })
        },
        [sessionsStore]
    )

    const reset = () => {
        sessionsStore.endCurrentSession()
        setSelectedEvidence(new Set())
        setManualCrossOut(new Set())
        setSpunGhosts(null)
    }

    return {
        selectedEvidence,
        crossedOutGhostIds,
        availableGhosts,
        spunGhost: spunGhosts,
        toggleEvidence,
        toggleGhostCrossOut,
        onWheelComplete,
        reset,
    }
}
