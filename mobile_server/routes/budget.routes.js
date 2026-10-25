import express from 'express'
import protect from '../middleware/auth.js'
import { getBudgets, setBudget, deleteBudget } from '../controllers/budget.controller.js'

const router = express.Router()
router.use(protect)
router.get('/', getBudgets)
router.post('/', setBudget)
router.delete('/:id', deleteBudget)
export default router