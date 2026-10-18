import express from 'express'
import {
    getBudgets,
    setBudget,
    deleteBudget,
    getBudgetSummary,
} from '../controllers/budget.controller.js'
import protect from '../middleware/auth.middleware.js'

const router = express.Router()

// All budget routes are protected
router.use(protect)

router.get('/', getBudgets)
router.get('/summary', getBudgetSummary)
router.post('/', setBudget)
router.delete('/:id', deleteBudget)

export default router;