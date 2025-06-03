const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // 5 attempts
    message: { message: 'Too many login attempts, please try again after 15 minutes' }
});

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 30, // 3 attempts
    message: { message: 'Too many registration attempts, please try again after 1 hour' }
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per windowMs
    message: { message: 'Too many requests, please try again later' }
});

module.exports = {
    loginLimiter,
    registerLimiter,
    apiLimiter
}; 