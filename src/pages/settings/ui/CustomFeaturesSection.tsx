import { Switch } from 'antd'
import { useTranslation } from 'react-i18next'
import { ENameSpaces } from '@/shared/config/i18next/models/i18n.namespaces'
import type { CustomGameFeatures } from '@/shared/types/gameMode'

const CUSTOM_FEATURE_KEYS: { key: keyof CustomGameFeatures }[] = [
    { key: 'ghostWheel' },
    { key: 'itemWheel' },
    { key: 'evidenceSection' },
    { key: 'ghostList' },
]

export function CustomFeaturesSection({
    customFeatures,
    setCustomFeature,
}: {
    customFeatures: CustomGameFeatures
    setCustomFeature: (key: keyof CustomGameFeatures, value: boolean) => void
}) {
    const { t } = useTranslation(ENameSpaces.SETTINGS)
    return (
        <div className="mt-6 overflow-hidden rounded-xl border border-white/15">
            <div className="border-b border-white/10 px-4 py-3">
                <h3 className="text-sm font-medium text-white/90">
                    {t('customFeatures.sectionTitle')}
                </h3>
                <p className="mt-0.5 text-xs text-white/70">
                    {t('customFeatures.sectionDescription')}
                </p>
            </div>
            <ul className="divide-y divide-white/10">
                {CUSTOM_FEATURE_KEYS.map(({ key }) => (
                    <li
                        key={key}
                        className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-white/5"
                    >
                        <span className="text-sm font-medium">
                            {t(`customFeatures.${key}`)}
                        </span>
                        <span className="shrink-0">
                            <Switch
                                classNames={{
                                    root: customFeatures[key]
                                        ? 'bg-amber-500'
                                        : '',
                                }}
                                checked={customFeatures[key]}
                                onChange={(checked) =>
                                    setCustomFeature(key, checked)
                                }
                                size="small"
                            />
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
