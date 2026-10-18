import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import useAuthStore from './store/useAuthStore'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transaction'
import Reports from './pages/Reports'
import Budgets from './pages/Budgets'
import Settings from './pages/Settings'
import Spinner from './components/ui/Spinner'

const ProtectedRoute = ({ children }) => {
    const { user } = useAuthStore()
    const location = useLocation()

    if (user) return children
    if (location.pathname === '/') return <Home />
    return <Navigate to="/" replace />
}

const GuestRoute = ({ children }) => {
    const { user } = useAuthStore()
    return !user ? children : <Navigate to="/" replace />
}

const App = () => {
    const { initAuth, initialized } = useAuthStore()

    useEffect(() => {
        initAuth()
    }, [initAuth])

    if (!initialized) {
        return (
            <div className="flex items-center justify-center min-h-screen"
                style={{ backgroundColor: 'var(--color-bg)' }}>
                <Spinner size="lg" />
            </div>
        )
    }

    return (
        <Routes>
            {/* Guest routes */}
            <Route path="/login" element={
                <GuestRoute><Login /></GuestRoute>
            } />
            <Route path="/register" element={
                <GuestRoute><Register /></GuestRoute>
            } />

            {/* Protected routes */}
            <Route path="/" element={
                <ProtectedRoute><Layout /></ProtectedRoute>
            }>
                <Route index element={<Dashboard />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="reports" element={<Reports />} />
                <Route path="budgets" element={<Budgets />} />
                <Route path="settings" element={<Settings />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default App