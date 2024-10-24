const express = require('express');
const {
  createOrder,
  getUserOrders,
  getOrdersByItem,
  removeOrder,
} = require('../controllers/orders');
const auth = require('../middlewares/auth'); // Protect routes

const router = express.Router();

// Create a new order (protected route)
router.post('/', auth, createOrder);

// Get orders for the logged-in user (protected route)
router.get('/', auth, getUserOrders);

// Get orders by item (protected route)
router.get('/item/:itemId', auth, getOrdersByItem);

// Delete an order (protected route)
router.delete('/:orderId', auth, removeOrder);

module.exports = router;
