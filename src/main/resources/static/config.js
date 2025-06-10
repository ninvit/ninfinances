const config = {
    // Use relative path for production (same origin), absolute for development
    backendUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:8080'  // Development - Java backend
        : ''  // Production - same origin (relative paths)
};

// Make it available globally
window.APP_CONFIG = config;

// Add debug function to test backend connectivity
window.testBackend = async function() {
    try {
        const response = await fetch(`${config.backendUrl}/api/transactions`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("nin.finances: token")}`
            }
        });
        console.log('Backend Response:', {
            status: response.status,
            ok: response.ok,
            url: response.url
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Transactions:', data);
        } else {
            const error = await response.text();
            console.log('Error:', error);
        }
    } catch (error) {
        console.error('Error testing backend:', error);
    }
}; 