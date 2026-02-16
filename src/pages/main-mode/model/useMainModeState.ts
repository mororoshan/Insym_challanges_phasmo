import { useCallback, useContext, useMemo, useState } from 'react'
import {
    ALL_WHEEL_ITEMS,
    GHOSTS,
    type EvidenceId,
    type Ghost,
    type GhostId,
} from '@/shared/data/phasmophobia'
import type { Roll } from '@/shared/types/session'
import { SessionsStoreContext } from '@/app/store'
import { MODE_IDS } from '@/shared/types/session'

function rollsToGhosts(rolls: Roll[]): Ghost[] {
    return [...rolls].reverse().map((roll) => {
        const ghost = GHOSTS.find((g) => g.id === roll.itemId)
        if (ghost) return ghost
        const s = roll.itemSnapshot as { id: GhostId; name: string; evidence: EvidenceId[] }
        return { id: s.id, name: s.name ?? String(s.id), evidence: s.evidence ?? [] }
    })
}

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
    const [itemsInWheel, setItemsInWheel] = useState<string[]>(() =>
        ALL_WHEEL_ITEMS.map((i) => i.id)
    )
    const [availableForUse, setAvailableForUse] = useState<string[]>([])

    const session = sessionsStore.currentSession
    const spunGhosts =
        session?.modeId === MODE_IDS.MAIN && session.rolls.length > 0
            ? rollsToGhosts(session.rolls)
            : null

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

    const onItemWheelComplete = useCallback((itemId: string) => {
        setItemsInWheel((prev) => prev.filter((id) => id !== itemId))
        setAvailableForUse((prev) => [...prev, itemId])
    }, [])

    const endGameWithResult = useCallback(
        async (believersWon: boolean, actualGhostId?: GhostId) => {
            try {
                await sessionsStore.endCurrentSession({
                    ...(availableForUse.length > 0 && {
                        itemRollOrder: [...availableForUse],
                    }),
                    believersWon,
                    ...(actualGhostId != null && { actualGhostId }),
                })
            } finally {
                setSelectedEvidence(new Set())
                setManualCrossOut(new Set())
                setItemsInWheel(ALL_WHEEL_ITEMS.map((i) => i.id))
                setAvailableForUse([])
            }
        },
        [sessionsStore, availableForUse]
    )

    return {
        selectedEvidence,
        crossedOutGhostIds,
        availableGhosts,
        spunGhost: spunGhosts,
        toggleEvidence,
        toggleGhostCrossOut,
        onWheelComplete,
        itemsInWheel,
        availableForUse,
        onItemWheelComplete,
        endGameWithResult,
    }
}
