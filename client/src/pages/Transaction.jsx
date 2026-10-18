import { useCallback, useEffect, useState } from 'react'
import { Search, Filter, Plus, Receipt, ChevronLeft, ChevronRight } from 'lucide-react'
import useExpenseStore from '../store/useExpenseStore'
import useAuthStore from '../store/useAuthStore'
import ExpenseCard from '../components/shared/ExpenseCard'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Spinner from '../components/ui/Spinner'
import { CATEGORIES } from '../constants/categories'
import { getMonthKey, getMonthLabel } from '../utils/getMonthKey'

const ExpenseModal = ({ isOpen, onClose, onSuccess, editData }) => {
    const { addExpense, updateExpense, loading } = useExpenseStore()
    const isEdit = !!editData

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

const Transactions = () => {
    const { expenses, pagination, loading, fetchExpenses, deleteExpense } = useExpenseStore()
    const { user } = useAuthStore()
    const currency = user?.currency || 'PKR'

    const [month, setMonth] = useState(getMonthKey())
    const [category, setCategory] = useState('')
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [modalOpen, setModalOpen] = useState(false)
    const [editData, setEditData] = useState(null)

    const load = useCallback(() => {
        fetchExpenses({
            month,
            category: category || undefined,
            search: search || undefined,
            page,
            limit: 20,
        })
    }, [fetchExpenses, month, category, search, page])

    useEffect(() => {
        const t = setTimeout(load, search ? 400 : 0)
        return () => clearTimeout(t)
    }, [load, search])

    const handleEdit = (expense) => {
        setEditData(expense)
        setModalOpen(true)
    }

    const handleDelete = async (id) => {
        await deleteExpense(id)
        load()
    }

    const handleModalClose = () => {
        setModalOpen(false)
        setEditData(null)
    }

    // Month navigation
    const changeMonth = (dir) => {
        const [y, m] = month.split('-').map(Number)
        const d = new Date(y, m - 1 + dir, 1)
        setMonth(getMonthKey(d))
        setPage(1)
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
                        Transactions
                    </h1>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--color-muted)' }}>
                        {pagination?.total || 0} expenses
                    </p>
                </div>
                <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ background: 'var(--color-accent)', color: '#fff' }}
                >
                    <Plus size={16} />
                    Add
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

            {/* Filters */}
            <div className="flex gap-3">
                {/* Search */}
                <div className="relative flex-1">
                    <Search
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2"
                        style={{ color: 'var(--color-muted)' }}
                    />
                    <input
                        type="text"
                        placeholder="Search by note..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
                        style={{
                            background: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text)',
                        }}
                    />
                </div>

                {/* Category Filter */}
                <div className="relative">
                    <Filter
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: 'var(--color-muted)' }}
                    />
                    <select
                        value={category}
                        onChange={(e) => { setCategory(e.target.value); setPage(1) }}
                        className="pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none cursor-pointer"
                        style={{
                            background: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            color: category ? 'var(--color-text)' : 'var(--color-muted)',
                        }}
                    >
                        <option value="">All</option>
                        {CATEGORIES.map((c) => (
                            <option key={c.value} value={c.value}>
                                {c.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Expense List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Spinner size="lg" />
                </div>
            ) : expenses.length > 0 ? (
                <div className="flex flex-col gap-2">
                    {expenses.map((expense) => (
                        <ExpenseCard
                            key={expense._id}
                            expense={expense}
                            currency={currency}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            ) : (
                <div
                    className="rounded-2xl p-12 flex flex-col items-center gap-3"
                    style={{
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                    }}
                >
                    <Receipt size={36} style={{ color: 'var(--color-muted)' }} />
                    <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                        No expenses found
                    </p>
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 rounded-xl cursor-pointer disabled:opacity-30 hover:opacity-70 transition-opacity"
                        style={{
                            background: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text)',
                        }}
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-sm" style={{ color: 'var(--color-muted)' }}>
                        {page} / {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                        disabled={page === pagination.totalPages}
                        className="p-2 rounded-xl cursor-pointer disabled:opacity-30 hover:opacity-70 transition-opacity"
                        style={{
                            background: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text)',
                        }}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <ExpenseModal
                    isOpen={modalOpen}
                    onClose={handleModalClose}
                    onSuccess={load}
                    editData={editData}
                />
            )}
        </div>
    )
}

export default Transactions