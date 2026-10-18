import { useEffect } from 'react'
import { X } from 'lucide-react'

const Modal = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden'
        else document.body.style.overflow = ''
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
            onClick={onClose}
        >
            <div
                className="w-full sm:max-w-md rounded-2xl p-6 flex flex-col gap-5"
                style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold"
                        style={{ fontFamily: 'var(--font-display)' }}>
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg transition-colors cursor-pointer hover:opacity-70"
                        style={{ color: 'var(--color-muted)' }}
                    >
                        <X size={18} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}

export default Modal