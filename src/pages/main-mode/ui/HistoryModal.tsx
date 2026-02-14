import { useMemo } from 'react'
import { Divider, Modal } from 'antd'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { ENameSpaces } from '@/shared/config/i18next/models/i18n.namespaces'
import { useSessionsStore } from '@/app/store'
import { MODE_IDS } from '@/shared/types/session'
import type { RollSession } from '@/shared/types/session'

type Props = {
    open: boolean
    onClose: () => void
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

    const byDate = useMemo(() => groupSessionsByDate(sessions), [sessions])
    const sortedDates = useMemo(
        () => Array.from(byDate.keys()).sort((a, b) => b.localeCompare(a)),
        [byDate]
    )

    return (
        <Modal
            title={t('history.title')}
            open={open}
            onCancel={onClose}
            footer={null}
            width={560}
        >
            {sessions.length === 0 ? (
                <p className="py-4 text-neutral-500">{t('history.empty')}</p>
            ) : (
                <div className="max-h-[70vh] overflow-auto">
                    {sortedDates.map((dateKey) => {
                        const [y, m, d] = dateKey.split('-').map(Number)
                        const dateLabel = new Date(
                            y,
                            m - 1,
                            d
                        ).toLocaleDateString(undefined, {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
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
                                                className="border-b border-neutral-100 hover:bg-amber-50/50"
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
                                                <td className="py-2 text-sm text-amber-800">
                                                    {session.rolls.length === 0
                                                        ? '—'
                                                        : session.rolls
                                                              .map((r) =>
                                                                  t(
                                                                      `ghosts.${r.itemId}`
                                                                  )
                                                              )
                                                              .join(' → ')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </section>
                        )
                    })}
                </div>
            )}
        </Modal>
    )
})
