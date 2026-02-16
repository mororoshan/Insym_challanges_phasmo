import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from 'react'
import {
    DEFAULT_CUSTOM_FEATURES,
    type CustomGameFeatures,
    type GameModeType,
} from '@/shared/types/gameMode'

const STORAGE_KEY = 'insum_game_mode_settings'

function loadStored(): {
    gameMode: GameModeType
    customFeatures: CustomGameFeatures
} {
    if (typeof localStorage === 'undefined')
        return {
            gameMode: 'regular',
            customFeatures: { ...DEFAULT_CUSTOM_FEATURES },
        }
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return { gameMode: 'regular', customFeatures: { ...DEFAULT_CUSTOM_FEATURES } }
        const parsed = JSON.parse(raw) as {
            gameMode?: GameModeType
            customFeatures?: Partial<CustomGameFeatures>
        }
        return {
            gameMode:
                parsed.gameMode === 'randomChallenge' || parsed.gameMode === 'custom'
                    ? parsed.gameMode
                    : 'regular',
            customFeatures: {
                ...DEFAULT_CUSTOM_FEATURES,
                ...parsed.customFeatures,
            },
        }
    } catch {
        return { gameMode: 'regular', customFeatures: { ...DEFAULT_CUSTOM_FEATURES } }
    }
}

function save(gameMode: GameModeType, customFeatures: CustomGameFeatures) {
    if (typeof localStorage === 'undefined') return
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ gameMode, customFeatures })
        )
    } catch {
        // ignore
    }
}

export interface GameModeSettingsValue {
    gameMode: GameModeType
    customFeatures: CustomGameFeatures
    setGameMode: (mode: GameModeType) => void
    setCustomFeature: <K extends keyof CustomGameFeatures>(
        key: K,
        value: CustomGameFeatures[K]
    ) => void
}

const GameModeSettingsContext = createContext<GameModeSettingsValue | null>(
    null
)

type ProviderProps = { children: ReactNode }

export function GameModeSettingsProvider({ children }: ProviderProps) {
    const [state, setState] = useState(loadStored)

    const setGameMode = useCallback((gameMode: GameModeType) => {
        setState((prev) => {
            const next = { ...prev, gameMode }
            save(next.gameMode, next.customFeatures)
            return next
        })
    }, [])

    const setCustomFeature = useCallback(
        <K extends keyof CustomGameFeatures>(key: K, value: CustomGameFeatures[K]) => {
            setState((prev) => {
                const customFeatures = {
                    ...prev.customFeatures,
                    [key]: value,
                }
                save(prev.gameMode, customFeatures)
                return { ...prev, customFeatures }
            })
        },
        []
    )

    const value = useMemo<GameModeSettingsValue>(
        () => ({
            gameMode: state.gameMode,
            customFeatures: state.customFeatures,
            setGameMode,
            setCustomFeature,
        }),
        [state.gameMode, state.customFeatures, setGameMode, setCustomFeature]
    )

    return (
        <GameModeSettingsContext.Provider value={value}>
            {children}
        </GameModeSettingsContext.Provider>
    )
}

export function useGameModeSettings(): GameModeSettingsValue {
    const ctx = useContext(GameModeSettingsContext)
    if (!ctx)
        throw new Error(
            'useGameModeSettings must be used within GameModeSettingsProvider'
        )
    return ctx
}
