const config = {
    // Use environment variable if available, otherwise fallback to localhost
    backendUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:3000'
        : 'https://ninfinances.onrender.com'
};

// Make it available globally
window.APP_CONFIG = config; 