const express = require('express');
const auth = require('../middlewares/auth');
const {
  registerUser,
  loginUser,
  getUser,
  getUsers,
  updateUser,
} = require('../controllers/user');

const router = express.Router();

// Public routes

router.post('/register', registerUser);

router.post('/login', loginUser);

// Protected routes

router.patch('/me', auth, updateUser);

router.get('/me', auth, getUser);

router.get('/', auth, getUsers);

module.exports = router;
