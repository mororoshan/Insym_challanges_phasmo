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
 */
export interface RollSession {
    id: string
    modeId: string
    createdAt: number
    updatedAt: number
    rolls: Roll[]
}

export const SESSIONS_DB_NAME = 'insum_sessions'
export const SESSIONS_STORE_NAME = 'sessions'
export const SESSIONS_DB_VERSION = 1

/** Known mode IDs for roll sessions. Add new keys when adding new app modes. */
export const MODE_IDS = {
    MAIN: 'main',
} as const
export type ModeId = (typeof MODE_IDS)[keyof typeof MODE_IDS]
