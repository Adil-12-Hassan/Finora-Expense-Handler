import mongoose from 'mongoose'
import { CATEGORIES } from './Expense.model.js'

const budgetSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: CATEGORIES,
        },
        limit: {
            type: Number,
            required: [true, 'Budget limit is required'],
            min: [1, 'Budget limit must be greater than 0'],
        },
        month: {
            type: String,
            required: [true, 'Month is required'],
            match: [/^\d{4}-(0[1-9]|1[0-2])$/, 'Month format must be YYYY-MM'],
            // e.g. "2026-10"
        },
    },
    { timestamps: true }
)

// One budget per category per month per user
budgetSchema.index({ userId: 1, category: 1, month: 1 }, { unique: true })

const Budget = mongoose.model('Budget', budgetSchema)
export default Budget