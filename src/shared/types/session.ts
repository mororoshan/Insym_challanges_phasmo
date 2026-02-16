/**
 * A single roll result — mode-agnostic.
 * itemId: stable id (e.g. ghost id); itemSnapshot: serializable display data for history.
 */
export interface Roll {
    itemId: string
    itemSnapshot: Record<string, unknown>
    timestamp: number
}

/**
 * One session of rolls (e.g. one game). modeId allows multiple app modes to share the same store.
 * itemRollOrder: optional list of item ids (evidence/side evidence) rolled from the items wheel, in order (saved on reset).
 * believersWon / actualGhostId: optional game outcome for win/lose statistics (set when ending the game).
 */
export interface RollSession {
    id: string
    modeId: string
    createdAt: number
    updatedAt: number
    rolls: Roll[]
    /** Order of items rolled from the items wheel this session (persisted when session is ended/reset). */
    itemRollOrder?: string[]
    /** Whether believers won this game. Undefined = not recorded. */
    believersWon?: boolean
    /** When believers lost, the ghost that was actually in the game (for statistics). */
    actualGhostId?: string
}

export const SESSIONS_DB_NAME = 'insum_sessions'
export const SESSIONS_STORE_NAME = 'sessions'
export const SESSIONS_DB_VERSION = 2

/** Known mode IDs for roll sessions. Add new keys when adding new app modes. */
export const MODE_IDS = {
    MAIN: 'main',
} as const
export type ModeId = (typeof MODE_IDS)[keyof typeof MODE_IDS]
