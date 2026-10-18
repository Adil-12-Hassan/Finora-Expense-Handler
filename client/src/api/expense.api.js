import api from './axios.js'

export const getExpensesAPI = (params) =>
    api.get('/api/expenses', { params })
// params: { month, category, search, page, limit }

export const getExpenseAPI = (id) =>
    api.get(`/api/expenses/${id}`)

export const addExpenseAPI = (data) =>
    api.post('/api/expenses', data)

export const updateExpenseAPI = (id, data) =>
    api.put(`/api/expenses/${id}`, data)

export const deleteExpenseAPI = (id) =>
    api.delete(`/api/expenses/${id}`)