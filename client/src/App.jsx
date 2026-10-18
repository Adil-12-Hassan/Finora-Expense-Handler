import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
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

// Only accessible when logged in — redirects to /login otherwise
const ProtectedRoute = ({ children }) => {
    const { user } = useAuthStore()
    return user ? children : <Navigate to="/login" replace />
}

// Only accessible when logged out — redirects to /dashboard otherwise
const GuestRoute = ({ children }) => {
    const { user } = useAuthStore()
    return !user ? children : <Navigate to="/dashboard" replace />
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
            {/* Public landing page */}
            <Route path="/" element={<Home />} />

            {/* Guest-only routes */}
            <Route path="/login" element={
                <GuestRoute><Login /></GuestRoute>
            } />
            <Route path="/register" element={
                <GuestRoute><Register /></GuestRoute>
            } />

            {/* Protected app routes */}
            <Route path="/dashboard" element={
                <ProtectedRoute><Layout /></ProtectedRoute>
            }>
                <Route index element={<Dashboard />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="reports" element={<Reports />} />
                <Route path="budgets" element={<Budgets />} />
                <Route path="settings" element={<Settings />} />
            </Route>

            {/* Fallback — send unknown paths to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default App