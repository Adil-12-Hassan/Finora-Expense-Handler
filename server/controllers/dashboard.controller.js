import Expense from '../models/Expense.model.js'
import connectDB from '../config/db.js'
import {
    getCache,
    setCache,
    getMonthKey,
    keys,
    TTL,
} from '../utils/cache.js'

// Dashboard Summary
// GET /api/dashboard/summary
// Total spent, remaining budget, top 3 categories, recent 5 transactions

export const getDashboardSummary = async (req, res, next) => {
    try {
        await connectDB()

        const userId = req.user._id
        const month = req.query.month || getMonthKey(new Date())

        // Try cache
        const cacheKey = keys.dashboard(userId, month)
        const cached = await getCache(cacheKey)
        if (cached) {
            return res.status(200).json({
                status: 'Success',
                source: 'cache',
                ...cached,
            })
        }

        // Build date range
        const [year, monthNum] = month.split('-')
        const startDate = new Date(year, monthNum - 1, 1)
        const endDate = new Date(year, monthNum, 1)

        const matchStage = {
            $match: {
                userId,
                date: { $gte: startDate, $lt: endDate },
            },
        }

        // Run all aggregations in parallel
        const [totalResult, categoryBreakdown, recentExpenses] = await Promise.all([

            // 1. Total spent this month
            Expense.aggregate([
                matchStage,
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$amount' },
                        count: { $sum: 1 },
                    },
                },
            ]),

            // 2. Spending by category
            Expense.aggregate([
                matchStage,
                {
                    $group: {
                        _id: '$category',
                        spent: { $sum: '$amount' },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { spent: -1 } },
            ]),

            // 3. Recent 5 transactions
            Expense.find({
                userId,
                date: { $gte: startDate, $lt: endDate },
            })
                .sort({ date: -1, createdAt: -1 })
                .limit(5),
        ])

        const totalSpent = totalResult[0]?.total || 0
        const totalCount = totalResult[0]?.count || 0
        const monthlyBudget = req.user.monthlyBudget || 0

        const result = {
            month,
            totalSpent,
            totalCount,
            monthlyBudget,
            remaining: Math.max(0, monthlyBudget - totalSpent),
            percentage: monthlyBudget > 0
                ? Math.min(100, Math.round((totalSpent / monthlyBudget) * 100))
                : 0,
            topCategories: categoryBreakdown.slice(0, 3).map((c) => ({
                category: c._id,
                spent: c.spent,
                count: c.count,
                percentage: totalSpent > 0
                    ? Math.round((c.spent / totalSpent) * 100)
                    : 0,
            })),
            categoryBreakdown: categoryBreakdown.map((c) => ({
                category: c._id,
                spent: c.spent,
                count: c.count,
                percentage: totalSpent > 0
                    ? Math.round((c.spent / totalSpent) * 100)
                    : 0,
            })),
            recentExpenses,
        }

        // Cache result
        await setCache(cacheKey, result, TTL.DASHBOARD)

        res.status(200).json({
            status: 'Success',
            source: 'db',
            ...result,
        })
    } catch (error) {
        next(error)
    }
}

// Reports
// GET /api/dashboard/reports
// Bar chart (daily), Pie chart (category), Line chart (6 months trend)

export const getReports = async (req, res, next) => {
    try {
        await connectDB()

        const userId = req.user._id
        const month = req.query.month || getMonthKey(new Date())

        // Try cache
        const cacheKey = keys.reports(userId, month)
        const cached = await getCache(cacheKey)
        if (cached) {
            return res.status(200).json({
                status: 'Success',
                source: 'cache',
                ...cached,
            })
        }

        // Date ranges
        const [year, monthNum] = month.split('-')
        const startDate = new Date(year, monthNum - 1, 1)
        const endDate = new Date(year, monthNum, 1)

        // For 6-month trend - go back 5 months from selected month
        const trendStartDate = new Date(year, monthNum - 6, 1)

        const matchStage = {
            $match: {
                userId,
                date: { $gte: startDate, $lt: endDate },
            },
        }

        // Run all aggregations in parallel
        const [dailyData, categoryData, trendData] = await Promise.all([

            // 1. Bar chart - daily spending for selected month
            Expense.aggregate([
                matchStage,
                {
                    $group: {
                        _id: { $dayOfMonth: '$date' },
                        total: { $sum: '$amount' },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
            ]),

            // 2. Pie/Donut chart - spending by category
            Expense.aggregate([
                matchStage,
                {
                    $group: {
                        _id: '$category',
                        total: { $sum: '$amount' },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { total: -1 } },
            ]),

            // 3. Line chart - monthly trend (last 6 months)
            Expense.aggregate([
                {
                    $match: {
                        userId,
                        date: { $gte: trendStartDate, $lt: endDate },
                    },
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$date' },
                            month: { $month: '$date' },
                        },
                        total: { $sum: '$amount' },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { '_id.year': 1, '_id.month': 1 } },
            ]),
        ])

        // Format daily data
        // Fill in missing days with 0
        const daysInMonth = new Date(year, monthNum, 0).getDate()
        const dailyMap = {}
        dailyData.forEach(({ _id, total }) => {
            dailyMap[_id] = total
        })
        const dailyChart = Array.from({ length: daysInMonth }, (_, i) => ({
            day: i + 1,
            total: dailyMap[i + 1] || 0,
        }))

        // Format category data
        const totalSpent = categoryData.reduce((sum, c) => sum + c.total, 0)
        const categoryChart = categoryData.map((c) => ({
            category: c._id,
            total: c.total,
            count: c.count,
            percentage: totalSpent > 0
                ? Math.round((c.total / totalSpent) * 100)
                : 0,
        }))

        // Format trend data
        const trendChart = trendData.map((t) => ({
            month: `${t._id.year}-${String(t._id.month).padStart(2, '0')}`,
            total: t.total,
            count: t.count,
        }))

        const result = {
            month,
            charts: {
                daily: dailyChart,      // → Bar chart
                category: categoryChart, // → Pie/Donut chart
                trend: trendChart,       // → Line chart
            },
        }

        // Cache result
        await setCache(cacheKey, result, TTL.REPORTS)

        res.status(200).json({
            status: 'Success',
            source: 'db',
            ...result,
        })
    } catch (error) {
        next(error)
    }
}