const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, password, email, role } = req.body;
        console.log('Register attempt:', { username, email });

        // Validate input
        if (!username || !password || !email) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user with plain password
        const newUser = new User({
            username,
            password,
            email,
            role: role || 'user'
        });

        console.log('Creating new user:', {
            username: newUser.username,
            email: newUser.email
        });

        // Save user to database
        await newUser.save();

        console.log('User created successfully:', {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email
        });

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Respond with success message and token
        res.status(201).json({ 
            message: 'User registered successfully',
            token
        });
    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for email:', email);

        // Validate input
        if (!email || !password) {
            console.log('Missing fields:', { email: !!email, hasPassword: !!password });
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        console.log('User found:', !!user);
        
        if (!user) {
            console.log('User not found in database');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password validation result:', { isValid: isPasswordValid });

        if (!isPasswordValid) {
            console.log('Invalid password for user:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log('Login successful for:', email);

        // Respond with token and user info
        res.status(200).json({ 
            message: 'Login successful', 
            token,
            email: user.email
        });
    } catch (error) {
        console.error('Error logging in:', error.message);
        res.status(500).json({ 
            message: 'Error logging in', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.userId = decoded.userId;
        req.userEmail = decoded.email;
        next();
    });
};

exports.logout = async (req, res) => {
    try {
        // In a real application, you might want to add the token to a blacklist
        // or implement token revocation. For now, we'll just send a success response
        console.log('User logged out successfully');
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error logging out:', error);
        res.status(500).json({ message: 'Error logging out', error: error.message });
    }
}; 