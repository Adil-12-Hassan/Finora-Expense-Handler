import jwt from 'jsonwebtoken'
import User from '../models/User.model.js'
import connectDB from '../config/db.js'
import redis from '../config/redis.js'

const protect = async (req, res, next) => {
    try {
        // 1. Get token — cookie (web) OR Authorization: Bearer <token> (Flutter/mobile)
        let token = req.cookies?.token

        if (!token) {
            const authHeader = req.headers['authorization']
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.slice(7)
            }
        }

        if (!token) {
            return res.status(401).json({
                status: 'Error',
                message: 'Not authorized. No token provided.',
            })
        }

        // 2. Check Redis blacklist — token was logged out
        const isBlacklisted = await redis.get(`blacklist:${token}`)
        if (isBlacklisted) {
            return res.status(401).json({
                status: 'Error',
                message: 'Not authorized. Token has been revoked.',
            })
        }

        // 3. Verify token signature & expiry
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // 4. Ensure DB is connected
        await connectDB()

        // 5. Get user from DB (exclude password)
        const user = await User.findById(decoded.userId).select('-password')

        if (!user) {
            return res.status(401).json({
                status: 'Error',
                message: 'Not authorized. User no longer exists.',
            })
        }

        // 6. Attach user + raw token to request
        req.user = user
        req.token = token

        next()
    } catch (error) {
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