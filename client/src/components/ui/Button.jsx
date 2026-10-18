import Spinner from './Spinner'

const variants = {
    primary: {
        background: 'var(--color-accent)',
        color: '#fff',
    },
    ghost: {
        background: 'transparent',
        color: 'var(--color-muted)',
        border: '1px solid var(--color-border)',
    },
    danger: {
        background: 'var(--color-red)',
        color: '#fff',
    },
}

const Button = ({
    children,
    variant = 'primary',
    loading = false,
    disabled = false,
    className = '',
    ...props
}) => {
    return (
        <button
            disabled={disabled || loading}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 ${className}`}
            style={variants[variant]}
            {...props}
        >
            {loading && <Spinner size="sm" />}
            {children}
        </button>
    )
}

export default Button