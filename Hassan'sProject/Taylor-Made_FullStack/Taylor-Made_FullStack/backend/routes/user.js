const express = require('express');
const auth = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/admin');
const {
  getCurrentUser,
  getAllUsers,
  updateUser,
  updateToAdmin,
  createAdminUser,
} = require('../controllers/user');

const router = express.Router();

// Protected routes
router.get('/me', auth, getCurrentUser);
router.patch('/me', auth, updateUser);

// Admin routes
router.post('/admin', auth, adminMiddleware, createAdminUser);
router.patch('/admin/:id', auth, adminMiddleware, updateToAdmin);
router.get('/', auth, adminMiddleware, getAllUsers);

module.exports = router;
