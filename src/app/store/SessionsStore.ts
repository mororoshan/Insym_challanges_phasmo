import { makeAutoObservable, runInAction } from 'mobx'
import type { Roll, RollSession } from '@/shared/types/session'
import { sessionsDb } from '@/shared/lib/indexed-db/sessionsDb'

const CURRENT_SESSION_STORAGE_KEY = 'insum_current_session_id'
const DRAFT_SESSION_STORAGE_KEY = 'insum_draft_session'

function generateId(): string {
    return crypto.randomUUID()
}

function saveDraftSession(session: RollSession) {
    if (typeof localStorage === 'undefined') return
    try {
        localStorage.setItem(DRAFT_SESSION_STORAGE_KEY, JSON.stringify(session))
    } catch {
        // ignore
    }
}

function clearDraftSession() {
    if (typeof localStorage === 'undefined') return
    try {
        localStorage.removeItem(DRAFT_SESSION_STORAGE_KEY)
    } catch {
        // ignore
    }
}

function loadDraftSession(): RollSession | null {
    if (typeof localStorage === 'undefined') return null
    try {
        const raw = localStorage.getItem(DRAFT_SESSION_STORAGE_KEY)
        if (!raw) return null
        return JSON.parse(raw) as RollSession
    } catch {
        return null
    }
}

export class SessionsStore {
    sessions: RollSession[] = []
    currentSession: RollSession | null = null
    isLoading = false
    isHydrated = false

    constructor() {
        makeAutoObservable(this)
    }

    /** Load all sessions from IndexedDB. Call once on app init. */
    async hydrate() {
        if (this.isLoading || this.isHydrated) return
        this.isLoading = true
        try {
            const list = await sessionsDb.getAll()
            const savedCurrentId =
                typeof localStorage !== 'undefined'
                    ? localStorage.getItem(CURRENT_SESSION_STORAGE_KEY)
                    : null
            runInAction(() => {
                this.sessions = list
                const fromList =
                    savedCurrentId && list.find((s) => s.id === savedCurrentId)
                if (fromList) {
                    this.currentSession = fromList
                } else if (savedCurrentId) {
                    const draft = loadDraftSession()
                    this.currentSession =
                        draft?.id === savedCurrentId ? draft : null
                } else {
                    this.currentSession = null
                }
                this.isHydrated = true
            })
        } finally {
            runInAction(() => {
                this.isLoading = false
            })
        }
    }

    /** Add a roll: append to current session for this mode, or create a new session. */
    async addRoll(modeId: string, roll: Roll) {
        const session =
            this.currentSession?.modeId === modeId
                ? this.currentSession
                : await this.startNewSession(modeId)

        const updated: RollSession = {
            ...session,
            updatedAt: Date.now(),
            rolls: [...session.rolls, roll],
        }
        this.currentSession = updated
        this.sessions = [updated, ...this.sessions.filter((s) => s.id !== updated.id)]
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(CURRENT_SESSION_STORAGE_KEY, updated.id)
            clearDraftSession()
        }
        await sessionsDb.put(updated)
    }

    /** Start a new session for the next rolls. Returns the new session (and sets it as current). Not persisted until the first roll or end with outcome (avoids empty runs in history). */
    async startNewSession(
        modeId: string,
        options?: { presetId?: string }
    ): Promise<RollSession> {
        const now = Date.now()
        const session: RollSession = {
            id: generateId(),
            modeId,
            createdAt: now,
            updatedAt: now,
            rolls: [],
            ...(options?.presetId != null && { presetId: options.presetId }),
        }
        runInAction(() => {
            this.currentSession = session
            // Do not add to this.sessions or DB yet; addRoll or endCurrentSession(meta) will persist
        })
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(CURRENT_SESSION_STORAGE_KEY, session.id)
            saveDraftSession(session)
        }
        return session
    }

    /** End current session (e.g. on reset). Saves optional metadata then clears current. Does not persist empty runs (no rolls). */
    async endCurrentSession(meta?: {
        itemRollOrder?: string[]
        believersWon?: boolean
        actualGhostId?: string
    }) {
        const session = this.currentSession
        try {
            const hasOutcome =
                session &&
                (meta?.itemRollOrder?.length || meta?.believersWon !== undefined)
            const nonEmpty = session && session.rolls.length > 0
            if (hasOutcome && nonEmpty) {
                const updated: RollSession = {
                    ...session,
                    updatedAt: Date.now(),
                    ...(meta?.itemRollOrder?.length && { itemRollOrder: meta.itemRollOrder }),
                    ...(meta?.believersWon !== undefined && { believersWon: meta.believersWon }),
                    ...(meta?.actualGhostId != null && { actualGhostId: meta.actualGhostId }),
                }
                this.currentSession = updated
                this.sessions = [
                    updated,
                    ...this.sessions.filter((s) => s.id !== updated.id),
                ]
                await sessionsDb.put(updated)
            }
        } finally {
            this.currentSession = null
            if (typeof localStorage !== 'undefined') {
                localStorage.removeItem(CURRENT_SESSION_STORAGE_KEY)
                clearDraftSession()
            }
        }
    }

    getSessionsByMode(modeId: string): RollSession[] {
        return this.sessions.filter((s) => s.modeId === modeId)
    }

    getSessionById(id: string): RollSession | undefined {
        return this.sessions.find((s) => s.id === id)
    }

    async deleteSession(id: string) {
        await sessionsDb.delete(id)
        runInAction(() => {
            this.sessions = this.sessions.filter((s) => s.id !== id)
            if (this.currentSession?.id === id) {
                this.currentSession = null
                if (typeof localStorage !== 'undefined') {
                    localStorage.removeItem(CURRENT_SESSION_STORAGE_KEY)
                }
            }
        })
    }

    async refresh() {
        this.isHydrated = false
        await this.hydrate()
    }
}
