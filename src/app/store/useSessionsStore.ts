import { useContext } from 'react'
import { SessionsStoreContext } from './SessionsStoreContext'

export function useSessionsStore() {
    const store = useContext(SessionsStoreContext)
    if (!store) {
        throw new Error('useSessionsStore must be used within SessionsStoreProvider')
    }
    return store
}
