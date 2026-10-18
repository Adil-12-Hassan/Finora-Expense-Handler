import jwt from 'jsonwebtoken'
import User from '../models/User.model.js'
import connectDB from '../config/db.js'

const protect = async (req, res, next) => {
    try {
        // 1. Get token from cookie
        const token = req.cookies?.token

        if (!token) {
            return res.status(401).json({
                status: 'Error',
                message: 'Not authorized. No token provided.',
            })
        }

        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // 3. Ensure DB is connected
        await connectDB()

        // 4. Get user from DB (exclude password)
        const user = await User.findById(decoded.userId).select('-password')

        if (!user) {
            return res.status(401).json({
                status: 'Error',
                message: 'Not authorized. User no longer exists.',
            })
        }

        // 5. Attach user to request
        req.user = user

        next()
    } catch (error) {
        // Handle specific JWT errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                status: 'Error',
                message: 'Not authorized. Invalid token.',
            })
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: 'Error',
                message: 'Not authorized. Token has expired.',
            })
        }
        next(error)
    }
}

export default protect;