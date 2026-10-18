import mongoose from 'mongoose'

const CATEGORIES = [
    'Food',
    'Transport',
    'Shopping',
    'Bills',
    'Health',
    'Entertainment',
    'Other',
]

const expenseSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true, // faster queries per user
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            min: [0.01, 'Amount must be greater than 0'],
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: CATEGORIES,
        },
        date: {
            type: Date,
            required: [true, 'Date is required'],
            default: Date.now,
        },
        note: {
            type: String,
            trim: true,
            maxlength: [200, 'Note cannot exceed 200 characters'],
            default: '',
        },
    },
    { timestamps: true }
)

// Compound index - most queries will filter by userId + date
expenseSchema.index({ userId: 1, date: -1 })
expenseSchema.index({ userId: 1, category: 1 })

const Expense = mongoose.model('Expense', expenseSchema)
export { CATEGORIES }
export default Expense