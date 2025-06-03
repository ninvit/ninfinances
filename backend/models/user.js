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

// Hash the password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        console.log('Password not modified, skipping hash');
        return next();
    }
    
    try {
        console.log('Hashing password:', {
            originalLength: this.password.length,
            isModified: this.isModified('password')
        });
        
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        
        console.log('Password hashed:', {
            hashedLength: this.password.length,
            startsWith: this.password.substring(0, 7)
        });
        
        return next();
    } catch (err) {
        console.error('Error hashing password:', err);
        return next(err);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (err) {
        return false;
    }
};

const User = mongoose.model('User', userSchema);

module.exports = User;