const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { request } = require('../app');
const User = require('../models/user');

const auth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  console.log('Token:', token);

  if (!token) {
    return res.status(401).json({
      error: 'Authorization required',
      details: 'No token provided',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { _id: decoded.userId.toString(), isAdmin: decoded.isAdmin };
    console.log('Verified user ID:', req.user._id);
    next();
  } catch (err) {
    console.log('Token verification error:', err.message);
    return res.status(401).json({
      error: 'Invalid token',
      details:
        process.env.NODE_ENV === 'development'
          ? err.message
          : 'Authentication failed',
    });
  }
};

module.exports = auth;
