import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.routes.js'
import expenseRoutes from './routes/expense.routes.js'
import budgetRoutes from './routes/budget.routes.js'

const app = express()

// Native Android clients send no Origin — allow everything
app.use(cors())
app.use(express.json({ limit: '500kb' }))

// Connect DB on every request (Vercel serverless pattern)
app.use(async (req, res, next) => {
    try { await connectDB(); next() }
    catch (err) { res.status(500).json({ status: 'Error', message: 'Database connection failed.' }) }
})

app.get('/', (_, res) => res.json({ status: 'Success', message: 'Finora Mobile API is running.' }))
app.get('/api/health', (_, res) => res.json({ status: 'Success', message: 'Healthy.' }))

// Add this with your other routes
app.get('/api/version', (req, res) => {
    res.json({
        latestVersion: "1.1", // change this when you release a new APK
        minVersion: "1.0",  // force update if below this
        downloadUrl: "https://raw.githubusercontent.com/Adil-12-Hassan/Finora-Expense-Handler/main/releases/dowload/v1.1/Finora-v1.1.apk",
        releaseNotes: "Bug fixes and performance improvements."
    })
})

app.use('/api/auth', authRoutes)
app.use('/api/expenses', expenseRoutes)
app.use('/api/budgets', budgetRoutes)

app.use((req, res) => res.status(404).json({ status: 'Error', message: `${req.originalUrl} not found.` }))

if (!process.env.VERCEL) {
    await connectDB()
    app.listen(process.env.PORT || 5001, () => console.log('Finora Mobile API on port 5001'))
}

export default app