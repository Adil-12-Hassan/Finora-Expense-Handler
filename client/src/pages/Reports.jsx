import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from 'recharts'
import useDashboardStore from '../store/useDashboardStore'
import useAuthStore from '../store/useAuthStore'
import Spinner from '../components/ui/Spinner'
import Badge from '../components/ui/Badge'
import { getMonthKey, getMonthLabel } from '../utils/getMonthKey'
import { formatCurrency } from '../utils/formatCurrency'
import { getCategoryMeta } from '../constants/categories'

// Custom Tooltip
const ChartTooltip = ({ active, payload, label, currency }) => {
    if (!active || !payload?.length) return null
    return (
        <div
            className="px-3 py-2 rounded-xl text-xs"
            style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
            }}
        >
            {label && <p className="mb-1" style={{ color: 'var(--color-muted)' }}>{label}</p>}
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color || 'var(--color-accent)' }}>
                    {formatCurrency(p.value, currency)}
                </p>
            ))}
        </div>
    )
}

// ── Section Wrapper ───────────────────────────────────────
const Section = ({ title, children }) => (
    <div
        className="rounded-2xl p-5 flex flex-col gap-5"
        style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
        }}
    >
        <p className="text-sm font-medium" style={{ color: 'var(--color-muted)' }}>
            {title}
        </p>
        {children}
    </div>
)

const Reports = () => {
    const { reports, fetchReports, reportsLoading } = useDashboardStore()
    const { user } = useAuthStore()
    const currency = user?.currency || 'PKR'
    const [month, setMonth] = useState(getMonthKey())

    useEffect(() => {
        fetchReports({ month })
    }, [fetchReports, month])

    const changeMonth = (dir) => {
        const [y, m] = month.split('-').map(Number)
        const d = new Date(y, m - 1 + dir, 1)
        setMonth(getMonthKey(d))
    }

    const charts = reports?.charts

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">

            {/* Header */}
            <div>
                <h1
                    className="text-2xl font-bold tracking-tight"
                    style={{
                        fontFamily: 'var(--font-display)',
                        color: 'var(--color-text)',
                    }}
                >
                    Reports
                </h1>
                <p className="text-sm mt-0.5" style={{ color: 'var(--color-muted)' }}>
                    Visual breakdown of your spending
                </p>
            </div>

            {/* Month Selector */}
            <div
                className="flex items-center justify-between rounded-2xl px-4 py-3"
                style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                }}
            >
                <button
                    onClick={() => changeMonth(-1)}
                    className="p-1.5 rounded-lg cursor-pointer hover:opacity-70 transition-opacity"
                    style={{ color: 'var(--color-muted)' }}
                >
                    <ChevronLeft size={18} />
                </button>
                <span
                    className="text-sm font-semibold"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
                >
                    {getMonthLabel(month)}
                </span>
                <button
                    onClick={() => changeMonth(1)}
                    className="p-1.5 rounded-lg cursor-pointer hover:opacity-70 transition-opacity"
                    style={{ color: 'var(--color-muted)' }}
                >
                    <ChevronRight size={18} />
                </button>
            </div>

            {reportsLoading ? (
                <div className="flex items-center justify-center py-24">
                    <Spinner size="lg" />
                </div>
            ) : !charts ? (
                <div
                    className="rounded-2xl p-12 flex flex-col items-center gap-3"
                    style={{
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                    }}
                >
                    <BarChart3 size={36} style={{ color: 'var(--color-muted)' }} />
                    <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                        No data for this month
                    </p>
                </div>
            ) : (
                <>
                    {/* ── Bar Chart - Daily Spending ── */}
                    <Section title="Daily Spending">
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={charts.daily} barSize={8}>
                                <XAxis
                                    dataKey="day"
                                    tick={{ fontSize: 11, fill: 'var(--color-muted)' }}
                                    axisLine={false}
                                    tickLine={false}
                                    interval={4}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: 'var(--color-muted)' }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={48}
                                    tickFormatter={(v) =>
                                        v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v
                                    }
                                />
                                <Tooltip
                                    content={<ChartTooltip currency={currency} />}
                                    cursor={{ fill: 'var(--color-surface-2)' }}
                                />
                                <Bar
                                    dataKey="total"
                                    fill="var(--color-accent)"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </Section>

                    {/* ── Pie Chart - Category Breakdown ── */}
                    {charts.category?.length > 0 && (
                        <Section title="Spending by Category">
                            <div className="flex flex-col lg:flex-row items-center gap-6">
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie
                                            data={charts.category}
                                            dataKey="total"
                                            nameKey="category"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={3}
                                        >
                                            {charts.category.map((entry) => {
                                                const meta = getCategoryMeta(entry.category)
                                                return (
                                                    <Cell
                                                        key={entry.category}
                                                        fill={meta.color}
                                                    />
                                                )
                                            })}
                                        </Pie>
                                        <Tooltip
                                            content={<ChartTooltip currency={currency} />}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>

                                {/* Legend */}
                                <div className="flex flex-col gap-3 w-full lg:w-auto lg:min-w-[180px]">
                                    {charts.category.map((c) => (
                                        <div
                                            key={c.category}
                                            className="flex items-center justify-between gap-4"
                                        >
                                            <Badge category={c.category} />
                                            <div className="flex flex-col items-end">
                                                <span
                                                    className="text-sm font-medium"
                                                    style={{
                                                        color: 'var(--color-text)',
                                                        fontVariantNumeric: 'tabular-nums',
                                                    }}
                                                >
                                                    {formatCurrency(c.total, currency)}
                                                </span>
                                                <span
                                                    className="text-xs"
                                                    style={{ color: 'var(--color-muted)' }}
                                                >
                                                    {c.percentage}%
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Section>
                    )}

                    {/* ── Line Chart - 6 Month Trend ── */}
                    {charts.trend?.length > 0 && (
                        <Section title="6-Month Trend">
                            <ResponsiveContainer width="100%" height={220}>
                                <LineChart data={charts.trend}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="var(--color-border)"
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fontSize: 11, fill: 'var(--color-muted)' }}
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(v) => {
                                            const [y, m] = v.split('-')
                                            return new Date(y, m - 1).toLocaleString('default', {
                                                month: 'short',
                                            })
                                        }}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 11, fill: 'var(--color-muted)' }}
                                        axisLine={false}
                                        tickLine={false}
                                        width={48}
                                        tickFormatter={(v) =>
                                            v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v
                                        }
                                    />
                                    <Tooltip
                                        content={<ChartTooltip currency={currency} />}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="total"
                                        stroke="var(--color-accent)"
                                        strokeWidth={2.5}
                                        dot={{
                                            fill: 'var(--color-accent)',
                                            strokeWidth: 0,
                                            r: 4,
                                        }}
                                        activeDot={{
                                            fill: 'var(--color-accent)',
                                            r: 6,
                                            strokeWidth: 0,
                                        }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Section>
                    )}
                </>
            )}
        </div>
    )
}

export default Reports