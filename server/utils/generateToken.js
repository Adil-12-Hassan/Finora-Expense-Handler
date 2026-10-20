import jwt from 'jsonwebtoken'

// Keep in sync with JWT_EXPIRES_IN env — used for Redis blacklist TTL
export const TOKEN_EXPIRY_SECONDS = 7 * 24 * 60 * 60 // 7 days

export const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    })
}

export const setTokenCookie = (res, token) => {
    const isProduction = process.env.NODE_ENV === 'production'
    res.cookie('token', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'strict',
        path: '/',
        maxAge: TOKEN_EXPIRY_SECONDS * 1000
    })
}

export const clearTokenCookie = (res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        path: '/',
    })
}