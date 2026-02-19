export function SettingsSection({
    title,
    description,
    children,
}: {
    title: string
    description: string
    children: React.ReactNode
}) {
    return (
        <section className="rounded-xl border border-white/15 bg-white/5 p-5">
            <h2 className="mb-1 text-lg font-semibold">{title}</h2>
            <p className="mb-4 text-sm text-white/70">{description}</p>
            {children}
        </section>
    )
}
