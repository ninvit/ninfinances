const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Use environment variables for sensitive data
const connectionString = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// Import middlewares
const logger = require('./middleware/logger');
const { loginLimiter, registerLimiter, apiLimiter } = require('./middleware/rateLimiter');

app.use(express.static(__dirname + '/../'));
app.use(cors());
app.use(express.json());
app.use(logger);
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
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

// Routes
app.get('/', authController.verifyToken, (req, res) => {
    res.sendFile(__dirname + '/../index.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/../login.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/../register.html');
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