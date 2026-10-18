import Budget from '../models/Budget.model.js'
import Expense from '../models/Expense.model.js'
import connectDB from '../config/db.js'
import {
    getCache,
    setCache,
    invalidateUserMonth,
    getMonthKey,
    keys,
    TTL,
} from '../utils/cache.js'

// Get Budgets
// GET /api/budgets
// Query params: month (defaults to current month)

export const getBudgets = async (req, res, next) => {
    try {
        await connectDB()

        const userId = req.user._id
        const month = req.query.month || getMonthKey(new Date())

        // Try cache
        const cacheKey = keys.budgets(userId, month)
        const cached = await getCache(cacheKey)
        if (cached) {
            return res.status(200).json({
                status: 'Success',
                ...cached,
            })
        }

        // Fetch budgets from DB
        const budgets = await Budget.find({ userId, month })

        // Calculate spent per category for that month
        const [year, monthNum] = month.split('-')
        const startDate = new Date(year, monthNum - 1, 1)
        const endDate = new Date(year, monthNum, 1)

        const spentPerCategory = await Expense.aggregate([
            {
                $match: {
                    userId,
                    date: { $gte: startDate, $lt: endDate },
                },
            },
            {
                $group: {
                    _id: '$category',
                    spent: { $sum: '$amount' },
                },
            },
        ])

        // Map spent amounts to a lookup object
        const spentMap = {}
        spentPerCategory.forEach(({ _id, spent }) => {
            spentMap[_id] = spent
        })

        // Merge budgets with spent amounts
        const result = budgets.map((budget) => ({
            _id: budget._id,
            category: budget.category,
            limit: budget.limit,
            month: budget.month,
            spent: spentMap[budget.category] || 0,
            remaining: Math.max(0, budget.limit - (spentMap[budget.category] || 0)),
            percentage: Math.min(
                100,
                Math.round(((spentMap[budget.category] || 0) / budget.limit) * 100)
            ),
        }))

        const data = { budgets: result, month }

        // Cache result
        await setCache(cacheKey, data, TTL.BUDGETS)

        res.status(200).json({
            status: 'Success',
            ...data,
        })
    } catch (error) {
        next(error)
    }
}

// Set Budget
// POST /api/budgets
// Creates or updates a budget for a category + month

export const setBudget = async (req, res, next) => {
    try {
        await connectDB()

        const { category, limit, month } = req.body

        // Validate fields
        if (!category || !limit) {
            return res.status(400).json({
                status: 'Error',
                message: 'Category and limit are required',
            })
        }

        if (limit <= 0) {
            return res.status(400).json({
                status: 'Error',
                message: 'Limit must be greater than 0',
            })
        }

        const targetMonth = month || getMonthKey(new Date())

        // Upsert - create if not exists, update if exists
        const budget = await Budget.findOneAndUpdate(
            {
                userId: req.user._id,
                category,
                month: targetMonth,
            },
            {
                userId: req.user._id,
                category,
                limit,
                month: targetMonth,
            },
            {
                new: true,
                upsert: true,       // create if not found
                runValidators: true,
            }
        )

        // Invalidate budgets cache for that month
        await invalidateUserMonth(req.user._id, targetMonth)

        res.status(200).json({
            status: 'Success',
            message: 'Budget set successfully',
            budget,
        })
    } catch (error) {
        next(error)
    }
}

// Delete Budget
// DELETE /api/budgets/:id

export const deleteBudget = async (req, res, next) => {
    try {
        await connectDB()

        const budget = await Budget.findOne({
            _id: req.params.id,
            userId: req.user._id, // ensure ownership
        })

        if (!budget) {
            return res.status(404).json({
                status: 'Error',
                message: 'Budget not found',
            })
        }

        const month = budget.month

        await budget.deleteOne()

        // Invalidate cache for that month
        await invalidateUserMonth(req.user._id, month)

        res.status(200).json({
            status: 'Success',
            message: 'Budget deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

// Get Budget Summary
// GET /api/budgets/summary
// Overall monthly budget vs total spent

export const getBudgetSummary = async (req, res, next) => {
    try {
        await connectDB()

        const userId = req.user._id
        const month = req.query.month || getMonthKey(new Date())

        const [year, monthNum] = month.split('-')
        const startDate = new Date(year, monthNum - 1, 1)
        const endDate = new Date(year, monthNum, 1)

        // Total spent this month
        const totalSpentResult = await Expense.aggregate([
            {
                $match: {
                    userId,
                    date: { $gte: startDate, $lt: endDate },
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' },
                },
            },
        ])

        const totalSpent = totalSpentResult[0]?.total || 0

        // Overall monthly budget from user profile
        const monthlyBudget = req.user.monthlyBudget || 0

        res.status(200).json({
            status: 'Success',
            summary: {
                month,
                monthlyBudget,
                totalSpent,
                remaining: Math.max(0, monthlyBudget - totalSpent),
                percentage: monthlyBudget > 0
                    ? Math.min(100, Math.round((totalSpent / monthlyBudget) * 100))
                    : 0,
            },
        })
    } catch (error) {
        next(error)
    }
}