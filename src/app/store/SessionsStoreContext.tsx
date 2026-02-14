import { createContext, useEffect, useRef, type ReactNode } from 'react'
import { SessionsStore } from './SessionsStore'

const store = new SessionsStore()

export const SessionsStoreContext = createContext<SessionsStore>(store)

type SessionsStoreProviderProps = { children: ReactNode }

export function SessionsStoreProvider({ children }: SessionsStoreProviderProps) {
    const storeRef = useRef(store)
    useEffect(() => {
        void storeRef.current.hydrate()
    }, [])
    return (
        <SessionsStoreContext.Provider value={storeRef.current}>
            {children}
        </SessionsStoreContext.Provider>
    )
}
