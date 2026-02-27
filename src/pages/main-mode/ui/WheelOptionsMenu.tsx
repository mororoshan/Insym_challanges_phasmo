import { useTranslation } from 'react-i18next'
import { ENameSpaces } from '@/shared/config/i18next/models/i18n.namespaces'
import { Slider, Switch } from 'antd'

export const GHOSTS_PER_ROLL_MIN = 1
export const GHOSTS_PER_ROLL_MAX = 8
export const DURATION_MS_MIN = 1000
export const DURATION_MS_MAX = 8000
export const DURATION_MS_STEP = 500

type Props = {
    ghostsPerRoll: number
    durationMs: number
    spunGhostsCrossedOut: boolean
    onGhostsPerRollChange: (value: number) => void
    onDurationMsChange: (value: number) => void
    onSpunGhostsCrossedOutChange: (value: boolean) => void
}

export function WheelOptionsMenu({
    ghostsPerRoll,
    durationMs,
    spunGhostsCrossedOut,
    onGhostsPerRollChange,
    onDurationMsChange,
    onSpunGhostsCrossedOutChange,
}: Props) {
    const { t } = useTranslation(ENameSpaces.MAIN_MODE)

    return (
        <div
            className="min-w-56 rounded-lg border border-neutral-600 bg- bg-main-bg p-4 shadow-lg"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
        >
            <div className="mb-4">
                <div className="mb-1 text-xs font-medium text-neutral-400">
                    {t('wheel.ghostsPerRoll')}: {ghostsPerRoll}
                </div>
                <Slider
                    classNames={{
                        root: 'text-white',
                        track: 'bg-amber-500',
                        handle: 'border-amber-500',
                    }}
                    min={GHOSTS_PER_ROLL_MIN}
                    max={GHOSTS_PER_ROLL_MAX}
                    value={ghostsPerRoll}
                    onChange={onGhostsPerRollChange}
                />
            </div>
            <div className="mb-4">
                <div className="mb-1 text-xs font-medium text-neutral-400">
                    {t('wheel.spinDuration')}: {(durationMs / 1000).toFixed(1)}s
                </div>
                <Slider
                    classNames={{
                        root: 'text-white',
                        track: 'bg-amber-500',
                        handle: 'border-amber-500',
                    }}
                    min={DURATION_MS_MIN / 1000}
                    max={DURATION_MS_MAX / 1000}
                    step={DURATION_MS_STEP / 1000}
                    value={durationMs / 1000}
                    onChange={(v) => onDurationMsChange((v ?? 4) * 1000)}
                />
            </div>
            <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-neutral-400">
                    {t('wheel.crossOutSpunInList')}
                </span>
                <Switch
                    classNames={{
                        root: spunGhostsCrossedOut ? 'bg-amber-500' : '',
                    }}
                    size="small"
                    checked={spunGhostsCrossedOut}
                    onChange={onSpunGhostsCrossedOutChange}
                />
            </div>
        </div>
    )
}
