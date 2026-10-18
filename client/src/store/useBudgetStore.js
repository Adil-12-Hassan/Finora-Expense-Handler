import { create } from 'zustand'
import {
    getBudgetsAPI,
    getBudgetSummaryAPI,
    setBudgetAPI,
    deleteBudgetAPI,
} from '../api/budget.api'
import toast from 'react-hot-toast'

const useBudgetStore = create((set) => ({
    budgets: [],
    summary: null,
    loading: false,

    fetchBudgets: async (params) => {
        set({ loading: true })
        try {
            const res = await getBudgetsAPI(params)
            set({ budgets: res.data.budgets })
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch budgets')
        } finally {
            set({ loading: false })
        }
    },

    fetchSummary: async (params) => {
        try {
            const res = await getBudgetSummaryAPI(params)
            set({ summary: res.data.summary })
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch summary')
        }
    },

    setBudget: async (data) => {
        set({ loading: true })
        try {
            await setBudgetAPI(data)
            toast.success('Budget saved')
            return true
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save budget')
            return false
        } finally {
            set({ loading: false })
        }
    },

    deleteBudget: async (id) => {
        try {
            await deleteBudgetAPI(id)
            set((state) => ({
                budgets: state.budgets.filter((b) => b._id !== id),
            }))
            toast.success('Budget removed')
            return true
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to remove budget')
            return false
        }
    },
}))

export default useBudgetStore