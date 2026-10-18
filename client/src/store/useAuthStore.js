import { create } from 'zustand'
import {
    getMeAPI,
    loginAPI,
    logoutAPI,
    registerAPI,
    updateProfileAPI,
    changePasswordAPI,
} from '../api/auth.api'
import toast from 'react-hot-toast'

const useAuthStore = create((set) => ({
    user: null,
    loading: false,
    initialized: false,

    initAuth: async () => {
        try {
            const res = await getMeAPI()
            set({ user: res.data.user, initialized: true })
        } catch {
            set({ user: null, initialized: true })
        }
    },

    register: async (data) => {
        set({ loading: true })
        try {
            const res = await registerAPI(data)
            set({ user: res.data.user })
            toast.success('Account created successfully')
            return true
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed')
            return false
        } finally {
            set({ loading: false })
        }
    },

    login: async (data) => {
        set({ loading: true })
        try {
            const res = await loginAPI(data)
            set({ user: res.data.user })
            toast.success('Welcome back!')
            return true
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed')
            return false
        } finally {
            set({ loading: false })
        }
    },

    logout: async () => {
        try {
            await logoutAPI()
            set({ user: null })
            toast.success('Logged out successfully')
        } catch {
            toast.error('Logout failed')
        }
    },

    updateProfile: async (data) => {
        set({ loading: true })
        try {
            const res = await updateProfileAPI(data)
            set({ user: res.data.user })
            toast.success('Profile updated')
            return true
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed')
            return false
        } finally {
            set({ loading: false })
        }
    },

    changePassword: async (data) => {
        set({ loading: true })
        try {
            await changePasswordAPI(data)
            toast.success('Password changed successfully')
            return true
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to change password')
            return false
        } finally {
            set({ loading: false })
        }
    },
}))

export default useAuthStore