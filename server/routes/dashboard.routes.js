import express from 'express'
import {
    getDashboardSummary,
    getReports,
} from '../controllers/dashboard.controller.js'
import protect from '../middleware/auth.middleware.js'

const router = express.Router()

// All dashboard routes are protected
router.use(protect)

router.get('/summary', getDashboardSummary)
router.get('/reports', getReports)

export default router;