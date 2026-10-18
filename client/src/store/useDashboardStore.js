import { create } from 'zustand'
import { getDashboardSummaryAPI, getReportsAPI } from '../api/dashboard.api'
import toast from 'react-hot-toast'

const useDashboardStore = create((set) => ({
    summary: null,
    reports: null,
    loading: false,
    reportsLoading: false,

    fetchSummary: async (params) => {
        set({ loading: true })
        try {
            const res = await getDashboardSummaryAPI(params)
            set({ summary: res.data })
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch dashboard')
        } finally {
            set({ loading: false })
        }
    },

    fetchReports: async (params) => {
        set({ reportsLoading: true })
        try {
            const res = await getReportsAPI(params)
            set({ reports: res.data })
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch reports')
        } finally {
            set({ reportsLoading: false })
        }
    },
}))

export default useDashboardStore