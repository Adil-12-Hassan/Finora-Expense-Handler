import User from '../models/User.model.js'
import connectDB from '../config/db.js'
import { generateToken, setTokenCookie, clearTokenCookie, TOKEN_EXPIRY_SECONDS } from '../utils/generateToken.js'
import { validateProfileImage } from '../utils/profileImage.js'
import redis from '../config/redis.js'

// Register
// POST /api/auth/register

export const register = async (req, res, next) => {
    try {
        await connectDB()

        const { name, email, password } = req.body

        // 1. Validate fields
        if (!name || !email || !password) {
            return res.status(400).json({
                status: 'Error',
                message: 'Name, email and password are required',
            })
        }

        // 2. Check if email already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                status: 'Error',
                message: 'Email already registered',
            })
        }

        // 3. Create user (password hashed via pre-save hook)
        const user = await User.create({ name, email, password })

        // 4. Generate token — set cookie (web) and return raw token (Flutter/mobile)
        const token = generateToken(user._id)
        setTokenCookie(res, token)

        // 5. Return user + token
        res.status(201).json({
            status: 'Success',
            message: 'Account created successfully',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                currency: user.currency,
                monthlyBudget: user.monthlyBudget,
            },
        })
    } catch (error) {
        next(error)
    }
}

// Login
// POST /api/auth/login

export const login = async (req, res, next) => {
    try {
        await connectDB()
        const { email, password } = req.body;
        // 1. Validate fields
        if (!email || !password) {
            return res.status(400).json({
                status: 'Error',
                message: 'Email and password are required',
            })
        }

        // 2. Find user - explicitly select password (select: false in model)
        const user = await User.findOne({ email }).select('+password')
        if (!user) {
            return res.status(401).json({
                status: 'Error',
                message: 'Invalid email or password',
            })
        }

        // 3. Compare password
        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            return res.status(401).json({
                status: 'Error',
                message: 'Invalid email or password',
            })
        }

        // 4. Generate token — set cookie (web) and return raw token (Flutter/mobile)
        const token = generateToken(user._id)
        setTokenCookie(res, token)

        // 5. Return user + token
        res.status(200).json({
            status: 'Success',
            message: 'Logged in successfully',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                currency: user.currency,
                monthlyBudget: user.monthlyBudget,
            },
        })
    } catch (error) {
        next(error)
    }
}

// Logout
// POST /api/auth/logout
// Works for both cookie (web) and Bearer token (Flutter)
// Blacklists the token in Redis so it cannot be reused

export const logout = async (req, res) => {
    try {
        // Extract token from cookie or Authorization header
        let token = req.cookies?.token
        if (!token) {
            const authHeader = req.headers['authorization']
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.slice(7)
            }
        }

        // Blacklist the token in Redis until it naturally expires
        if (token) {
            await redis.set(
                `blacklist:${token}`,
                '1',
                'EX',
                TOKEN_EXPIRY_SECONDS
            )
        }

        // Clear the cookie for web clients
        clearTokenCookie(res)

        res.status(200).json({
            status: 'Success',
            message: 'Logged out successfully',
        })
    } catch {
        // Even if Redis fails, clear the cookie and respond
        clearTokenCookie(res)
        res.status(200).json({
            status: 'Success',
            message: 'Logged out successfully',
        })
    }
}

// Get Me
// GET /api/auth/me  (protected)

export const getMe = async (req, res, next) => {
    try {
        // req.user already attached by protect middleware
        res.status(200).json({
            status: 'Success',
            user: {
                _id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                currency: req.user.currency,
                monthlyBudget: req.user.monthlyBudget,
                profileImage: req.user.profileImage,
                createdAt: req.user.createdAt,
            },
        })
    } catch (error) {
        next(error)
    }
}

// Update Profile
// PUT /api/auth/me  (protected)

export const updateProfile = async (req, res, next) => {
    try {
        await connectDB()

        const { name, currency, monthlyBudget, profileImage } = req.body

        if (profileImage !== undefined && profileImage !== null && profileImage !== '') {
            const imageError = validateProfileImage(profileImage)
            if (imageError) {
                return res.status(400).json({
                    status: 'Error',
                    message: imageError,
                })
            }
        }

        // Only allow safe fields to be updated
        const updates = {}
        if (name) updates.name = name
        if (currency) updates.currency = currency
        if (monthlyBudget !== undefined) updates.monthlyBudget = monthlyBudget
        if (profileImage !== undefined) updates.profileImage = profileImage || null

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true, runValidators: true }
        )

        res.status(200).json({
            status: 'Success',
            message: 'Profile updated successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                currency: user.currency,
                monthlyBudget: user.monthlyBudget,
                profileImage: user.profileImage,
            },
        })
    } catch (error) {
        next(error)
    }
}

// Change Password
// PUT /api/auth/change-password  (protected)

export const changePassword = async (req, res, next) => {
    try {
        await connectDB()
        const { currentPassword, newPassword } = req.body
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                status: 'Error',
                message: 'Current password and new password are required',
            })
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                status: 'Error',
                message: 'New password must be at least 6 characters',
            })
        }

        // Fetch user with password
        const user = await User.findById(req.user._id).select('+password')

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword)
        if (!isMatch) {
            return res.status(401).json({
                status: 'Error',
                message: 'Current password is incorrect',
            })
        }

        // Save new password - pre-save hook will hash it
        user.password = newPassword
        await user.save()

        res.status(200).json({
            status: 'Success',
            message: 'Password changed successfully',
        })
    } catch (error) {
        next(error)
    }
}