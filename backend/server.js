const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/user');

const app = express();
const port = 3000;

// Replace with your MongoDB connection string
const connectionString = "mongodb+srv://ninvit:6a9p91SE6aO7RN8E@cluster0.bezll.mongodb.net/ninfinances?retryWrites=true&w=majority&appName=Cluster0";


app.use(cors());
app.use(express.json());

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Authentication routes
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = new User({ username, password });
        await user.save();
        res.status(201).send({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error creating user', error });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).send({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).send({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });
        res.send({ message: 'Logged in successfully', token });
    } catch (error) {
        res.status(500).send({ message: 'Error logging in', error });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
const authHeader = req.headers['authorization'];
const token = authHeader && authHeader.split(' ')[1];

if (token == null) {
    return res.sendStatus(401);
}

jwt.verify(token, 'secretKey', (err, user) => {
    if (err) {
        return res.sendStatus(403);
    }

    req.user = user;
    next();
});
};


// API endpoints
app.get('/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find({});
        res.send(transactions);
    } catch (error) {
        res.status(500).send({ message: 'Error getting transactions', error });
    }
});

app.post('/transactions', async (req, res) => {
    try {
        const transaction = new Transaction({ ...req.body });
        await transaction.save();
        res.status(201).send({ message: 'Transaction created successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error creating transaction', error });
    }
});

app.get('/transactions/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findOne({ _id: req.params.id });
        if (!transaction) {
            return res.status(404).send({ message: 'Transaction not found' });
        }
        res.send(transaction);
    } catch (error) {
        res.status(500).send({ message: 'Error getting transaction', error });
    }
});

app.put('/transactions/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
        if (!transaction) {
            return res.status(404).send({ message: 'Transaction not found' });
        }
        res.send({ message: 'Transaction updated successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error updating transaction', error });
    }
});

app.delete('/transactions/:id', async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({ _id: req.params.id });
        if (!transaction) {
            return res.status(404).send({ message: 'Transaction not found' });
        }
        res.send({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting transaction', error });
    }
});

const Transaction = require('./models/transaction');