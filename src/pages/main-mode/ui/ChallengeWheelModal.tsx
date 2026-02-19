import { useCallback, useRef } from 'react'
import { ENameSpaces } from '@/shared/config/i18next/models/i18n.namespaces'
import { useTranslation } from 'react-i18next'
import { WheelOfNames, type WheelOfNamesHandle } from '@/widgets/WheelOfNames'
import type { Preset } from '@/shared/types/preset'
import { PRESETS } from '@/shared/data/presets'
import { AppModal } from '@/shared/ui/AppModal'

type Props = {
    open: boolean
    onPresetChosen: (preset: Preset) => void
    onClose?: () => void
}

export function ChallengeWheelModal({ open, onPresetChosen, onClose }: Props) {
    const { t } = useTranslation(ENameSpaces.MAIN_MODE)
    const wheelRef = useRef<WheelOfNamesHandle>(null)

    const getLabel = useCallback(
        (preset: Preset) => t(`presets.${preset.id}`, preset.name),
        [t]
    )

    const handleCancel = useCallback(() => {
        if (wheelRef.current?.isSpinning()) return
        onClose?.()
    }, [onClose])

    const handleWheelComplete = useCallback(
        (preset: Preset) => {
            onPresetChosen(preset)
        },
        [onPresetChosen]
    )

    const wheelItems = open ? PRESETS : []

    return (
        <AppModal
            centered
            closable={!!onClose}
            onCancel={onClose ? handleCancel : undefined}
            classNames={{
                container: 'shadow-none bg-transparent',
            }}
            open={open}
            afterOpenChange={(isOpen) => {
                if (isOpen) wheelRef.current?.spin()
            }}
            footer={null}
            title={null}
        >
            <div className="flex justify-center py-4">
                <WheelOfNames<Preset>
                    ref={wheelRef}
                    items={wheelItems}
                    getLabel={getLabel}
                    onSpinComplete={handleWheelComplete}
                    disabled={wheelItems.length === 0}
                    durationMs={4000}
                    fullRotations={6}
                    size={800}
                />
            </div>
        </AppModal>
    )
}
