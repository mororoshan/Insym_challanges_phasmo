import type { Preset } from '@/shared/types/preset'

/** Evidence ids to lock for "One Evidence Max" (allow only EMF5). */
const ONE_EVIDENCE_MAX_LOCKED = [
    'dots',
    'ultraviolet',
    'ghostOrb',
    'ghostWriting',
    'spiritBox',
    'freezing',
] as const

/** Truck-related item ids (equipment typically from truck) for "No Truck". */
const NO_TRUCK_LOCKED = [
    'soundSensor',
    'motionSensor',
    'videoCamera',
    'photoCamera',
    'flashlight',
] as const

export const PRESET_IDS = {
    CLASSIC: 'classic',
    APOCALYPSE_LITE: 'apocalypse',
    WHEEL_ONLY: 'wheel-only',
    ZERO_EVIDENCE: 'zero-evidence',
    ZERO_SANITY: 'zero-sanity',
    STREAMER_TORTURE: 'streamer-torture',
    CHAT_DECIDES: 'chat-decides',
} as const

export type PresetId = (typeof PRESET_IDS)[keyof typeof PRESET_IDS]

/** Built-in presets. Names are fallbacks; i18n should override for display. */
export const PRESETS: Preset[] = [
    {
        id: PRESET_IDS.CLASSIC,
        name: 'Classic',
        wheels: { ghostWheel: true, itemWheel: false },
    },
    {
        id: PRESET_IDS.APOCALYPSE_LITE,
        name: 'Apocalypse',
        wheels: { ghostWheel: true, itemWheel: false },
    },
    {
        id: PRESET_IDS.ZERO_EVIDENCE,
        name: 'Zero evidence',
        wheels: { ghostWheel: true, itemWheel: false },
        lockedItems: [...ONE_EVIDENCE_MAX_LOCKED],
    },
    {
        id: PRESET_IDS.ZERO_SANITY,
        name: 'No sanity',
        wheels: { ghostWheel: true, itemWheel: true },
        lockedItems: [...NO_TRUCK_LOCKED],
    },
]

export function getPresetById(id: string): Preset | undefined {
    return PRESETS.find((p) => p.id === id)
}

export function getDefaultPreset(): Preset {
    return PRESETS.find((p) => p.id === PRESET_IDS.CLASSIC) ?? PRESETS[0]
}
