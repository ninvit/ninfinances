const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});

// Hash the pre-hashed password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    
    try {
        // A senha já vem com hash SHA-256 do cliente, agora vamos adicionar o salt e hash com bcrypt
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (err) {
        console.error('Error hashing password:', err.message);
        return next(err);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        // candidatePassword já vem com hash SHA-256 do cliente
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (err) {
        return false;
    }
};

const User = mongoose.model('User', userSchema);

module.exports = User;