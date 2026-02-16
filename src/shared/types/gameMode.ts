/**
 * How the main game page decides what challenge/features to use.
 * - regular: Classic preset (ghost + item wheel), no challenge wheel.
 * - randomChallenge: Challenge wheel picks a preset at start of each game.
 * - custom: User-defined features in Settings (which wheels/sections to show).
 */
export type GameModeType = 'regular' | 'randomChallenge' | 'custom'

/**
 * Toggles for custom game mode (which sections appear on the game page).
 */
export interface CustomGameFeatures {
    ghostWheel: boolean
    itemWheel: boolean
    evidenceSection: boolean
    ghostList: boolean
}

export const DEFAULT_CUSTOM_FEATURES: CustomGameFeatures = {
    ghostWheel: true,
    itemWheel: true,
    evidenceSection: true,
    ghostList: true,
}
