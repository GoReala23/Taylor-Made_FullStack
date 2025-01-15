const mongoose = require('mongoose');
const User = require('../models/user');
const Order = require('../models/orders');
const Product = require('../models/item');

// Admin controllers
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    console.log(
      `Received request to update order ${orderId} to status ${status}`
    );
    const validStatuses = [
      'pending',
      'shipped',
      'delivered',
      'returned',
      'cancelled',
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    console.log(
      `Received request to update order ${orderId} to status ${status}`
    );
    res.status(200).json(order);
  } catch (err) {
    console.error('Server error updating order status:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const removeOrder = async (req, res) => {
  try {
    // Validate order ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.orderId)) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }

    // Check if the user is an admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Only admins can remove orders' });
    }

    // Find and delete the order
    const order = await Order.findByIdAndDelete(req.params.orderId);

    // Check if order exists
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order removed successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// User controllers

const createOrder = async (req, res) => {
  try {
    const { productId, quantity, address } = req.body;

    // Get the userId from the authenticated user
    const userId = req.user.userId;
    console.log(userId.quantity);

    if (!productId) {
      return res.status(400).json({
        error:
          'Missing productId. Please include a valid productId in your request.',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        error:
          'Invalid productId. Please provide a valid 24-character hexadecimal string.',
      });
    }

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Validate quantity
    if (typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    // Calculate the total price
    const total = product.price * quantity;

    // Create the order
    const order = new Order({
      user: userId,
      productId: productId,
      quantity: quantity,
      total: total,
      address: address,
      status: 'pending',
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error('Error creating order:', err.message);
    res
      .status(500)
      .json({ error: 'Internal Server Error', message: err.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the user owns this order
    if (order.user.toString() !== req.user.userId.toString()) {
      return res
        .status(403)
        .json({ message: 'Not authorized to cancel this order' });
    }

    // Check if the order is in a cancellable status
    if (order.status !== 'pending') {
      return res
        .status(400)
        .json({ message: 'Order cannot be canceled at this stage' });
    }

    order.status = 'canceled';
    await order.save();
    res.json({ message: 'Order canceled successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).populate(
      'item',
      'name price imageUrl description isFeatured'
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const orders = await Order.find().populate('item');
    res.status(200).json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get orders by item
const getOrdersByItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    const orders = await Order.find({ items: { $in: [itemId] } }).populate(
      'user',
      'name email'
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this item' });
    }
    res.status(200).json(orders);
  } catch (err) {
    console.error('Error fetching orders by item:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrdersByItem,
  getAllOrders,
  removeOrder,
  cancelOrder,
  updateOrderStatus,
};
