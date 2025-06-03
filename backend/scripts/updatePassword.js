const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function updateUserPassword() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        const email = 'ninvit@gmail.com';
        const plainPassword = '123123';

        // Encontrar o usuário
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            process.exit(1);
        }

        // Criar o hash SHA-256 da senha (simulando o que o cliente faria)
        const crypto = require('crypto');
        const sha256Hash = crypto.createHash('sha256').update(plainPassword).digest('hex');

        // Atualizar a senha com o novo formato
        user.password = sha256Hash;
        await user.save();

        console.log('Password updated successfully');
        console.log('New password hash:', user.password);

        // Testar o login
        const isPasswordValid = await bcrypt.compare(sha256Hash, user.password);
        console.log('Password validation test:', { isValid: isPasswordValid });

        await mongoose.disconnect();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

updateUserPassword(); 