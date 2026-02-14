import { ENameSpaces } from '@/shared/config/i18next/models/i18n.namespaces'
import { useTranslation } from 'react-i18next'
import { GHOSTS } from '@/shared/data/phasmophobia'
import type { Ghost, GhostId } from '@/shared/data/phasmophobia'

type Props = {
    crossedOutGhostIds: Set<GhostId>
    onToggleGhost: (ghostId: GhostId) => void
}

export function GhostList({ crossedOutGhostIds, onToggleGhost }: Props) {
    const { t } = useTranslation(ENameSpaces.MAIN_MODE)
    return (
        <section className="mb-6">
            <h2 className="mb-3 text-lg font-semibold">{t('ghosts.title')}</h2>
            <ul className="flex flex-wrap gap-2">
                {GHOSTS.map((ghost: Ghost) => {
                    const crossedOut = crossedOutGhostIds.has(ghost.id)
                    return (
                        <li key={ghost.id}>
                            <button
                                type="button"
                                onClick={() => onToggleGhost(ghost.id)}
                                className={`rounded border px-3 py-1.5 text-left transition hover:bg-neutral-100 ${
                                    crossedOut
                                        ? 'border-neutral-300 bg-neutral-100 text-neutral-500 line-through'
                                        : 'border-neutral-400 bg-white'
                                }`}
                            >
                                {t(`ghosts.${ghost.id}`)}
                            </button>
                        </li>
                    )
                })}
            </ul>
            <p className="mt-2 text-sm text-neutral-500">{t('ghosts.hint')}</p>
        </section>
    )
}
