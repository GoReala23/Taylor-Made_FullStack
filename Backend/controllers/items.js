const Item = require('../models/items');

// Create a new item
const createItem = async (req, res) => {
  console.log('createItem function hit');

  const { name, price, description, imageUrl, category } = req.body;

  try {
    console.log(req.body); // Logs request body for debugging

    // Validate request body
    if (!name || !price || !description || !imageUrl || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create new item
    const newItem = new Item({
      name,
      price,
      description,
      imageUrl,
      category,
    });
    await newItem.save();

    // Log the new item and its ID to the terminal
    console.log(`Item created: ${newItem}, Item ID: ${newItem._id}`);

    // Return the created item in the response
    res.status(201).json(newItem);
  } catch (err) {
    console.log('Error creating item:', err.message); // Log the error to terminal
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all items
const getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get an item by ID
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update an item by ID
const updateItem = async (req, res) => {
  const { name, price, description, imageUrl, category } = req.body;

  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { name, price, description, imageUrl, category },
      { new: true, runValidators: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete an item by ID
const deleteItem = async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
};
