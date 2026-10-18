import express from 'express'
import {
    getExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpense,
} from '../controllers/expense.controller.js'
import protect from '../middleware/auth.middleware.js'

const router = express.Router()

// All expense routes are protected
router.use(protect)

router.get('/', getExpenses)
router.post('/', addExpense)
router.get('/:id', getExpense)
router.put('/:id', updateExpense)
router.delete('/:id', deleteExpense)

export default router