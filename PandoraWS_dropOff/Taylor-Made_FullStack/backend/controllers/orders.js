const mongoose = require('mongoose');
const User = require('../models/user');
const Order = require('../models/orders');
const Item = require('../models/item');

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

const normalizeItem = (item) => {
  return {
    _id: item._id,
    name: item.name || item.title,
    price: item.price || 0,
    description: item.description || 'No description available',
    imageUrl:
      item.image || item.imageUrl?.startsWith('http')
        ? item.imageUrl
        : `http://localhost:5000${item.imageUrl}`,
    isFeatured: item.isFeatured || false,
  };
};

const createOrder = async (req, res) => {
  try {
    console.log('Create order request:', req.body);
    const { productId, quantity, address } = req.body;
    const userId = req.user.userId;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    console.log(userId);

    if (!productId) {
      return res.status(400).json({
        error: 'Missing itemId. Please include a valid itemId in your request.',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        error:
          'Invalid itemId. Please provide a valid 24-character hexadecimal string.',
      });
    }

    // Check if the item exists using the Item model
    const item = await Item.findById(productId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Calculate the total price
    const total = item.price * quantity;

    // Create the order with proper item reference
    const order = new Order({
      user: userId,
      item: item, // Array of items as per schema
      quantity: quantity,
      total: total,
      address: address,
      status: 'pending',
      imageUrl: item.imageUrl,
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

    const normalizedOrders = orders.map((order) => ({
      ...order.toObject(),
      item: order.item.map((item) => normalizeItem(item)),
    }));

    res.status(200).json(normalizedOrders);
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
const getAllOrders = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const orders = await Order.find().populate(
      'item',
      'name price imageUrl description isFeatured'
    );
    const normalizedOrders = orders.map((order) => ({
      ...order.toObject(),
      item: normalizeItem(order.item),
    }));
    console.log(normalizedOrders);
    res.status(200).json(normalizedOrders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get orders by item
const getOrdersByItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    const orders = await Order.find({ itemId: itemId }).populate(
      'user',
      'name email'
    );
    const normalizedOrders = orders.map((order) => ({
      ...order.toObject(),
      item: normalizeItem(order.item),
    }));

    if (normalizedOrders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this item' });
    }
    res.status(200).json(normalizedOrders);
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
