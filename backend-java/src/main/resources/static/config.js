const config = {
    // Use same origin since Spring Boot serves both frontend and backend
    backendUrl: window.location.origin
};

// Make it available globally
window.APP_CONFIG = config; 