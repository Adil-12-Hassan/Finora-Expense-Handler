import api from './axios.js'

export const getBudgetsAPI = (params) =>
    api.get('/api/budgets', { params })
// params: { month }

export const getBudgetSummaryAPI = (params) =>
    api.get('/api/budgets/summary', { params })
// params: { month }

export const setBudgetAPI = (data) =>
    api.post('/api/budgets', data)
// data: { category, limit, month }

export const deleteBudgetAPI = (id) =>
    api.delete(`/api/budgets/${id}`)