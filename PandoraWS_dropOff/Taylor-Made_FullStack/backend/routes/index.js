const express = require('express');

const userRoutes = require('./user');
const itemRoutes = require('./item');
const likeRoutes = require('./likes');
const commentRoutes = require('./comments');
const orderRoutes = require('./orders');
const cartRoutes = require('./cart');

const router = express.Router();

// Api routes
router.use('/user', userRoutes);
router.use('/item', itemRoutes);
router.use('/likes', likeRoutes);
router.use('/comments', commentRoutes);
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);

module.exports = router;
