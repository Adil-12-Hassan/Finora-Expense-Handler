import redis from '../config/redis.js'

// Key Builders
// Centralized key format - consistent across all controllers

const keys = {
    dashboard: (userId, month) => `dashboard:${userId}:${month}`,
    reports: (userId, month) => `reports:${userId}:${month}`,
    budgets: (userId, month) => `budgets:${userId}:${month}`,
    transactions: (userId, month, page) => `transactions:${userId}:${month}:${page}`,
}

// TTL Constants (in seconds)
const TTL = {
    DASHBOARD: 60 * 60,       // 1 hour
    REPORTS: 60 * 60 * 2,   // 2 hours
    BUDGETS: 60 * 60,       // 1 hour
    TRANSACTIONS: 60 * 30,       // 30 minutes
}

// Get
// Returns parsed data or null on miss

const getCache = async (key) => {
    try {
        const data = await redis.get(key)
        return data ? JSON.parse(data) : null
    } catch (error) {
        console.error(`Cache GET error [${key}]:`, error.message)
        return null // cache miss - fall through to DB
    }
}

// Set
// Stores data as JSON string with TTL

const setCache = async (key, data, ttl) => {
    try {
        await redis.set(key, JSON.stringify(data), 'EX', ttl)
    } catch (error) {
        console.error(`Cache SET error [${key}]:`, error.message)
        // non-fatal - app still works without cache
    }
}

// Invalidate
// Called on every write (add/edit/delete expense or budget)
// Clears all cached data for that user + month

const invalidateUserMonth = async (userId, month) => {
    try {
        const keysToDelete = [
            keys.dashboard(userId, month),
            keys.reports(userId, month),
            keys.budgets(userId, month),
        ]

        // Also clear all paginated transaction pages for that month
        // We use a scan pattern since page number varies
        let cursor = 0
        do {
            const [nextCursor, matchedKeys] = await redis.scan(
                cursor,
                'MATCH',
                `transactions:${userId}:${month}:*`,
                'COUNT',
                50
            )
            cursor = parseInt(nextCursor)
            if (matchedKeys.length > 0) {
                keysToDelete.push(...matchedKeys)
            }
        } while (cursor !== 0)
        if (keysToDelete.length > 0) {
            await redis.del(...keysToDelete)
        }
    } catch (error) {
        console.error(`Cache INVALIDATE error [${userId}:${month}]:`, error.message)
        // non-fatal
    }
}

// Helper: get YYYY-MM from a date 
const getMonthKey = (date = new Date()) => {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    return `${year}-${month}` // e.g. "2026-10"
}

export { keys, TTL, getCache, setCache, invalidateUserMonth, getMonthKey }