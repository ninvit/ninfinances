const logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    const ip = req.ip;
    const userAgent = req.get('user-agent');

    console.log(`[${timestamp}] ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`);

    // Log request body for non-GET requests
    if (method !== 'GET') {
        console.log('Request Body:', req.body);
    }

    // Log response
    const originalSend = res.send;
    res.send = function (body) {
        console.log(`[${timestamp}] Response Status: ${res.statusCode}`);
        if (res.statusCode >= 400) {
            console.log('Error Response:', body);
        }
        return originalSend.call(this, body);
    };

    next();
};

module.exports = logger; 