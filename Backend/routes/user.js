const express = require('express');
const auth = require('../middlewares/auth');
const {
  getCurrentUser,
  getAllUsers,
  updateUser,
} = require('../controllers/user');

const router = express.Router();

// Protected routes
router.get('/me', auth, getCurrentUser);
router.patch('/me', auth, updateUser);

// Other routes
router.get('/', getAllUsers);

module.exports = router;
