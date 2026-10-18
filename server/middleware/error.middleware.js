const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || err.status || 500
    let message = err.message || 'Internal Server Error'

    // Mongoose invalid ObjectId cast
    if (err.name === 'CastError') {
        statusCode = 400
        message = `Invalid ${err.path}: ${err.value}`
    }

    // Mongoose duplicate key (e.g. email already exists)
    if (err.code === 11000) {
        statusCode = 400
        const field = Object.keys(err.keyValue)[0]
        message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400
        message = Object.values(err.errors)
            .map(e => e.message)
            .join(', ')
    }

    // JWT errors (fallback - normally caught in middleware)
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401
        message = 'Invalid token'
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401
        message = 'Token has expired'
    }

    res.status(statusCode).json({
        status: 'Error',
        message,
        // Show stack trace only in development
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    })
}

export default errorHandler