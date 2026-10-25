import Expense from '../models/Expense.model.js'
import connectDB from '../config/db.js'

const monthRange = (month) => {
    const [year, m] = month.split('-')
    return { start: new Date(year, m - 1, 1), end: new Date(year, m, 1) }
}

const currentMonth = () => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

// GET /api/expenses?month=YYYY-MM
export const getExpenses = async (req, res) => {
    try {
        await connectDB()
        const month = req.query.month || currentMonth()
        const { start, end } = monthRange(month)
        const expenses = await Expense.find({ userId: req.user._id, date: { $gte: start, $lt: end } })
            .sort({ date: -1 })
        res.json({ status: 'Success', expenses, month })
    } catch (err) {
        res.status(500).json({ status: 'Error', message: err.message })
    }
}

// POST /api/expenses
export const addExpense = async (req, res) => {
    try {
        await connectDB()
        const { amount, category, date, note } = req.body
        if (!amount || !category)
            return res.status(400).json({ status: 'Error', message: 'Amount and category are required.' })

        const expense = await Expense.create({ userId: req.user._id, amount, category, date: date || new Date(), note: note || '' })
        res.status(201).json({ status: 'Success', message: 'Expense added.', expense })
    } catch (err) {
        res.status(500).json({ status: 'Error', message: err.message })
    }
}

// DELETE /api/expenses/:id
export const deleteExpense = async (req, res) => {
    try {
        await connectDB()
        const expense = await Expense.findOne({ _id: req.params.id, userId: req.user._id })
        if (!expense)
            return res.status(404).json({ status: 'Error', message: 'Expense not found.' })
        await expense.deleteOne()
        res.json({ status: 'Success', message: 'Expense deleted.' })
    } catch (err) {
        res.status(500).json({ status: 'Error', message: err.message })
    }
}