const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    try {
        const { username, password, email, role } = req.body;

        // Validate input
        if (!username || !password || !email) {
            return res.status(400).send({ message: 'Missing required fields' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: 'User already exists' });
        }

        // Create new user
        const newUser = new User({
            username,
            password,
            email,
            role: role || 'user' // Default role to 'user' if not provided
        });

        // Save user to database
        await newUser.save();

        // Respond with success message
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send({ message: 'Error registering user', error });
    }
};