import express from 'express'
import protect from '../middleware/auth.js'
import { getExpenses, addExpense, deleteExpense } from '../controllers/expense.controller.js'

const router = express.Router()
router.use(protect)
router.get('/', getExpenses)
router.post('/', addExpense)
router.delete('/:id', deleteExpense)
export default router