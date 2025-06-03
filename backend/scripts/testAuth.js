const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function testAuth() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const email = 'test@test.com';
        const password = '123123';

        // Remover usuário existente
        await User.deleteOne({ email });
        console.log('Existing user removed');

        // Criar novo usuário
        console.log('Creating new user...');
        const user = new User({
            email,
            password,
            username: 'testuser'
        });

        console.log('User before save:', {
            email: user.email,
            password: user.password,
            passwordLength: user.password.length
        });

        await user.save();

        console.log('User after save:', {
            email: user.email,
            password: user.password,
            passwordLength: user.password.length
        });

        // Testar login imediatamente
        const foundUser = await User.findOne({ email });
        console.log('Found user:', {
            email: foundUser.email,
            password: foundUser.password,
            passwordLength: foundUser.password.length
        });

        const isPasswordValid = await bcrypt.compare(password, foundUser.password);
        console.log('Password validation:', {
            originalPassword: password,
            storedHash: foundUser.password,
            isValid: isPasswordValid
        });

        await mongoose.disconnect();
        console.log('Test completed');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

testAuth(); 