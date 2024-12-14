const Item = require('../models/item');

// Create a new item
const createItem = async (req, res) => {
  console.log('request body:', req.body);
  console.log('createItem function hit');
  const { name, price, description, imageUrl, categories, isFeatured } =
    req.body; // Changed from category to categories
  try {
    console.log(req.body); // Logs request body for debugging
    // Validate request body
    if (!name || !price || !description || !imageUrl || !categories) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const itemCategories = categories || [category];

    // Validate that categories is an array
    // if (!Array.isArray(categories)) {
    //   return res.status(400).json({ message: 'Categories must be an array' });
    // }

    // Create new item
    const newItem = new Item({
      name,
      price,
      description,
      imageUrl,
      categories,
      isFeatured: isFeatured || false,
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

const toggleFeatured = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.isFeatured = !item.isFeatured;
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error toggling featured status', error });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await Item.find({ isFeatured: true });
    res.json(featuredProducts);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching featured products', error });
  }
};

module.exports = {
  // bulkCreateItems,
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  toggleFeatured,
  getFeaturedProducts,
};

// For Emergency Product Adds

// const bulkCreateItems = async (req, res) => {
//   try {
//     const items = req.body;
//     console.log('Received:', JSON.stringify(items, null, 2));

//     if (!Array.isArray(items)) {
//       return res.status(400).json({
//         message: 'Request body must be an array of items',
//       });
//     }

//     // Validate each item
//     const invalidItems = items.filter(
//       (item) =>
//         !item.name ||
//         !item.price ||
//         !item.description ||
//         !item.imageUrl ||
//         !item.category ||
//         !['Sweets', 'Meals', 'Breads', 'Butters', 'Others'].includes(
//           item.category
//         )
//     );

//     if (invalidItems.length > 0) {
//       return res.status(400).json({
//         message: 'Invalid items found',
//         invalidItems,
//       });
//     }

//     const createdItems = await Item.insertMany(items);

//     res.status(201).json({
//       message: `Successfully created ${createdItems.length} items`,
//       items: createdItems,
//     });
//   } catch (error) {
//     console.error('Error in bulkCreateItems:', error);
//     res.status(500).json({
//       message: 'Error creating items',
//       error: error.message,
//     });
//   }
// };
