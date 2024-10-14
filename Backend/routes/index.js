// routes/index.js
const express = require('express');

const userRoutes = require('./users');
const itemRoutes = require('./items');
const likeRoutes = require('./likes');
const commentRoutes = require('./comments');
const orderRoutes = require('./orders');

const router = express.Router();

// Api routes
router.use('/users', userRoutes);
router.use('/items', itemRoutes);
router.use('/likes', likeRoutes);
router.use('/comments', commentRoutes);
router.use('/orders', orderRoutes);

module.exports = router;
