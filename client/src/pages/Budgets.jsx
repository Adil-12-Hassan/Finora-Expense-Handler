import { useCallback, useEffect, useState } from 'react'
import { Plus, Target, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import useBudgetStore from '../store/useBudgetStore'
import useAuthStore from '../store/useAuthStore'
import BudgetProgressBar from '../components/shared/BudgetProgressBar'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Spinner from '../components/ui/Spinner'
import { CATEGORIES, getCategoryMeta } from '../constants/categories'
import { getMonthKey, getMonthLabel } from '../utils/getMonthKey'
import { formatCurrency } from '../utils/formatCurrency'

const BudgetModal = ({ isOpen, onClose, onSuccess, month }) => {
    const { setBudget, loading } = useBudgetStore()
    const [form, setForm] = useState({ category: 'Food', limit: '' })

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.limit || form.limit <= 0) return
        const ok = await setBudget({ ...form, month })
        if (ok) { onSuccess(); onClose() }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Set Budget">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <label
                        className="text-sm font-medium"
                        style={{ color: 'var(--color-muted)' }}
                    >
                        Category
                    </label>
                    <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                        style={{
                            background: 'var(--color-surface-2)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text)',
                        }}
                    >
                        {CATEGORIES.map((c) => (
                            <option key={c.value} value={c.value}>
                                {c.icon} {c.label}
                            </option>
                        ))}
                    </select>
                </div>
                <Input
                    label="Monthly Limit"
                    type="number"
                    placeholder="0"
                    value={form.limit}
                    onChange={(e) => setForm({ ...form, limit: e.target.value })}
                />
                <div className="flex gap-3 mt-1">
                    <Button variant="ghost" className="flex-1" type="button" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button className="flex-1" type="submit" loading={loading}>
                        Save Budget
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

const Budgets = () => {
    const { budgets, summary, loading, fetchBudgets, fetchSummary, deleteBudget } = useBudgetStore()
    const { user } = useAuthStore()
    const currency = user?.currency || 'PKR'
    const [month, setMonth] = useState(getMonthKey())
    const [modalOpen, setModalOpen] = useState(false)

    const load = useCallback(() => {
        fetchBudgets({ month })
        fetchSummary({ month })
    }, [fetchBudgets, fetchSummary, month])

    useEffect(() => { load() }, [load])

    const changeMonth = (dir) => {
        const [y, m] = month.split('-').map(Number)
        const d = new Date(y, m - 1 + dir, 1)
        setMonth(getMonthKey(d))
    }

    const handleDelete = async (id) => {
        await deleteBudget(id)
        load()
    }

    return (
        <div className="flex flex-col gap-6 max-w-3xl mx-auto">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1
                        className="text-2xl font-bold tracking-tight"
                        style={{
                            fontFamily: 'var(--font-display)',
                            color: 'var(--color-text)',
                        }}
                    >
                        Budgets
                    </h1>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--color-muted)' }}>
                        Set limits per category
                    </p>
                </div>
                <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ background: 'var(--color-accent)', color: '#fff' }}
                >
                    <Plus size={16} />
                    Set Budget
                </button>
            </div>

            {/* Month Selector */}
            <div
                className="flex items-center justify-between rounded-2xl px-4 py-3"
                style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                }}
            >
                <button
                    onClick={() => changeMonth(-1)}
                    className="p-1.5 rounded-lg cursor-pointer hover:opacity-70 transition-opacity"
                    style={{ color: 'var(--color-muted)' }}
                >
                    <ChevronLeft size={18} />
                </button>
                <span
                    className="text-sm font-semibold"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
                >
                    {getMonthLabel(month)}
                </span>
                <button
                    onClick={() => changeMonth(1)}
                    className="p-1.5 rounded-lg cursor-pointer hover:opacity-70 transition-opacity"
                    style={{ color: 'var(--color-muted)' }}
                >
                    <ChevronRight size={18} />
                </button>
            </div>

            {/* Overall Summary */}
            {summary && summary.monthlyBudget > 0 && (
                <div
                    className="rounded-2xl p-5 flex flex-col gap-4"
                    style={{
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                    }}
                >
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium"
                            style={{ color: 'var(--color-muted)' }}>
                            Overall Budget
                        </p>
                        <span
                            className="text-xs px-2.5 py-1 rounded-lg font-medium"
                            style={{
                                background: summary.percentage >= 100
                                    ? 'rgba(242,92,92,0.1)'
                                    : summary.percentage >= 75
                                        ? 'rgba(245,166,35,0.1)'
                                        : 'rgba(52,201,122,0.1)',
                                color: summary.percentage >= 100
                                    ? 'var(--color-red)'
                                    : summary.percentage >= 75
                                        ? 'var(--color-yellow)'
                                        : 'var(--color-green)',
                            }}
                        >
                            {summary.percentage}% used
                        </span>
                    </div>

                    {/* Big numbers */}
                    <div className="flex items-end justify-between">
                        <div>
                            <p
                                className="text-3xl font-bold tracking-tight"
                                style={{
                                    fontFamily: 'var(--font-display)',
                                    color: 'var(--color-text)',
                                    fontVariantNumeric: 'tabular-nums',
                                }}
                            >
                                {formatCurrency(summary.totalSpent, currency)}
                            </p>
                            <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
                                of {formatCurrency(summary.monthlyBudget, currency)} budget
                            </p>
                        </div>
                        <div className="text-right">
                            <p
                                className="text-lg font-semibold"
                                style={{
                                    fontFamily: 'var(--font-display)',
                                    color: summary.remaining === 0
                                        ? 'var(--color-red)'
                                        : 'var(--color-green)',
                                    fontVariantNumeric: 'tabular-nums',
                                }}
                            >
                                {formatCurrency(summary.remaining, currency)}
                            </p>
                            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
                                remaining
                            </p>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div
                        className="w-full h-2.5 rounded-full overflow-hidden"
                        style={{ background: 'var(--color-surface-2)' }}
                    >
                        <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                                width: `${Math.min(summary.percentage, 100)}%`,
                                background: summary.percentage >= 100
                                    ? 'var(--color-red)'
                                    : summary.percentage >= 75
                                        ? 'var(--color-yellow)'
                                        : 'var(--color-accent)',
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Category Budgets */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Spinner size="lg" />
                </div>
            ) : budgets.length > 0 ? (
                <div className="flex flex-col gap-3">
                    {budgets.map((budget) => {
                        const meta = getCategoryMeta(budget.category)
                        return (
                            <div
                                key={budget._id}
                                className="rounded-2xl p-5"
                                style={{
                                    background: 'var(--color-surface)',
                                    border: '1px solid var(--color-border)',
                                }}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <BudgetProgressBar
                                        category={budget.category}
                                        spent={budget.spent}
                                        limit={budget.limit}
                                        percentage={budget.percentage}
                                        icon={meta.icon}
                                    />
                                    <button
                                        onClick={() => handleDelete(budget._id)}
                                        className="ml-4 p-1.5 rounded-lg cursor-pointer hover:opacity-70 transition-opacity flex-shrink-0"
                                        style={{ color: 'var(--color-red)' }}
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div
                    className="rounded-2xl p-12 flex flex-col items-center gap-3"
                    style={{
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                    }}
                >
                    <Target size={36} style={{ color: 'var(--color-muted)' }} />
                    <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                        No budgets set for this month
                    </p>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="text-sm font-medium hover:opacity-80 transition-opacity"
                        style={{ color: 'var(--color-accent)' }}
                    >
                        Set your first budget
                    </button>
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <BudgetModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSuccess={load}
                    month={month}
                />
            )}
        </div>
    )
}

export default Budgets