import { create } from 'zustand'
import {
    getExpensesAPI,
    addExpenseAPI,
    updateExpenseAPI,
    deleteExpenseAPI,
} from '../api/expense.api'
import toast from 'react-hot-toast'

const useExpenseStore = create((set) => ({
    expenses: [],
    pagination: null,
    loading: false,
    filters: {
        month: null,
        category: '',
        search: '',
        page: 1,
        limit: 20,
    },

    setFilters: (newFilters) => {
        set((state) => ({
            filters: { ...state.filters, ...newFilters },
        }))
    },

    fetchExpenses: async (params) => {
        set({ loading: true })
        try {
            const res = await getExpensesAPI(params)
            set({
                expenses: res.data.expenses,
                pagination: res.data.pagination,
            })
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch expenses')
        } finally {
            set({ loading: false })
        }
    },

    addExpense: async (data) => {
        set({ loading: true })
        try {
            await addExpenseAPI(data)
            toast.success('Expense added')
            return true
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add expense')
            return false
        } finally {
            set({ loading: false })
        }
    },

    updateExpense: async (id, data) => {
        set({ loading: true })
        try {
            await updateExpenseAPI(id, data)
            toast.success('Expense updated')
            return true
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update expense')
            return false
        } finally {
            set({ loading: false })
        }
    },

    deleteExpense: async (id) => {
        try {
            await deleteExpenseAPI(id)
            set((state) => ({
                expenses: state.expenses.filter((e) => e._id !== id),
            }))
            toast.success('Expense deleted')
            return true
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete expense')
            return false
        }
    },
}))

export default useExpenseStore