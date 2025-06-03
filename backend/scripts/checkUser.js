const mongoose = require('mongoose');
const User = require('../models/user');
require('dotenv').config();

async function checkAndCreateUser() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const email = 'ninvit@gmail.com';
        const password = '123123';

        // Primeiro, vamos remover o usuário existente
        await User.deleteOne({ email });
        console.log('Existing user removed');

        // Criar novo usuário com senha em texto puro
        console.log('Creating new user...');
        const user = new User({
            email,
            password, // senha em texto puro!
            username: 'ninvit'
        });
        await user.save();
        console.log('User created successfully');

        // Verificar se o usuário foi criado e testar a senha
        const createdUser = await User.findOne({ email });
        const bcrypt = require('bcrypt');
        const isPasswordValid = await bcrypt.compare(password, createdUser.password);
        
        console.log('Final verification:', {
            userExists: !!createdUser,
            email: createdUser.email,
            storedHash: createdUser.password,
            passwordValid: isPasswordValid
        });

        await mongoose.disconnect();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkAndCreateUser(); 