const express = require('express');
const {
  createOrder,
  getUserOrders,
  getOrdersByItem,
  removeOrder,
  updateOrderStatus,
  getAllOrders,
  cancelOrder,
} = require('../controllers/orders');
const auth = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/admin');

const router = express.Router();

// Admin routes

// Update order status
router.patch('/:orderId/status', auth, adminMiddleware, updateOrderStatus);

// Delete an order
router.delete('/orders/:orderId', auth, adminMiddleware, removeOrder);

// User routes

router.get('/all', auth, adminMiddleware, getAllOrders);
// Create a new order (protected route)
router.post('/', auth, createOrder);

// Get orders for the logged-in user (protected route)
router.get('/', auth, getUserOrders);

// Get orders by item (protected route)
router.get('/item/:itemId', auth, getOrdersByItem);

// Cancel order (protected route)
router.patch('/:orderId/cancel', auth, cancelOrder);

// Delete an order (protected route)
router.delete('/:orderId', auth, removeOrder);

module.exports = router;
