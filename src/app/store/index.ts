export { SessionsStore } from './SessionsStore'
export {
    SessionsStoreContext,
    SessionsStoreProvider,
} from './SessionsStoreContext'
export { useSessionsStore } from './useSessionsStore'
export type { Roll, RollSession } from '@/shared/types/session'

// For UI that displays sessions (e.g. history drawer/modal), use observer() from 'mobx-react-lite'
// so the component re-renders when store.sessions or store.getSessionsByMode(modeId) change.
