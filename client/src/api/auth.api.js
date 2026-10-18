import api from './axios.js'

export const registerAPI = (data) =>
    api.post('/api/auth/register', data)

export const loginAPI = (data) =>
    api.post('/api/auth/login', data)

export const logoutAPI = () =>
    api.post('/api/auth/logout')

export const getMeAPI = () =>
    api.get('/api/auth/me')

export const updateProfileAPI = (data) =>
    api.put('/api/auth/me', data)

export const changePasswordAPI = (data) =>
    api.put('/api/auth/change-password', data)