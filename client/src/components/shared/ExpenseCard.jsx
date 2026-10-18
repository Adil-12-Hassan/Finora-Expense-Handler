import { Pencil, Trash2 } from 'lucide-react'
import Badge from '../ui/Badge'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'

const ExpenseCard = ({ expense, currency, onEdit, onDelete }) => {
    return (
        <div
            className="flex items-center justify-between px-4 py-3.5 rounded-xl transition-all"
            style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
            }}
        >
            <div className="flex items-center gap-3 min-w-0">
                <Badge category={expense.category} />
                <div className="flex flex-col min-w-0">
                    <span
                        className="text-sm font-medium truncate"
                        style={{ color: 'var(--color-text)' }}
                    >
                        {expense.note || expense.category}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
                        {formatDate(expense.date)}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                <span
                    className="text-sm font-semibold"
                    style={{
                        color: 'var(--color-text)',
                        fontVariantNumeric: 'tabular-nums',
                        fontFamily: 'var(--font-display)',
                    }}
                >
                    {formatCurrency(expense.amount, currency)}
                </span>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onEdit(expense)}
                        type="button"
                        aria-label={`Edit ${expense.note || expense.category}`}
                        className="p-1.5 rounded-lg cursor-pointer hover:opacity-70 transition-opacity"
                        style={{ color: 'var(--color-muted)' }}
                    >
                        <Pencil size={14} />
                    </button>
                    <button
                        onClick={() => onDelete(expense._id)}
                        type="button"
                        aria-label={`Delete ${expense.note || expense.category}`}
                        className="p-1.5 rounded-lg cursor-pointer hover:opacity-70 transition-opacity"
                        style={{ color: 'var(--color-red)' }}
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ExpenseCard