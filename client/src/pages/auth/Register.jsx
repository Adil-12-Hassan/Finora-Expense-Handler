import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Wallet, Eye, EyeOff } from 'lucide-react'
import useAuthStore from '../../store/useAuthStore'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const Register = () => {
    const { register, loading } = useAuthStore()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [form, setForm] = useState({ name: '', email: '', password: '' })
    const [errors, setErrors] = useState({})

    const validate = () => {
        const e = {}
        if (!form.name || form.name.length < 2) e.name = 'Name must be at least 2 characters'
        if (!form.email) e.email = 'Email is required'
        if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return
        const ok = await register(form)
        if (ok) navigate('/dashboard')
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{ backgroundColor: 'var(--color-bg)' }}
        >
            <div
                className="w-full max-w-sm rounded-2xl p-8 flex flex-col gap-7"
                style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                }}
            >
                {/* Logo */}
                <div className="flex flex-col items-center gap-3">
                    <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ background: 'var(--color-accent)' }}
                    >
                        <Wallet size={22} color="#fff" />
                    </div>
                    <div className="text-center">
                        <h1
                            className="text-2xl font-bold tracking-tight"
                            style={{
                                fontFamily: 'var(--font-display)',
                                color: 'var(--color-text)',
                            }}
                        >
                            Create account
                        </h1>
                        <p
                            className="text-sm mt-1"
                            style={{ color: 'var(--color-muted)' }}
                        >
                            Start tracking your finances
                        </p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        label="Full name"
                        type="text"
                        placeholder="Syed Hassan"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        error={errors.name}
                    />
                    <Input
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        error={errors.email}
                    />

                    <div className="flex flex-col gap-1.5">
                        <label
                            className="text-sm font-medium"
                            style={{ color: 'var(--color-muted)' }}
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Min. 6 characters"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none pr-11"
                                style={{
                                    background: 'var(--color-surface-2)',
                                    border: `1px solid ${errors.password ? 'var(--color-red)' : 'var(--color-border)'}`,
                                    color: 'var(--color-text)',
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--color-accent)'}
                                onBlur={(e) => e.target.style.borderColor = errors.password ? 'var(--color-red)' : 'var(--color-border)'}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:opacity-70"
                                style={{ color: 'var(--color-muted)' }}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {errors.password && (
                            <span className="text-xs" style={{ color: 'var(--color-red)' }}>
                                {errors.password}
                            </span>
                        )}
                    </div>

                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full mt-1"
                    >
                        Create account
                    </Button>
                </form>

                {/* Footer */}
                <p
                    className="text-sm text-center"
                    style={{ color: 'var(--color-muted)' }}
                >
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="font-medium hover:opacity-80 transition-opacity"
                        style={{ color: 'var(--color-accent)' }}
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Register