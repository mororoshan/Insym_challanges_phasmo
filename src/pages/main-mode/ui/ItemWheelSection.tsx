import { useCallback, useRef, useState } from 'react'
import { ENameSpaces } from '@/shared/config/i18next/models/i18n.namespaces'
import { useTranslation } from 'react-i18next'
import { WheelOfNames, type WheelOfNamesHandle } from '@/widgets/WheelOfNames'
import { AppModal } from '@/shared/ui/AppModal'
import {
    ALL_WHEEL_ITEMS,
    EVIDENCE,
    type WheelItem,
} from '@/shared/data/phasmophobia'

type Props = {
    itemsInWheel: string[]
    availableForUse: string[]
    onItemWheelComplete: (itemId: string) => void
}

function getItemById(id: string): WheelItem | undefined {
    return ALL_WHEEL_ITEMS.find((i) => i.id === id)
}

export function ItemWheelSection({
    itemsInWheel,
    availableForUse,
    onItemWheelComplete,
}: Props) {
    const { t } = useTranslation(ENameSpaces.MAIN_MODE)
    const wheelRef = useRef<WheelOfNamesHandle>(null)

    const getItemLabel = useCallback(
        (item: WheelItem) => {
            if (EVIDENCE.some((e) => e.id === item.id)) {
                return t(`evidence.${item.id}`)
            }
            return t(`sideEvidence.${item.id}`)
        },
        [t]
    )

    const wheelItems = ALL_WHEEL_ITEMS.filter((i) => itemsInWheel.includes(i.id))
    const [wheelSnapshot, setWheelSnapshot] = useState<WheelItem[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)

    const showModal = () => {
        setWheelSnapshot(wheelItems)
        setIsModalOpen(true)
    }

    const handleOk = () => {
        setIsModalOpen(false)
    }

    const handleCancel = () => {
        if (wheelRef.current?.isSpinning()) return
        setIsModalOpen(false)
    }

    const handleWheelComplete = useCallback(
        (item: WheelItem) => {
            onItemWheelComplete(item.id)
            setIsModalOpen(false)
        },
        [onItemWheelComplete]
    )

    return (
        <section className="mb-6">
            <h2 className="mb-3 text-lg font-semibold">{t('itemsWheel.title')}</h2>
            <p className="mb-3 text-sm text-neutral-500">
                {t('itemsWheel.hint')}
            </p>
            <div className="mb-3 flex flex-wrap items-center gap-4">
                <button
                    type="button"
                    onClick={showModal}
                    disabled={wheelItems.length === 0}
                    className="rounded bg-amber-500 px-4 py-2 font-medium text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {t('itemsWheel.spinButton')}
                </button>
                {wheelItems.length > 0 && (
                    <span className="text-sm text-neutral-500">
                        {t('itemsWheel.countInWheel', {
                            count: wheelItems.length,
                        })}
                    </span>
                )}
            </div>

            {availableForUse.length > 0 && (
                <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3">
                    <h3 className="mb-2 text-sm font-medium text-amber-900">
                        {t('itemsWheel.availableForUse')}
                    </h3>
                    <ul className="flex flex-wrap gap-2">
                        {availableForUse.map((id) => {
                            const item = getItemById(id)
                            const label = item
                                ? getItemLabel(item)
                                : id
                            return (
                                <li
                                    key={id}
                                    className="rounded bg-amber-100 px-2 py-1 text-sm font-medium text-amber-900"
                                >
                                    {label}
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )}

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
                    if (isOpen) wheelRef.current?.spin()
                }}
                footer={null}
            >
                <div className="flex justify-center py-4">
                    <WheelOfNames<WheelItem>
                        ref={wheelRef}
                        items={wheelSnapshot}
                        getLabel={getItemLabel}
                        onSpinComplete={handleWheelComplete}
                        disabled={wheelSnapshot.length === 0}
                        durationMs={4000}
                        fullRotations={6}
                        size={800}
                    />
                </div>
            </AppModal>
        </section>
    )
}
