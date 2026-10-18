import Expense from '../models/Expense.model.js'
import connectDB from '../config/db.js'
import { getCache, setCache, invalidateUserMonth, getMonthKey, keys, TTL } from '../utils/cache.js'

// ─── Get Expenses ─────────────────────────────────────────
// GET /api/expenses
// Query params: month, category, page, limit, search

export const getExpenses = async (req, res, next) => {
    try {
        await connectDB()

        const userId = req.user._id
        const {
            month,
            category,
            search,
            page = 1,
            limit = 20,
        } = req.query

        const currentMonth = month || getMonthKey(new Date())
        const pageNum = parseInt(page)
        const limitNum = parseInt(limit)

        // ── Try cache (only for default - no filters) ────
        if (!category && !search && pageNum === 1) {
            const cacheKey = keys.transactions(userId, currentMonth, pageNum)
            const cached = await getCache(cacheKey)
            if (cached) {
                return res.status(200).json({
                    status: 'Success',
                    ...cached,
                })
            }
        }

        // ── Build query ──────────────────────────────────
        const [year, monthNum] = currentMonth.split('-')
        const startDate = new Date(year, monthNum - 1, 1)
        const endDate = new Date(year, monthNum, 1)

        const query = {
            userId,
            date: { $gte: startDate, $lt: endDate },
        }

        if (category) query.category = category
        if (search) query.note = { $regex: search, $options: 'i' }

        // ── Fetch from DB ────────────────────────────────
        const total = await Expense.countDocuments(query)
        const expenses = await Expense.find(query)
            .sort({ date: -1, createdAt: -1 })
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)

        const result = {
            expenses,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum),
            },
        }

        // ── Cache default page only ──────────────────────
        if (!category && !search && pageNum === 1) {
            const cacheKey = keys.transactions(userId, currentMonth, pageNum)
            await setCache(cacheKey, result, TTL.TRANSACTIONS)
        }

        res.status(200).json({
            status: 'Success',
            ...result,
        })
    } catch (error) {
        next(error)
    }
}

// ─── Add Expense ──────────────────────────────────────────
// POST /api/expenses

export const addExpense = async (req, res, next) => {
    try {
        await connectDB()

        const { amount, category, date, note } = req.body

        // Validate required fields
        if (!amount || !category) {
            return res.status(400).json({
                status: 'Error',
                message: 'Amount and category are required',
            })
        }

        const expense = await Expense.create({
            userId: req.user._id,
            amount,
            category,
            date: date || new Date(),
            note: note || '',
        })

        // Invalidate cache for that month
        await invalidateUserMonth(req.user._id, getMonthKey(expense.date))

        res.status(201).json({
            status: 'Success',
            message: 'Expense added successfully',
            expense,
        })
    } catch (error) {
        next(error)
    }
}

// ─── Update Expense ───────────────────────────────────────
// PUT /api/expenses/:id

export const updateExpense = async (req, res, next) => {
    try {
        await connectDB()

        const expense = await Expense.findOne({
            _id: req.params.id,
            userId: req.user._id, // ensure ownership
        })

        if (!expense) {
            return res.status(404).json({
                status: 'Error',
                message: 'Expense not found',
            })
        }

        const oldMonth = getMonthKey(expense.date)

        const { amount, category, date, note } = req.body

        // Apply updates
        if (amount !== undefined) expense.amount = amount
        if (category !== undefined) expense.category = category
        if (date !== undefined) expense.date = date
        if (note !== undefined) expense.note = note

        await expense.save()

        const newMonth = getMonthKey(expense.date)

        // Invalidate old month cache
        await invalidateUserMonth(req.user._id, oldMonth)

        // If date changed to different month - invalidate that too
        if (oldMonth !== newMonth) {
            await invalidateUserMonth(req.user._id, newMonth)
        }

        res.status(200).json({
            status: 'Success',
            message: 'Expense updated successfully',
            expense,
        })
    } catch (error) {
        next(error)
    }
}

// ─── Delete Expense ───────────────────────────────────────
// DELETE /api/expenses/:id

export const deleteExpense = async (req, res, next) => {
    try {
        await connectDB()

        const expense = await Expense.findOne({
            _id: req.params.id,
            userId: req.user._id, // ensure ownership
        })

        if (!expense) {
            return res.status(404).json({
                status: 'Error',
                message: 'Expense not found',
            })
        }

        const month = getMonthKey(expense.date)

        await expense.deleteOne()

        // Invalidate cache for that month
        await invalidateUserMonth(req.user._id, month)

        res.status(200).json({
            status: 'Success',
            message: 'Expense deleted successfully',
        })
    } catch (error) {
        next(error)
    }
}

// ─── Get Single Expense ───────────────────────────────────
// GET /api/expenses/:id

export const getExpense = async (req, res, next) => {
    try {
        await connectDB()

        const expense = await Expense.findOne({
            _id: req.params.id,
            userId: req.user._id,
        })

        if (!expense) {
            return res.status(404).json({
                status: 'Error',
                message: 'Expense not found',
            })
        }

        res.status(200).json({
            status: 'Success',
            expense,
        })
    } catch (error) {
        next(error)
    }
}