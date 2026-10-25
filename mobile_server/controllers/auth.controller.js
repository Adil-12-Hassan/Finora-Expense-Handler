import User from '../models/User.model.js'
import { generateToken } from '../utils/jwt.js'
import connectDB from '../config/db.js'

// POST /api/auth/register
export const register = async (req, res) => {
    try {
        await connectDB()
        const { name, email, password } = req.body
        if (!name || !email || !password)
            return res.status(400).json({ status: 'Error', message: 'Name, email and password are required.' })

        if (await User.findOne({ email }))
            return res.status(400).json({ status: 'Error', message: 'Email already registered.' })

        const user = await User.create({ name, email, password })
        const token = generateToken(user._id)

        res.status(201).json({
            status: 'Success',
            message: 'Account created successfully.',
            token,                          // ← JWT in body, not cookie
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                currency: user.currency,
                monthlyBudget: user.monthlyBudget,
            },
        })
    } catch (err) {
        res.status(500).json({ status: 'Error', message: err.message })
    }
}

// POST /api/auth/login
export const login = async (req, res) => {
    try {
        await connectDB()
        const { email, password } = req.body
        if (!email || !password)
            return res.status(400).json({ status: 'Error', message: 'Email and password are required.' })

        const user = await User.findOne({ email }).select('+password')
        if (!user || !(await user.comparePassword(password)))
            return res.status(401).json({ status: 'Error', message: 'Invalid email or password.' })

        const token = generateToken(user._id)

        res.status(200).json({
            status: 'Success',
            message: 'Logged in successfully.',
            token,                          // ← JWT in body
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                currency: user.currency,
                monthlyBudget: user.monthlyBudget,
            },
        })
    } catch (err) {
        res.status(500).json({ status: 'Error', message: err.message })
    }
}

// POST /api/auth/logout  (no Redis — client just discards the token)
export const logout = (req, res) => {
    res.status(200).json({ status: 'Success', message: 'Logged out.' })
}

// GET /api/auth/me  (protected)
export const getMe = (req, res) => {
    res.status(200).json({
        status: 'Success',
        user: {
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            currency: req.user.currency,
            monthlyBudget: req.user.monthlyBudget,
        },
    })
}

// PUT /api/auth/me  (protected)
export const updateProfile = async (req, res) => {
    try {
        await connectDB()
        const { name, currency, monthlyBudget } = req.body
        const updates = {}
        if (name) updates.name = name
        if (currency) updates.currency = currency
        if (monthlyBudget !== undefined) updates.monthlyBudget = monthlyBudget

        const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true })
        res.status(200).json({
            status: 'Success',
            message: 'Profile updated.',
            user: { _id: user._id, name: user.name, email: user.email, currency: user.currency, monthlyBudget: user.monthlyBudget },
        })
    } catch (err) {
        res.status(500).json({ status: 'Error', message: err.message })
    }
}

// PUT /api/auth/change-password  (protected)
export const changePassword = async (req, res) => {
    try {
        await connectDB()
        const { currentPassword, newPassword } = req.body
        if (!currentPassword || !newPassword)
            return res.status(400).json({ status: 'Error', message: 'Both passwords are required.' })
        if (newPassword.length < 6)
            return res.status(400).json({ status: 'Error', message: 'New password must be at least 6 characters.' })

        const user = await User.findById(req.user._id).select('+password')
        if (!(await user.comparePassword(currentPassword)))
            return res.status(401).json({ status: 'Error', message: 'Current password is incorrect.' })

        user.password = newPassword
        await user.save()
        res.status(200).json({ status: 'Success', message: 'Password changed successfully.' })
    } catch (err) {
        res.status(500).json({ status: 'Error', message: err.message })
    }
}