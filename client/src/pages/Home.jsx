import {
    ArrowRight,
    BarChart3,
    Check,
    Download,
    Receipt,
    Smartphone,
    Target,
    Wallet,
    X,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from '../components/layout/ThemeToggle'

const APK_URL =
    'https://raw.githubusercontent.com/Adil-12-Hassan/Finora-Expense-Handler/main/releases/dowload/v1.1/Finora-v1.1.apk'

function AppBanner() {
    const [dismissed, setDismissed] = useState(() => {
        try {
            return localStorage.getItem('finora_app_banner_dismissed') === '1'
        } catch {
            return false
        }
    })

    if (dismissed) return null

    const handleDismiss = () => {
        try {
            localStorage.setItem('finora_app_banner_dismissed', '1')
        } catch {
            // ignore
        }
        setDismissed(true)
    }

    return (
        <div
            className="w-full px-4 py-2.5 flex items-center justify-between gap-3"
            style={{ background: 'var(--color-accent)', color: '#fff' }}
        >
            <div className="flex items-center gap-2.5 min-w-0">
                <Smartphone size={16} className="shrink-0" />
                <span className="text-sm font-medium truncate">
                    Finora is now on Android —{' '}
                    <a
                        href={APK_URL}
                        download
                        className="underline underline-offset-2 font-semibold hover:opacity-80 transition-opacity"
                    >
                        Download the app
                    </a>
                </span>
            </div>
            <button
                onClick={handleDismiss}
                aria-label="Dismiss"
                className="shrink-0 opacity-80 hover:opacity-100 transition-opacity"
            >
                <X size={16} />
            </button>
        </div>
    )
}

const features = [
    {
        icon: Receipt,
        title: 'Track every expense',
        description: 'Add transactions in seconds and see exactly where your money goes.',
    },
    {
        icon: Target,
        title: 'Set meaningful budgets',
        description: 'Create monthly limits by category and keep an eye on your progress.',
    },
    {
        icon: BarChart3,
        title: 'Understand your habits',
        description: 'Turn your spending history into clear reports and useful trends.',
    },
]

const Home = () => (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
        <AppBanner />
        <header className="flex items-center justify-between px-5 sm:px-8 py-5 max-w-6xl mx-auto">
            <Link to="/" className="flex items-center gap-2.5" aria-label="Finora home">
                <img src="/favicon.svg" alt="" className="w-9 h-9 rounded-xl" />
                <span
                    className="text-lg font-bold tracking-tight"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
                >
                    Finora
                </span>
            </Link>
            <nav className="flex items-center gap-2 sm:gap-3">
                <ThemeToggle />
                <Link
                    to="/login"
                    className="px-3 py-2 text-sm font-medium rounded-xl transition-opacity hover:opacity-75"
                    style={{ color: 'var(--color-text)' }}
                >
                    Sign in
                </Link>
                <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-semibold rounded-xl transition-opacity hover:opacity-90"
                    style={{ background: 'var(--color-accent)', color: '#fff' }}
                >
                    Get started
                </Link>
            </nav>
        </header>

        <main>
            <section className="px-5 sm:px-8 pt-14 pb-16 sm:pt-20 sm:pb-24 max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="flex flex-col items-start gap-6">
                        <span
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                            style={{
                                background: 'var(--color-accent-soft)',
                                color: 'var(--color-accent)',
                            }}
                        >
                            <Wallet size={14} />
                            A clearer view of your money
                        </span>
                        <h1
                            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
                            style={{
                                fontFamily: 'var(--font-display)',
                                color: 'var(--color-text)',
                            }}
                        >
                            Your money,
                            <br />
                            <span style={{ color: 'var(--color-accent)' }}>with a plan.</span>
                        </h1>
                        <p
                            className="text-base sm:text-lg leading-relaxed max-w-xl"
                            style={{ color: 'var(--color-muted)' }}
                        >
                            Keep track of spending, make room for what matters, and feel more
                            confident about your everyday finances.
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                            <Link
                                to="/register"
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
                                style={{ background: 'var(--color-accent)', color: '#fff' }}
                            >
                                Create your free account
                                <ArrowRight size={16} />
                            </Link>
                            <Link
                                to="/login"
                                className="px-4 py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-75"
                                style={{
                                    color: 'var(--color-text)',
                                    border: '1px solid var(--color-border)',
                                }}
                            >
                                I already have an account
                            </Link>
                        </div>
                        <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1">
                            {['Simple expense tracking', 'Category budgets', 'Clear reports'].map((item) => (
                                <span
                                    key={item}
                                    className="inline-flex items-center gap-1.5 text-xs"
                                    style={{ color: 'var(--color-muted)' }}
                                >
                                    <Check size={14} style={{ color: 'var(--color-green)' }} />
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div
                        className="rounded-3xl p-5 sm:p-7 shadow-2xl"
                        style={{
                            background: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                        }}
                        aria-label="Illustration of a Finora spending overview"
                    >
                        <div className="flex items-center justify-between gap-4 mb-7">
                            <div>
                                <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                                    Your overview
                                </p>
                                <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
                                    A snapshot of your finances
                                </p>
                            </div>
                            <span
                                className="text-xs px-3 py-1.5 rounded-lg"
                                style={{
                                    background: 'var(--color-surface-2)',
                                    color: 'var(--color-muted)',
                                }}
                            >
                                This month
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {[
                                { label: 'Monthly spending', value: 'Stay in control' },
                                { label: 'Budget progress', value: 'Keep on track' },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-2xl p-4"
                                    style={{
                                        background: 'var(--color-surface-2)',
                                        border: '1px solid var(--color-border)',
                                    }}
                                >
                                    <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
                                        {item.label}
                                    </p>
                                    <p
                                        className="text-sm sm:text-base font-semibold mt-2"
                                        style={{ color: 'var(--color-text)' }}
                                    >
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div
                            className="rounded-2xl p-4 sm:p-5"
                            style={{
                                background: 'var(--color-surface-2)',
                                border: '1px solid var(--color-border)',
                            }}
                        >
                            <div className="flex items-center justify-between mb-5">
                                <p className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>
                                    Spending by category
                                </p>
                                <BarChart3 size={16} style={{ color: 'var(--color-accent)' }} />
                            </div>
                            <div className="flex flex-col gap-4">
                                {[
                                    { label: 'Everyday essentials', width: '72%', color: 'var(--color-accent)' },
                                    { label: 'Plans and fun', width: '48%', color: 'var(--color-green)' },
                                    { label: 'Future goals', width: '34%', color: 'var(--color-yellow)' },
                                ].map((item) => (
                                    <div key={item.label} className="flex flex-col gap-2">
                                        <div className="flex justify-between text-xs">
                                            <span style={{ color: 'var(--color-text)' }}>{item.label}</span>
                                            <span style={{ color: 'var(--color-muted)' }}>Budget</span>
                                        </div>
                                        <div
                                            className="h-2 rounded-full overflow-hidden"
                                            style={{ background: 'var(--color-border)' }}
                                        >
                                            <div
                                                className="h-full rounded-full"
                                                style={{ width: item.width, background: item.color }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="features"
                className="px-5 sm:px-8 py-16"
                style={{ background: 'var(--color-surface)' }}
            >
                <div className="max-w-6xl mx-auto">
                    <div className="max-w-2xl mb-9">
                        <h2
                            className="text-2xl sm:text-3xl font-bold tracking-tight"
                            style={{
                                fontFamily: 'var(--font-display)',
                                color: 'var(--color-text)',
                            }}
                        >
                            The essentials, all in one place
                        </h2>
                        <p className="text-sm sm:text-base mt-3" style={{ color: 'var(--color-muted)' }}>
                            Straightforward tools to help you build better money habits.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                        {features.map(({ icon: Icon, title, description }) => (
                            <article
                                key={title}
                                className="rounded-2xl p-5 sm:p-6"
                                style={{
                                    background: 'var(--color-bg)',
                                    border: '1px solid var(--color-border)',
                                }}
                            >
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                                    style={{
                                        background: 'var(--color-accent-soft)',
                                        color: 'var(--color-accent)',
                                    }}
                                >
                                    <Icon size={19} />
                                </div>
                                <h3 className="text-base font-semibold" style={{ color: 'var(--color-text)' }}>
                                    {title}
                                </h3>
                                <p className="text-sm leading-relaxed mt-2" style={{ color: 'var(--color-muted)' }}>
                                    {description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Android App Download Section */}
            <section className="px-5 sm:px-8 py-16 max-w-6xl mx-auto">
                <div
                    className="rounded-3xl px-6 py-10 sm:px-10 sm:py-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8"
                    style={{
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                    }}
                >
                    <div className="flex items-start gap-5">
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                            style={{
                                background: 'var(--color-accent-soft)',
                                color: 'var(--color-accent)',
                            }}
                        >
                            <Smartphone size={26} />
                        </div>
                        <div>
                            <span
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-2"
                                style={{
                                    background: 'var(--color-accent-soft)',
                                    color: 'var(--color-accent)',
                                }}
                            >
                                <span
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ background: 'var(--color-accent)' }}
                                />
                                Now available
                            </span>
                            <h2
                                className="text-xl sm:text-2xl font-bold"
                                style={{
                                    fontFamily: 'var(--font-display)',
                                    color: 'var(--color-text)',
                                }}
                            >
                                Take Finora with you
                            </h2>
                            <p className="text-sm mt-1.5 max-w-md" style={{ color: 'var(--color-muted)' }}>
                                The full Finora experience on your Android device — track expenses,
                                manage budgets, and stay in sync wherever you are.
                            </p>
                            <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3">
                                {['Offline support', 'Syncs with your account', 'Free to install'].map((item) => (
                                    <span
                                        key={item}
                                        className="inline-flex items-center gap-1.5 text-xs"
                                        style={{ color: 'var(--color-muted)' }}
                                    >
                                        <Check size={13} style={{ color: 'var(--color-green)' }} />
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                        <a
                            href={APK_URL}
                            download
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90 whitespace-nowrap"
                            style={{ background: 'var(--color-accent)', color: '#fff' }}
                        >
                            <Download size={16} />
                            Download APK
                        </a>
                        <p className="text-center text-xs" style={{ color: 'var(--color-muted)' }}>
                            Android · v1.1 · Free
                        </p>
                    </div>
                </div>
            </section>

            <section className="px-5 sm:px-8 py-16 max-w-6xl mx-auto">
                <div
                    className="rounded-3xl px-6 py-10 sm:px-10 sm:py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                    style={{
                        background: 'var(--color-accent-soft)',
                        border: '1px solid var(--color-border)',
                    }}
                >
                    <div>
                        <h2
                            className="text-2xl font-bold"
                            style={{
                                fontFamily: 'var(--font-display)',
                                color: 'var(--color-text)',
                            }}
                        >
                            Ready to feel more in control?
                        </h2>
                        <p className="text-sm mt-2" style={{ color: 'var(--color-muted)' }}>
                            Create an account and start organizing your finances.
                        </p>
                    </div>
                    <Link
                        to="/register"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-opacity hover:opacity-90"
                        style={{ background: 'var(--color-accent)', color: '#fff' }}
                    >
                        Get started
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </section>
        </main>

        <footer
            className="px-5 sm:px-8 pt-10 pb-6"
            style={{
                background: 'var(--color-surface)',
                borderTop: '1px solid var(--color-border)',
            }}
        >
            <div className="max-w-6xl mx-auto">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 pb-9">
                    <div className="sm:col-span-2">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2.5"
                            aria-label="Finora home"
                        >
                            <img src="/favicon.svg" alt="" className="w-9 h-9 rounded-xl" />
                            <span
                                className="text-lg font-bold tracking-tight"
                                style={{
                                    fontFamily: 'var(--font-display)',
                                    color: 'var(--color-text)',
                                }}
                            >
                                Finora
                            </span>
                        </Link>
                        <p
                            className="text-sm leading-relaxed mt-3 max-w-sm"
                            style={{ color: 'var(--color-muted)' }}
                        >
                            A clearer, calmer way to keep up with your spending, plan your
                            budget, and make progress toward your goals.
                        </p>
                    </div>

                    <div>
                        <h2
                            className="text-xs font-semibold uppercase tracking-wider mb-3"
                            style={{ color: 'var(--color-text)' }}
                        >
                            Explore
                        </h2>
                        <div className="flex flex-col items-start gap-2.5">
                            <a
                                href="#features"
                                className="text-sm hover:opacity-75 transition-opacity"
                                style={{ color: 'var(--color-muted)' }}
                            >
                                Features
                            </a>
                            <Link
                                to="/register"
                                className="text-sm hover:opacity-75 transition-opacity"
                                style={{ color: 'var(--color-muted)' }}
                            >
                                Get started
                            </Link>
                            <a
                                href={APK_URL}
                                download
                                className="text-sm hover:opacity-75 transition-opacity"
                                style={{ color: 'var(--color-muted)' }}
                            >
                                Android app
                            </a>
                        </div>
                    </div>

                    <div>
                        <h2
                            className="text-xs font-semibold uppercase tracking-wider mb-3"
                            style={{ color: 'var(--color-text)' }}
                        >
                            Your account
                        </h2>
                        <div className="flex flex-col items-start gap-2.5">
                            <Link
                                to="/login"
                                className="text-sm hover:opacity-75 transition-opacity"
                                style={{ color: 'var(--color-muted)' }}
                            >
                                Sign in
                            </Link>
                            <Link
                                to="/register"
                                className="text-sm hover:opacity-75 transition-opacity"
                                style={{ color: 'var(--color-muted)' }}
                            >
                                Create an account
                            </Link>
                        </div>
                    </div>
                </div>

                <div
                    className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-5 text-xs"
                    style={{
                        borderTop: '1px solid var(--color-border)',
                        color: 'var(--color-muted)',
                    }}
                >
                    <span>© {new Date().getFullYear()} Finora. All rights reserved.</span>
                    <span>Personal finance, made clearer.</span>
                </div>
            </div>
        </footer>
    </div>
)

export default Home
