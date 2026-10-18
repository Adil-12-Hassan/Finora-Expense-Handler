import { NavLink } from 'react-router-dom'
import {
    LayoutDashboard,
    ArrowLeftRight,
    BarChart2,
    Target,
    Settings,
    LogOut,
    Wallet,
} from 'lucide-react'
import useAuthStore from '../../store/useAuthStore'
import ThemeToggle from './ThemeToggle'

const links = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
    { to: '/reports', icon: BarChart2, label: 'Reports' },
    { to: '/budgets', icon: Target, label: 'Budgets' },
    { to: '/settings', icon: Settings, label: 'Settings' },
]

const Sidebar = () => {
    const { user, logout } = useAuthStore()

    return (
        <aside
            className="hidden lg:flex flex-col w-60 min-h-screen fixed left-0 top-0 z-40 px-4 py-6"
            style={{
                background: 'var(--color-surface)',
                borderRight: '1px solid var(--color-border)',
            }}
        >
            {/* Logo */}
            <div className="flex items-center justify-between px-3 mb-8">
                <div className="flex items-center gap-2.5">
                    <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={{ background: 'var(--color-accent)' }}
                    >
                        <Wallet size={16} color="#fff" />
                    </div>
                    <span
                        className="text-lg font-bold tracking-tight"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
                    >
                        Finora
                    </span>
                </div>
                <ThemeToggle />
            </div>

            {/* Nav links */}
            <nav className="flex flex-col gap-1 flex-1">
                {links.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/'}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                        style={({ isActive }) => ({
                            background: isActive ? 'var(--color-accent-soft)' : 'transparent',
                            color: isActive ? 'var(--color-accent)' : 'var(--color-muted)',
                        })}
                    >
                        <Icon size={18} />
                        {label}
                    </NavLink>
                ))}
            </nav>

            {/* User + Logout */}
            <div
                className="mt-auto pt-4 flex flex-col gap-3"
                style={{ borderTop: '1px solid var(--color-border)' }}
            >
                <div className="px-3 flex items-center gap-3">
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 overflow-hidden"
                        style={{
                            background: 'var(--color-accent-soft)',
                            color: 'var(--color-accent)',
                        }}
                    >
                        {user?.profileImage ? (
                            <img
                                src={user.profileImage}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            user?.name?.[0]?.toUpperCase()
                        )}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span
                            className="text-sm font-medium truncate"
                            style={{ color: 'var(--color-text)' }}
                        >
                            {user?.name}
                        </span>
                        <span
                            className="text-xs truncate"
                            style={{ color: 'var(--color-muted)' }}
                        >
                            {user?.email}
                        </span>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer w-full hover:opacity-80"
                    style={{ color: 'var(--color-red)' }}
                >
                    <LogOut size={18} />
                    Log out
                </button>
            </div>
        </aside>
    )
}

export default Sidebar