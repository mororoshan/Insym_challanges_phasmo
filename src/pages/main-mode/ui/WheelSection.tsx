import { useRef, useState } from 'react'
import { ENameSpaces } from '@/shared/config/i18next/models/i18n.namespaces'
import { useTranslation } from 'react-i18next'
import { WheelOfNames, type WheelOfNamesHandle } from '@/widgets/WheelOfNames'
import type { Ghost } from '@/shared/data/phasmophobia'

const WHEEL_SIZE_OPTIONS = [280, 320, 380, 420, 480] as const

type Props = {
    availableGhosts: Ghost[]
    onWheelComplete: (ghost: Ghost) => void
    onReset: () => void
    spunGhost: Ghost | null
    /** Initial wheel size in pixels (default 280). Ignored if not provided. */
    wheelSize?: number
}

export function WheelSection({
    availableGhosts,
    onWheelComplete,
    onReset,
    spunGhost,
    wheelSize: initialWheelSize,
}: Props) {
    const { t, i18n } = useTranslation(ENameSpaces.MAIN_MODE)
    const wheelRef = useRef<WheelOfNamesHandle>(null)
    const availableCount = availableGhosts.length
    const [wheelSize, setWheelSize] = useState(() => initialWheelSize ?? 380)

    return (
        <>
            <section className="mb-6">
                <div className="mb-3 flex flex-wrap items-center gap-4">
                    <button
                        type="button"
                        onClick={() => wheelRef.current?.spin()}
                        disabled={availableCount === 0}
                        className="rounded bg-amber-500 px-4 py-2 font-medium text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {t('wheel.spinButton')}
                    </button>
                    <button
                        type="button"
                        onClick={onReset}
                        className="rounded border border-neutral-400 bg-white px-4 py-2 font-medium transition hover:bg-neutral-50"
                    >
                        {t('wheel.resetButton')}
                    </button>
                    {availableCount > 0 && (
                        <span className="text-sm text-neutral-500">
                            {t('wheel.count', { count: availableCount })}
                        </span>
                    )}
                    <label className="flex items-center gap-2 text-sm">
                        <span className="text-neutral-600">
                            {t('wheel.sizeLabel')}:
                        </span>
                        <select
                            value={wheelSize}
                            onChange={(e) =>
                                setWheelSize(Number(e.target.value))
                            }
                            className="rounded border border-neutral-400 bg-white px-2 py-1"
                        >
                            {WHEEL_SIZE_OPTIONS.map((size) => (
                                <option key={size} value={size}>
                                    {size}px
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                <div className="flex justify-center py-4">
                    <WheelOfNames<Ghost>
                        key={wheelSize}
                        ref={wheelRef}
                        items={availableGhosts}
                        getLabel={(g) => t(`ghosts.${g.id}`)}
                        onSpinComplete={onWheelComplete}
                        disabled={availableCount === 0}
                        size={wheelSize}
                        durationMs={4000}
                        fullRotations={6}
                    />
                </div>
            </section>

            {spunGhost && (
                <section
                    key={`result-${i18n.language}`}
                    className="rounded-lg border-2 border-amber-500 bg-amber-50 p-4"
                >
                    <h2 className="mb-2 text-lg font-semibold">
                        {t('wheel.resultTitle')}
                    </h2>
                    <p className="text-xl font-bold text-amber-800">
                        {t(`ghosts.${spunGhost.id}`)}
                    </p>
                </section>
            )}
        </>
    )
}
