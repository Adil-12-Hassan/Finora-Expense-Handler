import Budget from '../models/Budget.model.js'
import Expense from '../models/Expense.model.js'
import connectDB from '../config/db.js'

const currentMonth = () => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

// GET /api/budgets?month=YYYY-MM
export const getBudgets = async (req, res) => {
    try {
        await connectDB()
        const month = req.query.month || currentMonth()
        const [year, m] = month.split('-')
        const start = new Date(year, m - 1, 1)
        const end = new Date(year, m, 1)

        const budgets = await Budget.find({ userId: req.user._id, month })

        const spentAgg = await Expense.aggregate([
            { $match: { userId: req.user._id, date: { $gte: start, $lt: end } } },
            { $group: { _id: '$category', spent: { $sum: '$amount' } } },
        ])
        const spentMap = Object.fromEntries(spentAgg.map(({ _id, spent }) => [_id, spent]))

        const result = budgets.map(b => ({
            _id: b._id,
            category: b.category,
            limit: b.limit,
            month: b.month,
            spent: spentMap[b.category] || 0,
            remaining: Math.max(0, b.limit - (spentMap[b.category] || 0)),
        }))

        res.json({ status: 'Success', budgets: result, month })
    } catch (err) {
        res.status(500).json({ status: 'Error', message: err.message })
    }
}

// POST /api/budgets  (upsert)
export const setBudget = async (req, res) => {
    try {
        await connectDB()
        const { category, limit, month } = req.body
        if (!category || !limit)
            return res.status(400).json({ status: 'Error', message: 'Category and limit are required.' })

        const targetMonth = month || currentMonth()
        const budget = await Budget.findOneAndUpdate(
            { userId: req.user._id, category, month: targetMonth },
            { userId: req.user._id, category, limit, month: targetMonth },
            { new: true, upsert: true, runValidators: true }
        )
        res.json({ status: 'Success', message: 'Budget set.', budget })
    } catch (err) {
        res.status(500).json({ status: 'Error', message: err.message })
    }
}

// DELETE /api/budgets/:id
export const deleteBudget = async (req, res) => {
    try {
        await connectDB()
        const budget = await Budget.findOne({ _id: req.params.id, userId: req.user._id })
        if (!budget)
            return res.status(404).json({ status: 'Error', message: 'Budget not found.' })
        await budget.deleteOne()
        res.json({ status: 'Success', message: 'Budget deleted.' })
    } catch (err) {
        res.status(500).json({ status: 'Error', message: err.message })
    }
}