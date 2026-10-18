const getColor = (percentage) => {
    if (percentage >= 100) return 'var(--color-red)'
    if (percentage >= 75) return 'var(--color-yellow)'
    return 'var(--color-green)'
}

const BudgetProgressBar = ({ category, spent, limit, percentage, icon }) => {
    const color = getColor(percentage)

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-base">{icon}</span>
                    <span
                        className="text-sm font-medium"
                        style={{ color: 'var(--color-text)' }}
                    >
                        {category}
                    </span>
                </div>
                <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
                    {spent.toLocaleString()} / {limit.toLocaleString()}
                </span>
            </div>

            {/* Track */}
            <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ background: 'var(--color-surface-2)' }}
            >
                {/* Fill */}
                <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                        width: `${Math.min(percentage, 100)}%`,
                        background: color,
                    }}
                />
            </div>

            <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color }}>
                    {percentage}% used
                </span>
                {percentage >= 100 ? (
                    <span className="text-xs" style={{ color: 'var(--color-red)' }}>
                        Over budget
                    </span>
                ) : (
                    <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
                        {(limit - spent).toLocaleString()} left
                    </span>
                )}
            </div>
        </div>
    )
}

export default BudgetProgressBar