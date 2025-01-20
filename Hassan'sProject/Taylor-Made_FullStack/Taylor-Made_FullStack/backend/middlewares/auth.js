const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const UnauthorizedError = require('../errors/UnauthorizedError');

const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header missing');
    }
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Token:', token); // Debug log
    if (!token) {
      throw new UnauthorizedError('No authentication token');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    console.log('Decoded:', decoded);
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      error: 'Invalid token',
      details: 'Authentication failed',
    });
  }
};
module.exports = auth;
