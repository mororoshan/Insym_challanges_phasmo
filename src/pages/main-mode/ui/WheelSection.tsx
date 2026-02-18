import { useCallback, useEffect, useRef, useState } from 'react'
import { ENameSpaces } from '@/shared/config/i18next/models/i18n.namespaces'
import { useTranslation } from 'react-i18next'
import { WheelOfNames, type WheelOfNamesHandle } from '@/widgets/WheelOfNames'
import type { Ghost } from '@/shared/data/phasmophobia'
import { AppModal } from '@/shared/ui/AppModal'
import { HistoryModal } from './HistoryModal'

type Props = {
    availableGhosts: Ghost[]
    onWheelComplete: (ghost: Ghost) => void
    onEndGame: () => void
    spunGhosts: Ghost[] | null
    /** Initial wheel size in pixels (default 280). Ignored if not provided. */
    wheelSize?: number
}

export function WheelSection({
    availableGhosts,
    onWheelComplete,
    onEndGame,
    spunGhosts,
}: Props) {
    const { t, i18n } = useTranslation(ENameSpaces.MAIN_MODE)
    const wheelRef = useRef<WheelOfNamesHandle>(null)
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const availableCount = availableGhosts.length

    const AUTO_CLOSE_MS = 1000

    const clearCloseTimeout = useCallback(() => {
        if (closeTimeoutRef.current != null) {
            clearTimeout(closeTimeoutRef.current)
            closeTimeoutRef.current = null
        }
    }, [])

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isHistoryOpen, setIsHistoryOpen] = useState(false)
    const [wheelItemsSnapshot, setWheelItemsSnapshot] = useState<Ghost[]>([])

    const showModal = () => {
        setWheelItemsSnapshot([...availableGhosts])
        setIsModalOpen(true)
    }

    const handleOk = () => {
        clearCloseTimeout()
        setIsModalOpen(false)
    }

    const handleCancel = () => {
        if (wheelRef.current?.isSpinning()) return
        clearCloseTimeout()
        setIsModalOpen(false)
    }

    const handleWheelComplete = useCallback(
        (ghost: Ghost) => {
            onWheelComplete(ghost)
            clearCloseTimeout()
            closeTimeoutRef.current = setTimeout(() => {
                closeTimeoutRef.current = null
                setIsModalOpen(false)
            }, AUTO_CLOSE_MS)
        },
        [onWheelComplete, clearCloseTimeout]
    )

    useEffect(() => () => clearCloseTimeout(), [clearCloseTimeout])

    return (
        <>
            <section className="mb-6">
                <div className="mb-3 flex flex-wrap items-center gap-4">
                    <button
                        type="button"
                        onClick={() => showModal()}
                        disabled={availableCount <= 1}
                        className="rounded bg-amber-500 px-4 py-2 font-medium text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {t('wheel.spinButton')}
                    </button>
                    <button
                        type="button"
                        onClick={onEndGame}
                        disabled={!spunGhosts || spunGhosts.length === 0}
                        className="rounded border border-neutral-400 bg-white px-4 py-2 font-medium transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-none"
                    >
                        {t('wheel.endGameButton')}
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsHistoryOpen(true)}
                        className="rounded border border-neutral-400 bg-white px-4 py-2 font-medium transition hover:bg-neutral-50"
                    >
                        {t('wheel.historyButton')}
                    </button>
                    {availableCount > 0 && (
                        <span className="text-sm text-neutral-500">
                            {t('wheel.count', { count: availableCount })}
                        </span>
                    )}
                </div>

                <AppModal
                    centered
                    closable={false}
                    styles={{
                        container: {
                            boxShadow: 'none',
                            backgroundColor: 'transparent',
                        },
                    }}
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    afterOpenChange={(isOpen) => {
                        if (isOpen) {
                            wheelRef.current?.spin()
                        } else {
                            clearCloseTimeout()
                        }
                    }}
                    footer={null}
                >
                    <div className="flex justify-center py-4">
                        <WheelOfNames<Ghost>
                            ref={wheelRef}
                            items={wheelItemsSnapshot}
                            getLabel={(g) => t(`ghosts.${g.id}`)}
                            onSpinComplete={handleWheelComplete}
                            disabled={wheelItemsSnapshot.length === 0}
                            durationMs={4000}
                            fullRotations={6}
                            size={800}
                        />
                    </div>
                </AppModal>

                <HistoryModal
                    open={isHistoryOpen}
                    onClose={() => setIsHistoryOpen(false)}
                />
            </section>

            {spunGhosts && spunGhosts.length > 0 && (
                <section
                    key={`result-${i18n.language}`}
                    className="rounded-lg border border-amber-200 bg-amber-50/50 p-3"
                >
                    <h3 className="mb-2 text-sm font-medium text-amber-900">
                        {t('wheel.resultTitle')}
                    </h3>
                    <ul className="flex flex-wrap gap-2">
                        {spunGhosts.map((ghost, index) => (
                            <li
                                key={`${ghost.id}-${index}`}
                                className="rounded bg-amber-100 px-2 py-1 text-sm font-medium text-amber-900 not-first:line-through"
                            >
                                {t(`ghosts.${ghost.id}`)}
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </>
    )
}
