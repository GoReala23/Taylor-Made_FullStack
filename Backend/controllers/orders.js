const mongoose = require('mongoose');
const User = require('../models/users');
const Order = require('../models/orders');

const createOrder = async (req, res) => {
  try {
    const { quantity, address, items, total } = req.body;

    // Validate item IDs
    const validItems = items.every((id) => mongoose.Types.ObjectId.isValid(id));
    if (!validItems) {
      return res.status(400).json({ message: 'Invalid item ID(s) provided' });
    }

    // Convert item IDs to ObjectIds
    const itemObjectIds = items.map((id) => new mongoose.Types.ObjectId(id));

    // Create new order
    const order = new Order({
      user: req.user.id,
      quantity,
      address,
      items: itemObjectIds,
      total,
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get orders by item
const getOrdersByItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    // Updated query to search within the 'items' array
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

const removeOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.orderId); // Update to use 'orderId'

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createOrder, getUserOrders, getOrdersByItem, removeOrder };
