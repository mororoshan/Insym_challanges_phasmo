import { ENameSpaces } from '@/shared/config/i18next/models/i18n.namespaces'
import { useTranslation } from 'react-i18next'
import { GHOSTS } from '@/shared/data/phasmophobia'
import type { Ghost, GhostId } from '@/shared/data/phasmophobia'

type Props = {
    crossedOutGhostIds: Set<GhostId>
    /** Ghosts that are in the wheel "says" list (already spun) — cannot be toggled */
    ghostIdsInWheel: Set<GhostId>
    onToggleGhost: (ghostId: GhostId) => void
}

export function GhostList({ crossedOutGhostIds, ghostIdsInWheel, onToggleGhost }: Props) {
    const { t } = useTranslation(ENameSpaces.MAIN_MODE)
    return (
        <section className="mb-6">
            <h2 className="mb-3 text-lg font-semibold">{t('ghosts.title')}</h2>
            <ul className="flex flex-wrap gap-2">
                {GHOSTS.map((ghost: Ghost) => {
                    const crossedOut = crossedOutGhostIds.has(ghost.id)
                    const inWheel = ghostIdsInWheel.has(ghost.id)
                    return (
                        <li key={ghost.id}>
                            <button
                                type="button"
                                disabled={inWheel}
                                onClick={(e) => {
                                    if (inWheel) return
                                    onToggleGhost(ghost.id)
                                    ;(e.currentTarget as HTMLButtonElement).blur()
                                }}
                                className={`rounded border px-3 py-1.5 text-left transition ${
                                    inWheel
                                        ? 'cursor-not-allowed border-neutral-600 bg-neutral-800/50 text-neutral-500 opacity-70'
                                        : crossedOut
                                          ? 'border-neutral-600 bg-neutral-700/50 text-neutral-500 line-through hover:bg-white/10'
                                          : 'border-neutral-500 bg-(--button-bg) text-white hover:bg-white/10'
                                }`}
                            >
                                {t(`ghosts.${ghost.id}`)}
                            </button>
                        </li>
                    )
                })}
            </ul>
            <p className="mt-2 text-sm text-(--sub-text)">{t('ghosts.hint')}</p>
        </section>
    )
}
