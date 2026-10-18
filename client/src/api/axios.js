import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // send httpOnly cookie on every request
    headers: {
        'Content-Type': 'application/json',
    },
})

// ── Response Interceptor
// Handles 401 globally - redirect to login if session expired

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status
        const url = error.config?.url

        const isSessionCheck =
            error.config?.method === 'get' && url?.includes('/auth/me')
        const isAuthPage = ['/login', '/register'].includes(window.location.pathname)

        // The initial session check may return 401 when the user is logged out.
        if (
            status === 401 &&
            !isSessionCheck &&
            !isAuthPage
        ) {
            window.location.href = '/login'
        }

        return Promise.reject(error)
    }
)

export default api