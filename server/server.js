
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectDB from './config/db.js';
import redis from './config/redis.js';

import errorHandler from './middleware/error.middleware.js';

import authRoutes from './routes/auth.routes.js';
import expenseRoutes from './routes/expense.routes.js';
import budgetRoutes from './routes/budget.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const clientOrigin = process.env.CLIENT_URL
    ?.trim()
    .replace(/\/+$/, '');

app.use(cors({
    origin: clientOrigin,
    credentials: true,
}));

app.use(express.json({ limit: '700kb' }));
app.use(cookieParser());

// Root route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Finora Backend - API is Running.',
        status: 'Success',
    });
});

// Health route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        message: 'Finora API is Healthy.',
        status: 'Success',
    });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler - must come after all routes
app.use((req, res) => {
    res.status(404).json({
        status: 'Error',
        message: `Route ${req.originalUrl} not found`,
    });
});

// Centralized error handler - must come last
app.use(errorHandler);

// Start server
const startServer = async () => {
    if (!process.env.JWT_SECRET) {
        console.error('❌ JWT_SECRET is required. Add it to server/.env before starting the server.');
        process.exit(1);
    }

    try {
        await connectDB();
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1);
    }
    try {
        const response = await redis.ping();
        console.log('✅ Redis connected successfully:', response);
    } catch (error) {
        console.error('❌ Redis connection failed:', error.message);
        process.exit(1);
    }

    app.listen(PORT, () => {
        console.log(`🚀 Finora backend running on port ${PORT}.`);
    });
};

startServer();