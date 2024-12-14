const express = require('express');
const {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  getCart,
  saveForLater,
  removeSaved,
  moveToCart,
} = require('../controllers/cart');
const auth = require('../middlewares/auth');
const Product = require('../models/item');
const router = express.Router();

// Ensure all routes are protected
router.use(auth);

router.get('/', getCart);
router.post('/add', addItemToCart);
router.delete('/remove/:productId', removeItemFromCart);
router.patch('/update', updateCartItemQuantity);

router.post('/save-for-later/:productId', auth, saveForLater);

router.delete('/saved/:productId', auth, removeSaved);
router.post('/move-to-cart/:productId', auth, moveToCart);

module.exports = router;
