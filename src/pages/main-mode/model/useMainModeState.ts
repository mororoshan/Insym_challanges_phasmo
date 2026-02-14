import { useCallback, useState, useMemo } from 'react'
import {
    GHOSTS,
    type EvidenceId,
    type Ghost,
    type GhostId,
} from '@/shared/data/phasmophobia'

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
    const [selectedEvidence, setSelectedEvidence] = useState<Set<EvidenceId>>(
        () => new Set()
    )
    const [manualCrossOut, setManualCrossOut] = useState<Set<GhostId>>(
        () => new Set()
    )
    const [spunGhost, setSpunGhost] = useState<Ghost | null>(null)

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

    const onWheelComplete = useCallback((ghost: Ghost) => {
        setSpunGhost(ghost)
    }, [])

    const reset = () => {
        setSelectedEvidence(new Set())
        setManualCrossOut(new Set())
        setSpunGhost(null)
    }

    return {
        selectedEvidence,
        crossedOutGhostIds,
        availableGhosts,
        spunGhost,
        toggleEvidence,
        toggleGhostCrossOut,
        onWheelComplete,
        reset,
    }
}
