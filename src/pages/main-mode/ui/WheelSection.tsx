import { useRef, useState } from 'react'
import { ENameSpaces } from '@/shared/config/i18next/models/i18n.namespaces'
import { useTranslation } from 'react-i18next'
import { WheelOfNames, type WheelOfNamesHandle } from '@/widgets/WheelOfNames'
import type { Ghost } from '@/shared/data/phasmophobia'
import { Modal } from 'antd'
import { HistoryModal } from './HistoryModal'

type Props = {
    availableGhosts: Ghost[]
    onWheelComplete: (ghost: Ghost) => void
    onReset: () => void
    spunGhosts: Ghost[] | null
    /** Initial wheel size in pixels (default 280). Ignored if not provided. */
    wheelSize?: number
}

export function WheelSection({
    availableGhosts,
    onWheelComplete,
    onReset,
    spunGhosts,
}: Props) {
    const { t, i18n } = useTranslation(ENameSpaces.MAIN_MODE)
    const wheelRef = useRef<WheelOfNamesHandle>(null)
    const availableCount = availableGhosts.length

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isHistoryOpen, setIsHistoryOpen] = useState(false)
    const [wheelItemsSnapshot, setWheelItemsSnapshot] = useState<Ghost[]>([])

    const showModal = () => {
        setWheelItemsSnapshot([...availableGhosts])
        setIsModalOpen(true)
    }

    const handleOk = () => {
        setIsModalOpen(false)
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    return (
        <>
            <section className="mb-6">
                <div className="mb-3 flex flex-wrap items-center gap-4">
                    <button
                        type="button"
                        onClick={() => showModal()}
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

                <Modal
                    title="Basic Modal"
                    closable={{ 'aria-label': 'Custom Close Button' }}
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    afterOpenChange={(isOpen) => {
                        if (isOpen) wheelRef.current?.spin()
                    }}
                    footer={null}
                >
                    <div className="flex justify-center py-4">
                        <WheelOfNames<Ghost>
                            ref={wheelRef}
                            items={wheelItemsSnapshot}
                            getLabel={(g) => t(`ghosts.${g.id}`)}
                            onSpinComplete={onWheelComplete}
                            disabled={wheelItemsSnapshot.length === 0}
                            durationMs={4000}
                            fullRotations={6}
                        />
                    </div>
                </Modal>

                <HistoryModal
                    open={isHistoryOpen}
                    onClose={() => setIsHistoryOpen(false)}
                />
            </section>

            {spunGhosts && (
                <section
                    key={`result-${i18n.language}`}
                    className="flex gap-2 p-4"
                >
                    {spunGhosts.map((ghost) => (
                        <p className="p-1 text-xl w-fit font-bold text-amber-800 first:border-2 first:border-amber-500 first:rounded-2xl [:not(:first-child)]:line-through">
                            {t(`ghosts.${ghost.id}`)}
                        </p>
                    ))}
                </section>
            )}
        </>
    )
}
