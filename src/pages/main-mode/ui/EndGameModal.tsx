import { useState, type CSSProperties } from 'react'
import { Button } from 'antd'
import { AppModal } from '@/shared/ui/AppModal'
import { ENameSpaces } from '@/shared/config/i18next/models/i18n.namespaces'
import { useTranslation } from 'react-i18next'
import { GHOSTS } from '@/shared/data/phasmophobia'
import type { GhostId } from '@/shared/data/phasmophobia'

type Step = 'question' | 'pick-ghost'

type Props = {
    open: boolean
    onClose: () => void
    onConfirm: (believersWon: boolean, actualGhostId?: GhostId) => void
}

const defaultBtnStyle: CSSProperties = {
    background: '#404040',
    borderColor: '#525252',
    color: '#e5e5e5',
}
const defaultBtnHoverStyle: CSSProperties = {
    background: '#525252',
    borderColor: '#737373',
    color: '#fff',
}
const primaryBtnStyle: CSSProperties = {
    background: '#f59e0b',
    borderColor: 'transparent',
    color: '#292524',
}
const primaryBtnHoverStyle: CSSProperties = {
    background: '#d97706',
    color: '#292524',
}

export function EndGameModal({ open, onClose, onConfirm }: Props) {
    const { t } = useTranslation(ENameSpaces.MAIN_MODE)
    const [step, setStep] = useState<Step>('question')
    const [selectedGhostId, setSelectedGhostId] = useState<GhostId | null>(null)
    const [hoveredBtn, setHoveredBtn] = useState<string | null>(null)

    const handleClose = () => {
        setStep('question')
        setSelectedGhostId(null)
        onClose()
    }

    const handleBelieversWon = () => {
        onConfirm(true)
        handleClose()
    }

    const handleBelieversLost = () => {
        setStep('pick-ghost')
    }

    const handleGhostSelect = (ghostId: GhostId) => {
        setSelectedGhostId(ghostId)
    }

    const handleConfirmGhost = () => {
        if (selectedGhostId != null) {
            onConfirm(false, selectedGhostId)
            handleClose()
        }
    }

    const isQuestionStep = step === 'question'

    const modalTitle = (
        <span className="text-white">
            {isQuestionStep ? t('endGame.title') : t('endGame.whichGhost')}
        </span>
    )

    const footer = isQuestionStep ? (
        <div className="flex justify-end gap-2">
            <Button
                onClick={handleClose}
                style={
                    hoveredBtn === 'cancel'
                        ? defaultBtnHoverStyle
                        : defaultBtnStyle
                }
                onMouseEnter={() => setHoveredBtn('cancel')}
                onMouseLeave={() => setHoveredBtn(null)}
            >
                {t('endGame.cancel')}
            </Button>
            <Button
                type="primary"
                onClick={handleBelieversWon}
                style={
                    hoveredBtn === 'won'
                        ? primaryBtnHoverStyle
                        : primaryBtnStyle
                }
                onMouseEnter={() => setHoveredBtn('won')}
                onMouseLeave={() => setHoveredBtn(null)}
            >
                {t('endGame.believersWon')}
            </Button>
            <Button
                onClick={handleBelieversLost}
                style={
                    hoveredBtn === 'lost'
                        ? defaultBtnHoverStyle
                        : defaultBtnStyle
                }
                onMouseEnter={() => setHoveredBtn('lost')}
                onMouseLeave={() => setHoveredBtn(null)}
            >
                {t('endGame.believersLost')}
            </Button>
        </div>
    ) : (
        <div className="flex justify-end gap-2">
            <Button
                onClick={() => setStep('question')}
                style={
                    hoveredBtn === 'back'
                        ? defaultBtnHoverStyle
                        : defaultBtnStyle
                }
                onMouseEnter={() => setHoveredBtn('back')}
                onMouseLeave={() => setHoveredBtn(null)}
            >
                {t('endGame.back')}
            </Button>
            <Button
                type="primary"
                disabled={selectedGhostId == null}
                onClick={handleConfirmGhost}
                style={{
                    ...(hoveredBtn === 'confirm' && selectedGhostId != null
                        ? primaryBtnHoverStyle
                        : primaryBtnStyle),
                    ...(selectedGhostId == null ? { opacity: 0.5 } : {}),
                }}
                onMouseEnter={() => setHoveredBtn('confirm')}
                onMouseLeave={() => setHoveredBtn(null)}
            >
                {t('endGame.confirmGhost')}
            </Button>
        </div>
    )

    return (
        <AppModal
            centered
            title={modalTitle}
            open={open}
            onCancel={handleClose}
            footer={footer}
            width={560}
            classNames={{
                container: 'bg-[#242424]',
                body: 'flex flex-col min-h-0 max-h-[70vh]',
                footer: 'bg-[#242424]',
            }}
        >
            {isQuestionStep ? (
                <p className="text-neutral-200">
                    {t('endGame.believersWonQuestion')}
                </p>
            ) : (
                <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
                    <p className="mb-3 text-sm text-neutral-400">
                        {t('endGame.whichGhostHint')}
                    </p>
                    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {GHOSTS.map((ghost) => (
                            <li key={ghost.id}>
                                <button
                                    type="button"
                                    onClick={() => handleGhostSelect(ghost.id)}
                                    className={`w-full rounded-lg border px-3 py-2 text-left text-sm font-medium transition ${
                                        selectedGhostId === ghost.id
                                            ? 'border-amber-500 bg-amber-500/20 text-amber-200'
                                            : 'border-neutral-600 bg-neutral-700/50 text-neutral-200 hover:border-neutral-500 hover:bg-neutral-600/50'
                                    }`}
                                >
                                    {t(`ghosts.${ghost.id}`)}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </AppModal>
    )
}
