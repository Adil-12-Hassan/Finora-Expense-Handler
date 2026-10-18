import api from './axios.js'

export const getDashboardSummaryAPI = (params) =>
    api.get('/api/dashboard/summary', { params })
// params: { month }

export const getReportsAPI = (params) =>
    api.get('/api/dashboard/reports', { params })
// params: { month }