import jwt from 'jsonwebtoken'

const EXPIRY = '7d'

export const generateToken = (userId) =>
    jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: EXPIRY })

export const verifyToken = (token) =>
    jwt.verify(token, process.env.JWT_SECRET)