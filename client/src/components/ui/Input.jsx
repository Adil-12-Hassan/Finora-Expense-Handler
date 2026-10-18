const Input = ({
    label,
    error,
    className = '',
    ...props
}) => {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label className="text-sm font-medium"
                    style={{ color: 'var(--color-muted)' }}>
                    {label}
                </label>
            )}
            <input
                className={`w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all ${className}`}
                style={{
                    background: 'var(--color-surface-2)',
                    border: `1px solid ${error ? 'var(--color-red)' : 'var(--color-border)'}`,
                    color: 'var(--color-text)',
                }}
                onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-accent)'
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = error
                        ? 'var(--color-red)'
                        : 'var(--color-border)'
                }}
                {...props}
            />
            {error && (
                <span className="text-xs" style={{ color: 'var(--color-red)' }}>
                    {error}
                </span>
            )}
        </div>
    )
}

export default Input