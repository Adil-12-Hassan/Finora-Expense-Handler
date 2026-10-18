const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
}

const Spinner = ({ size = 'md' }) => {
    return (
        <div
            className={`${sizes[size]} rounded-full animate-spin`}
            style={{
                borderColor: 'var(--color-border)',
                borderTopColor: 'var(--color-accent)',
            }}
        />
    )
}

export default Spinner