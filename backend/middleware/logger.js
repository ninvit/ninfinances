const logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    const ip = req.ip;
    const userAgent = req.get('user-agent');

    console.log(`[${timestamp}] ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`);

    // Log request body for non-GET requests, masking sensitive data
    if (method !== 'GET') {
        const sanitizedBody = { ...req.body };
        if (sanitizedBody.password) {
            sanitizedBody.password = '[REDACTED]';
        }
        console.log('Request Body:', sanitizedBody);
    }

    // Log response
    const originalSend = res.send;
    res.send = function (body) {
        console.log(`[${timestamp}] Response Status: ${res.statusCode}`);
        if (res.statusCode >= 400) {
            // Sanitize error response
            const sanitizedBody = typeof body === 'string' ? body : JSON.stringify(body);
            console.log('Error Response:', sanitizedBody);
        }
        return originalSend.call(this, body);
    };

    next();
};

module.exports = logger; 