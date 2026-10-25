import { verifyToken } from '../utils/jwt.js'
import User from '../models/User.model.js'
import connectDB from '../config/db.js'

export default async function protect(req, res, next) {
    try {
        // Bearer token only — no cookies
        const authHeader = req.headers['authorization']
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ status: 'Error', message: 'No token provided.' })
        }

        const token = authHeader.slice(7)
        const decoded = verifyToken(token)       // throws if invalid/expired

        await connectDB()
        const user = await User.findById(decoded.userId).select('-password')
        if (!user) {
            return res.status(401).json({ status: 'Error', message: 'User not found.' })
        }

        req.user = user
        next()
    } catch (err) {
        const msg = err.name === 'TokenExpiredError' ? 'Token expired.' : 'Invalid token.'
        res.status(401).json({ status: 'Error', message: msg })
    }
}