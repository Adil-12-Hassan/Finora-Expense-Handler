import { NavLink } from 'react-router-dom'
import {
    LayoutDashboard,
    ArrowLeftRight,
    BarChart2,
    Target,
    Settings,
} from 'lucide-react'
import ThemeToggle from './ThemeToggle'

const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
    { to: '/dashboard/transactions', icon: ArrowLeftRight, label: 'Expenses' },
    { to: '/dashboard/reports', icon: BarChart2, label: 'Reports' },
    { to: '/dashboard/budgets', icon: Target, label: 'Budgets' },
    { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

const Navbar = () => {
    return (
        <nav
            className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-2"
            style={{
                background: 'var(--color-surface)',
                borderTop: '1px solid var(--color-border)',
            }}
        >
            {links.map(({ to, icon: Icon, label }) => (
                <NavLink
                    key={to}
                    to={to}
                    end={to === '/dashboard'}
                    className="flex flex-col items-center gap-1 px-2 py-1.5 rounded-xl transition-all"
                    style={({ isActive }) => ({
                        color: isActive ? 'var(--color-accent)' : 'var(--color-muted)',
                    })}
                >
                    <Icon size={20} />
                    <span className="text-[10px] font-medium">{label}</span>
                </NavLink>
            ))}
            <ThemeToggle compact />
        </nav>
    )
}

export default Navbar