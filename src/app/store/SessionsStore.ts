import { makeAutoObservable, runInAction } from 'mobx'
import type { Roll, RollSession } from '@/shared/types/session'
import { sessionsDb } from '@/shared/lib/indexed-db/sessionsDb'

const CURRENT_SESSION_STORAGE_KEY = 'insum_current_session_id'

function generateId(): string {
    return crypto.randomUUID()
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
                this.currentSession =
                    (savedCurrentId &&
                        list.find((s) => s.id === savedCurrentId)) ||
                    null
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
        }
        await sessionsDb.put(updated)
    }

    /** Start a new session for the next rolls. Returns the new session (and sets it as current). */
    async startNewSession(modeId: string): Promise<RollSession> {
        const now = Date.now()
        const session: RollSession = {
            id: generateId(),
            modeId,
            createdAt: now,
            updatedAt: now,
            rolls: [],
        }
        runInAction(() => {
            this.currentSession = session
            this.sessions = [session, ...this.sessions]
        })
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(CURRENT_SESSION_STORAGE_KEY, session.id)
        }
        await sessionsDb.put(session)
        return session
    }

    /** End current session (e.g. on reset). Next addRoll will create a new session. */
    endCurrentSession() {
        this.currentSession = null
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(CURRENT_SESSION_STORAGE_KEY)
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
