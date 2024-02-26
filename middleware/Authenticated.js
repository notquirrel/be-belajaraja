const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
    // Check if user is logged in (e.g., by checking if a valid token is present in the request headers)
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    }

    // Extract token from the Authorization header
    const token = authHeader.split(' ')[1];

    // Verify the token
    jwt.verify(token, 'belajarajadulu', (err, decoded) => {
        if (err) {
            console.error('Token verification error:', err);
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }

        // Attach the decoded payload to the request object for use in subsequent middleware or routes
        req.user = decoded;

        // If the user is authenticated, proceed to the next middleware or route handler
        next();
    });
};

module.exports = isAuthenticated;
