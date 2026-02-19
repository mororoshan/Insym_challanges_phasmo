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

function groupSessionsByDate(
    sessions: RollSession[]
): Map<string, RollSession[]> {
    const map = new Map<string, RollSession[]>()
    for (const session of sessions) {
        const d = new Date(session.createdAt)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        const list = map.get(key) ?? []
        list.push(session)
        map.set(key, list)
    }
    return map
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
                        const [y, m, d] = dateKey.split('-').map(Number)
                        const now = new Date()
                        const isCurrentYear = y === now.getFullYear()
                        const isCurrentMonth =
                            isCurrentYear && m === now.getMonth() + 1
                        const dateLabel = new Date(
                            y,
                            m - 1,
                            d
                        ).toLocaleDateString(undefined, {
                            weekday: 'short',
                            ...(isCurrentMonth ? {} : { month: 'short' }),
                            day: 'numeric',
                            ...(isCurrentYear ? {} : { year: 'numeric' }),
                        })
                        const daySessions = byDate.get(dateKey) ?? []
                        return (
                            <section key={dateKey} className="mb-4 last:mb-0">
                                <Divider
                                    orientation="horizontal"
                                    className="text-xs! text-neutral-500! mt-4! first:mt-0!"
                                >
                                    {dateLabel}
                                </Divider>
                                <table className="w-full border-collapse text-left">
                                    <tbody>
                                        {daySessions.map((session) => (
                                            <tr
                                                key={session.id}
                                                className="border-b border-neutral-600 hover:bg-amber-500/15"
                                            >
                                                <td className="py-2 pr-4 text-sm text-neutral-600 whitespace-nowrap w-0">
                                                    {new Date(
                                                        session.createdAt
                                                    ).toLocaleTimeString(
                                                        undefined,
                                                        {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        }
                                                    )}
                                                </td>
                                                <td className="py-2 text-sm text-white">
                                                    <div>
                                                        {session.rolls
                                                            .length === 0
                                                            ? '—'
                                                            : session.rolls
                                                                  .map((r) =>
                                                                      t(
                                                                          `ghosts.${r.itemId}`
                                                                      )
                                                                  )
                                                                  .join(' → ')}
                                                    </div>
                                                    {session.itemRollOrder &&
                                                        session.itemRollOrder
                                                            .length > 0 && (
                                                            <div className="mt-1 text-xs text-neutral-400">
                                                                {t(
                                                                    'history.itemsOrder'
                                                                )}
                                                                :{' '}
                                                                {session.itemRollOrder
                                                                    .map(
                                                                        (id) =>
                                                                            EVIDENCE.some(
                                                                                (
                                                                                    e
                                                                                ) =>
                                                                                    e.id ===
                                                                                    id
                                                                            )
                                                                                ? t(
                                                                                      `evidence.${id}`
                                                                                  )
                                                                                : t(
                                                                                      `sideEvidence.${id}`
                                                                                  )
                                                                    )
                                                                    .join(
                                                                        ' → '
                                                                    )}
                                                            </div>
                                                        )}
                                                    {session.believersWon !==
                                                        undefined && (
                                                        <div className="mt-1">
                                                            {session.believersWon ? (
                                                                <span className="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium bg-emerald-500/20 text-emerald-300">
                                                                    {t(
                                                                        'history.won'
                                                                    )}
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium bg-red-500/20 text-red-300">
                                                                    {session.actualGhostId
                                                                        ? t(
                                                                              'history.lostWithGhost',
                                                                              {
                                                                                  ghost: t(
                                                                                      `ghosts.${session.actualGhostId}`
                                                                                  ),
                                                                              }
                                                                          )
                                                                        : t(
                                                                              'history.lost'
                                                                          )}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                                {isEditMode && (
                                                    <td className="py-2 pl-2 w-0">
                                                        <RemoveSessionButton
                                                            onRemove={() =>
                                                                store.deleteSession(
                                                                    session.id
                                                                )
                                                            }
                                                            removeLabel={t(
                                                                'history.remove'
                                                            )}
                                                            removeConfirm={t(
                                                                'history.removeConfirm'
                                                            )}
                                                        />
                                                    </td>
                                                )}
                                            </tr>
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
