const express = require('express');
const {
  createUser,
  login,
  setupTwoFactor,
  verifyTwoFactor,
} = require('../controllers/user');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const PasswordValidator = require('password-validator');
const auth = require('../middlewares/auth');

// Rate limiter configuration
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error:
      'Too many login attempts from this IP. Please try again after 15 minutes',
  },
});

// Password validation schema
const passwordSchema = new PasswordValidator();
passwordSchema
  .is()
  .min(8)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits(2)
  .has()
  .not()
  .spaces();

const validatePassword = (req, res, next) => {
  const { password } = req.body;

  const validationResult = passwordSchema.validate(password);
  if (!validationResult) {
    return res.status(400).json({
      message:
        'Password must contain at least 8 characters, uppercase, lowercase, 2 digits, and no spaces',
    });
  }
  next();
};

// Routes
router.post('/setup-2fa', auth, setupTwoFactor);
router.post('/verify-2fa', auth, verifyTwoFactor);

// Routes with middleware
router.post('/register', validatePassword, createUser);
router.post('/login', loginLimiter, login);

module.exports = router;
