import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
    ALL_WHEEL_ITEMS,
    GHOSTS,
    type EvidenceId,
    type Ghost,
    type GhostId,
} from '@/shared/data/phasmophobia'
import { getDefaultPreset, getPresetById } from '@/shared/data/presets'
import type { Preset } from '@/shared/types/preset'
import type { CustomGameFeatures } from '@/shared/types/gameMode'
import type { Roll } from '@/shared/types/session'
import { useSessionsStore, useGameModeSettings } from '@/app/store'
import { MODE_IDS } from '@/shared/types/session'

const MAIN_MODE_STORAGE_KEY_PREFIX = 'kpb_main_mode_state_'

type MainModePersistedState = {
    selectedEvidence: string[]
    manualCrossOut: string[]
}

function getMainModeStateKey(sessionId: string): string {
    return `${MAIN_MODE_STORAGE_KEY_PREFIX}${sessionId}`
}

function loadMainModeState(sessionId: string): MainModePersistedState | null {
    if (typeof localStorage === 'undefined') return null
    try {
        const raw = localStorage.getItem(getMainModeStateKey(sessionId))
        if (!raw) return null
        const parsed = JSON.parse(raw) as MainModePersistedState
        if (
            !Array.isArray(parsed?.selectedEvidence) ||
            !Array.isArray(parsed?.manualCrossOut)
        )
            return null
        return parsed
    } catch {
        return null
    }
}

function saveMainModeState(
    sessionId: string,
    selectedEvidence: Set<EvidenceId>,
    manualCrossOut: Set<GhostId>
) {
    if (typeof localStorage === 'undefined') return
    try {
        localStorage.setItem(
            getMainModeStateKey(sessionId),
            JSON.stringify({
                selectedEvidence: [...selectedEvidence],
                manualCrossOut: [...manualCrossOut],
            } as MainModePersistedState)
        )
    } catch {
        // ignore
    }
}

function clearMainModeState(sessionId: string) {
    if (typeof localStorage === 'undefined') return
    try {
        localStorage.removeItem(getMainModeStateKey(sessionId))
    } catch {
        // ignore
    }
}

function presetFromCustomFeatures(features: CustomGameFeatures): Preset {
    return {
        id: 'custom',
        name: 'Custom',
        wheels: {
            ghostWheel: features.ghostWheel,
            itemWheel: features.itemWheel,
        },
        evidenceSection: features.evidenceSection,
        ghostList: features.ghostList,
    }
}

function rollsToGhosts(rolls: Roll[]): Ghost[] {
    return [...rolls].reverse().map((roll) => {
        const ghost = GHOSTS.find((g) => g.id === roll.itemId)
        if (ghost) return ghost
        const s = roll.itemSnapshot as {
            id: GhostId
            name: string
            evidence: EvidenceId[]
        }
        return {
            id: s.id,
            name: s.name ?? String(s.id),
            evidence: s.evidence ?? [],
        }
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
    const sessionsStore = useSessionsStore()
    const { gameMode, customFeatures } = useGameModeSettings()
    const [selectedEvidence, setSelectedEvidence] = useState<Set<EvidenceId>>(
        () => new Set()
    )
    const [manualCrossOut, setManualCrossOut] = useState<Set<GhostId>>(
        () => new Set()
    )
    const [itemsInWheel, setItemsInWheel] = useState<string[]>(() => [])
    const [availableForUse, setAvailableForUse] = useState<string[]>([])
    const loadedSessionIdRef = useRef<string | null>(null)

    const session = sessionsStore.currentSession

    // Load persisted state when entering a main-mode session (e.g. after refresh)
    useEffect(() => {
        if (session?.modeId !== MODE_IDS.MAIN || !session.id) {
            if (!session?.id) loadedSessionIdRef.current = null
            return
        }
        if (loadedSessionIdRef.current === session.id) return
        loadedSessionIdRef.current = session.id
        const saved = loadMainModeState(session.id)
        if (saved) {
            setSelectedEvidence(new Set(saved.selectedEvidence as EvidenceId[]))
            setManualCrossOut(new Set(saved.manualCrossOut as GhostId[]))
        } else {
            setSelectedEvidence(new Set())
            setManualCrossOut(new Set())
        }
    }, [session?.id, session?.modeId])

    // Persist state whenever evidence or ghost cross-outs change
    useEffect(() => {
        if (session?.modeId !== MODE_IDS.MAIN || !session.id) return
        saveMainModeState(session.id, selectedEvidence, manualCrossOut)
    }, [session?.id, session?.modeId, selectedEvidence, manualCrossOut])

    const activePreset = useMemo<Preset>(() => {
        if (session?.presetId) {
            const p = getPresetById(session.presetId)
            if (p) return p
        }
        if (gameMode === 'custom')
            return presetFromCustomFeatures(customFeatures)
        return getDefaultPreset()
    }, [session?.presetId, gameMode, customFeatures])
    const initialItemsInWheel = useMemo(
        () =>
            ALL_WHEEL_ITEMS.filter(
                (i) => !activePreset.lockedItems?.includes(i.id)
            ).map((i) => i.id),
        [activePreset]
    )

    useEffect(() => {
        if (session?.modeId === MODE_IDS.MAIN) {
            setItemsInWheel(initialItemsInWheel)
            setAvailableForUse([])
        }
    }, [session?.id, initialItemsInWheel])
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
            const sessionId = sessionsStore.currentSession?.id
            try {
                await sessionsStore.endCurrentSession({
                    ...(availableForUse.length > 0 && {
                        itemRollOrder: [...availableForUse],
                    }),
                    believersWon,
                    ...(actualGhostId != null && { actualGhostId }),
                })
            } finally {
                if (sessionId) clearMainModeState(sessionId)
                loadedSessionIdRef.current = null
                setSelectedEvidence(new Set())
                setManualCrossOut(new Set())
                setItemsInWheel([])
                setAvailableForUse([])
            }
        },
        [sessionsStore, availableForUse]
    )

    return {
        activePreset,
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
