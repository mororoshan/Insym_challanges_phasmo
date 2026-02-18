import { Switch } from 'antd'
import { ENameSpaces } from '@/shared/config/i18next/models/i18n.namespaces'
import { useTranslation } from 'react-i18next'
import { EVIDENCE } from '@/shared/data/phasmophobia'
import type { EvidenceId } from '@/shared/data/phasmophobia'

type Props = {
    selectedEvidence: Set<EvidenceId>
    onToggleEvidence: (id: EvidenceId) => void
}

export function EvidenceSection({ selectedEvidence, onToggleEvidence }: Props) {
    const { t } = useTranslation(ENameSpaces.MAIN_MODE)
    return (
        <section className="mb-6">
            <h2 className="mb-3 text-lg font-semibold">{t('evidence.title')}</h2>
            <div className="flex flex-wrap gap-4">
                {EVIDENCE.map((ev) => (
                    <label
                        key={ev.id}
                        className="flex cursor-pointer items-center gap-2"
                    >
                        <Switch
                            checked={selectedEvidence.has(ev.id)}
                            onChange={() => onToggleEvidence(ev.id)}
                        />
                        <span>{t(`evidence.${ev.id}`)}</span>
                    </label>
                ))}
            </div>
            <p className="mt-2 text-sm text-(--sub-text)">{t('evidence.hint')}</p>
        </section>
    )
}
