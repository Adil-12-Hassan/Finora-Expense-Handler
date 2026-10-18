const StatCard = ({ label, value, sub, icon, accentColor }) => {
    return (
        <div
            className="rounded-2xl p-5 flex flex-col gap-3"
            style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
            }}
        >
            <div className="flex items-center justify-between">
                <span
                    className="text-sm font-medium"
                    style={{ color: 'var(--color-muted)' }}
                >
                    {label}
                </span>
                {icon && (
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: `${accentColor || 'var(--color-accent)'}18` }}
                    >
                        <span style={{ color: accentColor || 'var(--color-accent)' }}>
                            {icon}
                        </span>
                    </div>
                )}
            </div>
            <div>
                <p
                    className="text-2xl font-bold tracking-tight"
                    style={{
                        fontFamily: 'var(--font-display)',
                        color: 'var(--color-text)',
                        fontVariantNumeric: 'tabular-nums',
                    }}
                >
                    {value}
                </p>
                {sub && (
                    <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
                        {sub}
                    </p>
                )}
            </div>
        </div>
    )
}

export default StatCard