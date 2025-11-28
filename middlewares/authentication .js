
const asyncHandler = require('express-async-handler')
var jwt = require('jsonwebtoken');

const authenticateToken =asyncHandler( (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];  // Bearer <token>

    if (token == null) return res.sendStatus(401);  // No token present

    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) return res.sendStatus(403);  // Invalid token

        req.user = user;
        next();
    });
});

module.exports = authenticateToken