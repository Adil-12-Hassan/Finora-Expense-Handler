import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    Wallet, TrendingUp, TrendingDown,
    Receipt, ArrowRight, Plus
} from 'lucide-react'
import useDashboardStore from '../store/useDashboardStore'
import useExpenseStore from '../store/useExpenseStore'
import useAuthStore from '../store/useAuthStore'
import StatCard from '../components/shared/StatBadge'
import ExpenseCard from '../components/shared/ExpenseCard'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Spinner from '../components/ui/Spinner'
import { formatCurrency } from '../utils/formatCurrency'
import { getMonthKey, getMonthLabel } from '../utils/getMonthKey'
import { CATEGORIES } from '../constants/categories'

const AddExpenseModal = ({ isOpen, onClose, onSuccess, editData }) => {
    const { addExpense, updateExpense, loading } = useExpenseStore()
    const isEdit = Boolean(editData)
    const [form, setForm] = useState(() => (
        editData
            ? {
                amount: editData.amount,
                category: editData.category,
                date: new Date(editData.date).toISOString().split('T')[0],
                note: editData.note || '',
            }
            : {
                amount: '',
                category: 'Food',
                date: new Date().toISOString().split('T')[0],
                note: '',
            }
    ))

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.amount || !form.category) return
        const ok = isEdit
            ? await updateExpense(editData._id, form)
            : await addExpense(form)
        if (ok) {
            onSuccess()
            onClose()
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? 'Edit Expense' : 'Add Expense'}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                    label="Amount"
                    type="number"
                    placeholder="0"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium"
                        style={{ color: 'var(--color-muted)' }}>
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
                    label="Date"
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
                <Input
                    label="Note (optional)"
                    type="text"
                    placeholder="What was this for?"
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                />
                <div className="flex gap-3 mt-1">
                    <Button variant="ghost" className="flex-1" type="button" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button className="flex-1" type="submit" loading={loading}>
                        {isEdit ? 'Save Changes' : 'Add Expense'}
                    </Button>
                </div>
            </form>
        </Modal>
    )
}

const Dashboard = () => {
    const { summary, fetchSummary, loading } = useDashboardStore()
    const { deleteExpense } = useExpenseStore()
    const { user } = useAuthStore()
    const [month] = useState(getMonthKey())
    const [modalOpen, setModalOpen] = useState(false)
    const [editData, setEditData] = useState(null)

    const load = useCallback(() => fetchSummary({ month }), [fetchSummary, month])

    const openAddModal = () => {
        setEditData(null)
        setModalOpen(true)
    }

    const openEditModal = (expense) => {
        setEditData(expense)
        setModalOpen(true)
    }

    const closeExpenseModal = () => {
        setModalOpen(false)
        setEditData(null)
    }

    useEffect(() => {
        load()
    }, [load])

    if (loading && !summary) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner size="lg" />
            </div>
        )
    }

    const currency = user?.currency || 'PKR'

    return (
        <div className="flex flex-col gap-6 max-w-5xl mx-auto">

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
                        Dashboard
                    </h1>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--color-muted)' }}>
                        {getMonthLabel(month)}
                    </p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity"
                    style={{
                        background: 'var(--color-accent)',
                        color: '#fff',
                    }}
                >
                    <Plus size={16} />
                    Add Expense
                </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard
                    label="Total Spent"
                    value={formatCurrency(summary?.totalSpent || 0, currency)}
                    sub={`${summary?.totalCount || 0} transactions`}
                    icon={<Receipt size={16} />}
                    accentColor="var(--color-accent)"
                />
                <StatCard
                    label="Monthly Budget"
                    value={formatCurrency(summary?.monthlyBudget || 0, currency)}
                    sub="Overall limit"
                    icon={<Wallet size={16} />}
                    accentColor="var(--color-green)"
                />
                <StatCard
                    label="Remaining"
                    value={formatCurrency(summary?.remaining || 0, currency)}
                    sub={`${summary?.percentage || 0}% used`}
                    icon={<TrendingDown size={16} />}
                    accentColor="var(--color-yellow)"
                />
                <StatCard
                    label="Top Category"
                    value={summary?.topCategories?.[0]?.category || '-'}
                    sub={summary?.topCategories?.[0]
                        ? formatCurrency(summary.topCategories[0].spent, currency)
                        : 'No data'}
                    icon={<TrendingUp size={16} />}
                    accentColor="var(--color-red)"
                />
            </div>

            {/* Budget Progress */}
            {summary?.monthlyBudget > 0 && (
                <div
                    className="rounded-2xl p-5 flex flex-col gap-3"
                    style={{
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                    }}
                >
                    <p className="text-sm font-medium"
                        style={{ color: 'var(--color-muted)' }}>
                        Monthly Budget
                    </p>
                    <div
                        className="w-full h-3 rounded-full overflow-hidden"
                        style={{ background: 'var(--color-surface-2)' }}
                    >
                        <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                                width: `${Math.min(summary?.percentage || 0, 100)}%`,
                                background: summary?.percentage >= 100
                                    ? 'var(--color-red)'
                                    : summary?.percentage >= 75
                                        ? 'var(--color-yellow)'
                                        : 'var(--color-accent)',
                            }}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
                            {formatCurrency(summary?.totalSpent || 0, currency)} spent
                        </span>
                        <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
                            {formatCurrency(summary?.monthlyBudget || 0, currency)} limit
                        </span>
                    </div>
                </div>
            )}

            {/* Top Categories */}
            {summary?.categoryBreakdown?.length > 0 && (
                <div
                    className="rounded-2xl p-5 flex flex-col gap-4"
                    style={{
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                    }}
                >
                    <p className="text-sm font-medium"
                        style={{ color: 'var(--color-muted)' }}>
                        Spending by Category
                    </p>
                    <div className="flex flex-col gap-3">
                        {summary.categoryBreakdown.map((c) => (
                            <div key={c.category} className="flex items-center gap-3">
                                <Badge category={c.category} />
                                <div className="flex-1">
                                    <div
                                        className="h-1.5 rounded-full overflow-hidden"
                                        style={{ background: 'var(--color-surface-2)' }}
                                    >
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${c.percentage}%`,
                                                background: 'var(--color-accent)',
                                            }}
                                        />
                                    </div>
                                </div>
                                <span
                                    className="text-sm font-medium w-20 text-right"
                                    style={{
                                        color: 'var(--color-text)',
                                        fontVariantNumeric: 'tabular-nums',
                                    }}
                                >
                                    {formatCurrency(c.spent, currency)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Transactions */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium"
                        style={{ color: 'var(--color-muted)' }}>
                        Recent Transactions
                    </p>
                    <Link
                        to="/transactions"
                        className="flex items-center gap-1 text-xs font-medium hover:opacity-80 transition-opacity"
                        style={{ color: 'var(--color-accent)' }}
                    >
                        View all <ArrowRight size={12} />
                    </Link>
                </div>

                {summary?.recentExpenses?.length > 0 ? (
                    <div className="flex flex-col gap-2">
                        {summary.recentExpenses.map((expense) => (
                            <ExpenseCard
                                key={expense._id}
                                expense={expense}
                                currency={currency}
                                onEdit={openEditModal}
                                onDelete={async (id) => {
                                    await deleteExpense(id)
                                    load()
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div
                        className="rounded-2xl p-10 flex flex-col items-center gap-3"
                        style={{
                            background: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                        }}
                    >
                        <Receipt size={32} style={{ color: 'var(--color-muted)' }} />
                        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                            No expenses this month
                        </p>
                        <button
                            onClick={openAddModal}
                            className="text-sm font-medium hover:opacity-80 transition-opacity"
                            style={{ color: 'var(--color-accent)' }}
                        >
                            Add your first expense
                        </button>
                    </div>
                )}
            </div>

            {/* Add Expense Modal */}
            {modalOpen && (
                <AddExpenseModal
                    isOpen={modalOpen}
                    onClose={closeExpenseModal}
                    onSuccess={load}
                    editData={editData}
                />
            )}
        </div>
    )
}

export default Dashboard