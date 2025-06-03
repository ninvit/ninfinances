const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Use environment variables for sensitive data
const connectionString = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// Debug logs for environment variables
console.log('Environment variables:', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    hasMongoURI: !!connectionString,
    hasJWTSecret: !!JWT_SECRET
});

// Validate required environment variables
if (!connectionString) {
    console.error('MONGODB_URI is not defined in environment variables');
    process.exit(1);
}

if (!JWT_SECRET) {
    console.error('JWT_SECRET is not defined in environment variables');
    process.exit(1);
}

// Import middlewares
const logger = require('./middleware/logger');
const { loginLimiter, registerLimiter, apiLimiter } = require('./middleware/rateLimiter');

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '..')));

app.use(cors());
app.use(express.json());
app.use(logger);

// MongoDB connection with retry logic
const connectWithRetry = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(connectionString);
        console.log('Connected to MongoDB successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        console.log('Retrying connection in 5 seconds...');
        setTimeout(connectWithRetry, 5000);
    }
};

connectWithRetry();

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.userId = decoded.userId;
        req.userEmail = decoded.email;
        next();
    });
};

// Import controllers
const authController = require('./controllers/authController');
const transactionController = require('./controllers/transactionController');

// Public routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'register.html'));
});

// Auth routes with rate limiting
app.post('/register', registerLimiter, authController.register);
app.post('/login', loginLimiter, authController.login);
app.post('/logout', authController.verifyToken, authController.logout);

// Protected routes with rate limiting
app.use('/api', apiLimiter, authController.verifyToken);

// Transaction routes
app.get('/api/transactions', transactionController.getAllTransactions);
app.post('/api/transactions', transactionController.createTransaction);
app.get('/api/transactions/:id', transactionController.getTransaction);
app.put('/api/transactions/:id', transactionController.updateTransaction);
app.delete('/api/transactions/:id', transactionController.deleteTransaction);

const Transaction = require('./models/transaction');
const User = require('./models/user');

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});