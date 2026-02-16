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
    APOCALYPSE_LITE: 'apocalypse-lite',
    WHEEL_ONLY: 'wheel-only',
    ONE_EVIDENCE_MAX: 'one-evidence-max',
    NO_TRUCK: 'no-truck',
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
        name: 'Apocalypse-Lite',
        wheels: { ghostWheel: true, itemWheel: true },
    },
    {
        id: PRESET_IDS.WHEEL_ONLY,
        name: 'Wheel Only',
        wheels: { ghostWheel: true, itemWheel: false },
    },
    {
        id: PRESET_IDS.ONE_EVIDENCE_MAX,
        name: 'One Evidence Max',
        wheels: { ghostWheel: true, itemWheel: true },
        lockedItems: [...ONE_EVIDENCE_MAX_LOCKED],
    },
    {
        id: PRESET_IDS.NO_TRUCK,
        name: 'No Truck',
        wheels: { ghostWheel: true, itemWheel: true },
        lockedItems: [...NO_TRUCK_LOCKED],
    },
    {
        id: PRESET_IDS.STREAMER_TORTURE,
        name: 'Streamer Torture',
        wheels: { ghostWheel: true, itemWheel: true },
    },
    {
        id: PRESET_IDS.CHAT_DECIDES,
        name: 'Chat Decides Everything',
        wheels: { ghostWheel: true, itemWheel: true },
    },
]

export function getPresetById(id: string): Preset | undefined {
    return PRESETS.find((p) => p.id === id)
}

export function getDefaultPreset(): Preset {
    return PRESETS.find((p) => p.id === PRESET_IDS.CLASSIC) ?? PRESETS[0]
}
