import { useEffect, useMemo, useState } from 'react'
import { Button, Divider, Popconfirm } from 'antd'
import { AppModal } from '@/shared/ui/AppModal'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { ENameSpaces } from '@/shared/config/i18next/models/i18n.namespaces'
import { useSessionsStore } from '@/app/store'
import { MODE_IDS } from '@/shared/types/session'
import type { RollSession } from '@/shared/types/session'
import { EVIDENCE } from '@/shared/data/phasmophobia'

type Props = {
    open: boolean
    onClose: () => void
}

type RemoveSessionButtonProps = {
    onRemove: () => void | Promise<void>
    removeLabel: string
    removeConfirm: string
}

function toDateKey(date: Date): string {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
}

function groupSessionsByDate(
    sessions: RollSession[]
): Map<string, RollSession[]> {
    const map = new Map<string, RollSession[]>()
    for (const session of sessions) {
        const key = toDateKey(new Date(session.createdAt))
        const list = map.get(key) ?? []
        list.push(session)
        map.set(key, list)
    }
    return map
}

function formatDateLabel(dateKey: string): string {
    const [y, m, d] = dateKey.split('-').map(Number)
    const date = new Date(y, m - 1, d)
    const now = new Date()
    const isCurrentYear = y === now.getFullYear()
    const isCurrentMonth = isCurrentYear && m === now.getMonth() + 1

    return date.toLocaleDateString(undefined, {
        weekday: 'short',
        ...(isCurrentMonth ? {} : { month: 'short' }),
        day: 'numeric',
        ...(isCurrentYear ? {} : { year: 'numeric' }),
    })
}

function RemoveSessionButton({
    onRemove,
    removeLabel,
    removeConfirm,
}: RemoveSessionButtonProps) {
    return (
        <Popconfirm
            title={removeConfirm}
            onConfirm={() => void onRemove()}
            okText={removeLabel}
            okButtonProps={{ danger: true }}
            cancelButtonProps={{ autoFocus: true }}
        >
            <Button type="text" size="small" danger aria-label={removeLabel}>
                {removeLabel}
            </Button>
        </Popconfirm>
    )
}

type SessionRowProps = {
    session: RollSession
    isEditMode: boolean
    t: (key: string, opts?: { ghost?: string }) => string
    onRemove: (id: string) => void
}

function SessionRow({ session, isEditMode, t, onRemove }: SessionRowProps) {
    const timeStr = new Date(session.createdAt).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
    })

    const rollsDisplay =
        session.rolls.length === 0
            ? '—'
            : session.rolls.map((r) => t(`ghosts.${r.itemId}`)).join(' → ')

    const hasItemOrder =
        session.itemRollOrder && session.itemRollOrder.length > 0
    const itemOrderDisplay = hasItemOrder
        ? session
              .itemRollOrder!.map((id) =>
                  EVIDENCE.some((e) => e.id === id)
                      ? t(`evidence.${id}`)
                      : t(`sideEvidence.${id}`)
              )
              .join(' → ')
        : null

    const showOutcome = session.believersWon !== undefined

    return (
        <tr className="border-b border-neutral-600 hover:bg-amber-500/15 first:border-t">
            <td className="py-2 pr-4 text-sm text-neutral-600 whitespace-nowrap w-0">
                {timeStr}
            </td>
            <td className="py-2 text-sm text-white">
                <div>{rollsDisplay}</div>
                {itemOrderDisplay != null && (
                    <div className="mt-1 text-xs text-neutral-400">
                        {t('history.itemsOrder')}: {itemOrderDisplay}
                    </div>
                )}
                {showOutcome && (
                    <div className="mt-1">
                        {session.believersWon ? (
                            <span className="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium bg-emerald-500/20 text-emerald-300">
                                {t('history.won')}
                            </span>
                        ) : (
                            <span className="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium bg-red-500/20 text-red-300">
                                {session.actualGhostId
                                    ? t('history.lostWithGhost', {
                                          ghost: t(
                                              `ghosts.${session.actualGhostId}`
                                          ),
                                      })
                                    : t('history.lost')}
                            </span>
                        )}
                    </div>
                )}
            </td>
            {isEditMode && (
                <td className="py-2 pl-2 w-0">
                    <RemoveSessionButton
                        onRemove={() => onRemove(session.id)}
                        removeLabel={t('history.remove')}
                        removeConfirm={t('history.removeConfirm')}
                    />
                </td>
            )}
        </tr>
    )
}

export const HistoryModal = observer(function HistoryModal({
    open,
    onClose,
}: Props) {
    const { t } = useTranslation(ENameSpaces.MAIN_MODE)
    const store = useSessionsStore()
    const sessions = store.getSessionsByMode(MODE_IDS.MAIN)
    const [isEditMode, setIsEditMode] = useState(false)

    useEffect(() => {
        if (!open) setIsEditMode(false)
    }, [open])

    const byDate = useMemo(() => groupSessionsByDate(sessions), [sessions])
    const sortedDates = useMemo(
        () => Array.from(byDate.keys()).sort((a, b) => b.localeCompare(a)),
        [byDate]
    )

    const modalTitle = (
        <div className="flex items-start justify-start gap-4 text-white">
            <span>{t('history.title')}</span>
            {sessions.length > 0 && (
                <Button
                    type="text"
                    size="small"
                    onClick={() => setIsEditMode((prev) => !prev)}
                    className="text-white!"
                    aria-label={
                        isEditMode ? t('history.done') : t('history.edit')
                    }
                >
                    {isEditMode ? t('history.done') : t('history.edit')}
                </Button>
            )}
        </div>
    )

    return (
        <AppModal
            centered
            title={modalTitle}
            open={open}
            onCancel={onClose}
            footer={null}
            width={560}
            classNames={{
                container: 'bg-[#242424]',
                body: 'flex flex-col min-h-0 max-h-[70vh]',
            }}
        >
            {sessions.length === 0 ? (
                <p className="py-4 text-neutral-100">{t('history.empty')}</p>
            ) : (
                <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
                    {sortedDates.map((dateKey) => {
                        const dateLabel = formatDateLabel(dateKey)
                        const daySessions = byDate.get(dateKey) ?? []
                        return (
                            <section key={dateKey} className="mb-4 last:mb-0">
                                <Divider
                                    classNames={{ rail: 'border-transparent' }}
                                    orientation="horizontal"
                                    className="text-xs text-neutral-400 mt-4 first:mt-0"
                                >
                                    {dateLabel}
                                </Divider>
                                <table className="w-full border-collapse text-left">
                                    <tbody>
                                        {daySessions.map((session) => (
                                            <SessionRow
                                                key={session.id}
                                                session={session}
                                                isEditMode={isEditMode}
                                                t={t}
                                                onRemove={store.deleteSession}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </section>
                        )
                    })}
                </div>
            )}
        </AppModal>
    )
})
