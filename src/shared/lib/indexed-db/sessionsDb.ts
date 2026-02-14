import type { RollSession } from '@/shared/types/session'
import {
    SESSIONS_DB_NAME,
    SESSIONS_STORE_NAME,
    SESSIONS_DB_VERSION,
} from '@/shared/types/session'

function openDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(SESSIONS_DB_NAME, SESSIONS_DB_VERSION)
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result)
        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result
            if (!db.objectStoreNames.contains(SESSIONS_STORE_NAME)) {
                const store = db.createObjectStore(SESSIONS_STORE_NAME, {
                    keyPath: 'id',
                })
                store.createIndex('modeId', 'modeId', { unique: false })
                store.createIndex('createdAt', 'createdAt', { unique: false })
            }
        }
    })
}

function withStore<T>(
    mode: IDBTransactionMode,
    fn: (store: IDBObjectStore) => IDBRequest<T>,
    waitForTransaction = false
): Promise<T> {
    return openDb().then((db) => {
        return new Promise((resolve, reject) => {
            const tx = db.transaction(SESSIONS_STORE_NAME, mode)
            const store = tx.objectStore(SESSIONS_STORE_NAME)
            const request = fn(store)
            request.onerror = () => reject(request.error)
            request.onsuccess = () => {
                if (waitForTransaction) return
                resolve(request.result as T)
            }
            tx.oncomplete = () => {
                if (waitForTransaction) resolve(request.result as T)
                db.close()
            }
            tx.onerror = () => reject(tx.error)
        })
    })
}

export const sessionsDb = {
    async getAll(): Promise<RollSession[]> {
        return openDb().then((db) => {
            return new Promise((resolve, reject) => {
                const tx = db.transaction(SESSIONS_STORE_NAME, 'readonly')
                const store = tx.objectStore(SESSIONS_STORE_NAME)
                const request = store.getAll()
                request.onerror = () => reject(request.error)
                request.onsuccess = () => {
                    const list = (request.result as RollSession[]).sort(
                        (a, b) => b.createdAt - a.createdAt
                    )
                    resolve(list)
                }
                tx.oncomplete = () => db.close()
            })
        })
    },

    async getByMode(modeId: string): Promise<RollSession[]> {
        return openDb().then((db) => {
            return new Promise((resolve, reject) => {
                const tx = db.transaction(SESSIONS_STORE_NAME, 'readonly')
                const store = tx.objectStore(SESSIONS_STORE_NAME)
                const index = store.index('modeId')
                const request = index.getAll(modeId)
                request.onerror = () => reject(request.error)
                request.onsuccess = () => {
                    const list = (request.result as RollSession[]).sort(
                        (a, b) => b.createdAt - a.createdAt
                    )
                    resolve(list)
                }
                tx.oncomplete = () => db.close()
            })
        })
    },

    async getById(id: string): Promise<RollSession | undefined> {
        return withStore('readonly', (store) => store.get(id))
    },

    async put(session: RollSession): Promise<void> {
        const plain = JSON.parse(JSON.stringify(session)) as RollSession
        return withStore(
            'readwrite',
            (s) => s.put(plain),
            true
        ).then(() => undefined)
    },

    async delete(id: string): Promise<void> {
        return withStore('readwrite', (store) => store.delete(id), true).then(
            () => undefined
        )
    },
}
