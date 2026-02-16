/**
 * Which wheels are active for this preset.
 */
export interface PresetWheels {
    ghostWheel: boolean
    itemWheel: boolean
}

/**
 * Placeholder for future: when spins occur (e.g. onDemand, afterEvidence, startOnly).
 */
export type SpinTriggerConfig = unknown

/**
 * Placeholder for future: sanity rules.
 */
export type SanityRule = unknown

/**
 * Challenge preset: defines which wheels are active, locked items, and optional future rules.
 * evidenceSection / ghostList: when false, hide those sections (used by custom mode). Undefined = show.
 */
export interface Preset {
    id: string
    name: string
    wheels: PresetWheels
    /** Item ids excluded from the item wheel (e.g. "No Truck" locks truck-related items). */
    lockedItems?: string[]
    /** When false, hide the evidence section. Undefined = show. */
    evidenceSection?: boolean
    /** When false, hide the ghost list. Undefined = show. */
    ghostList?: boolean
    /** Optional: when spins occur (phase 2). */
    spinTriggers?: SpinTriggerConfig
    /** Optional: sanity rules (phase 2). */
    sanityRules?: SanityRule[]
}
