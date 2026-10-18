import express from 'express'
import {
    register,
    login,
    logout,
    getMe,
    updateProfile,
    changePassword,
} from '../controllers/auth.controller.js'
import protect from '../middleware/auth.middleware.js'

const router = express.Router()

// Public routes
router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)

// Protected routes
router.get('/me', protect, getMe)
router.put('/me', protect, updateProfile)
router.put('/change-password', protect, changePassword)

export default router