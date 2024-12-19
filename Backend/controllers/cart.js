const Cart = require('../models/cart');
const Item = require('../models/item');
const User = require('../models/user');
const Product = require('../models/item');

// Add item to cart
const addItemToCart = async (req, res, next) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  try {
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    console.log(`Cart updated successfully for user: ${userId}: ${productId}`);
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};
// Remove item from cart
const removeItemFromCart = async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

// Update item quantity in cart

const updateCartItemQuantity = async (req, res, next) => {
  const { productId, newQuantity } = req.body;
  const userId = req.user._id;

  try {
    // Find the cart for the user
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    // If the item is not found, return an error
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Update the quantity of the item
    cart.items[itemIndex].quantity = newQuantity;
    await cart.save();

    res
      .status(200)
      .json({ message: 'Cart item quantity updated successfully', cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating cart', error: error.message });
  }
};
// Update saved item quantity
const updateSavedItemQuantity = async (req, res) => {
  const { savedItemId, newQuantity } = req.body;
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the saved item by its _id
    const savedItem = user.savedItems.find(
      (item) => item._id.toString() === savedItemId
    );
    if (!savedItem) {
      return res.status(404).json({ error: 'Saved item not found' });
    }

    savedItem.quantity = newQuantity;
    await user.save();

    res.status(200).json({
      message: 'Saved item quantity updated successfully',
      savedItems: user.savedItems,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get cart contents
const getCart = async (req, res, next) => {
  const userId = req.user._id;

  try {
    let cart = await Cart.findOne({ user: userId }).populate('items.product');

    console.log('Existing Cart data:', cart);

    if (!cart) {
      cart = await Cart.create({ user: userId });
      console.log('Created new Cart:', cart);
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error('Error fetching or creating cart:', error);
    next(error);
  }
};
const moveToCart = async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const savedItem = user.savedItems.find(
      (item) => item.product && item.product.toString() === productId
    );
    if (!savedItem) {
      return res.status(404).json({ message: 'Saved item not found' });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    const existingCartItem = cart.items.find(
      (item) => item.product && item.product.toString() === productId
    );
    if (existingCartItem) {
      existingCartItem.quantity += savedItem.quantity;
    } else {
      cart.items.push({
        product: savedItem.product,
        quantity: savedItem.quantity,
      });
    }

    user.savedItems = user.savedItems.filter(
      (item) => item.product && item.product.toString() !== productId
    );
    await Promise.all([cart.save(), user.save()]);

    await cart.populate('items.product');
    res.status(200).json({ message: 'Item moved to cart', cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error moving item to cart', error: error.message });
  }
};
const removeSaved = async (req, res, next) => {
  console.log('Removing saved item:', req.params.productId);
  const { productId } = req.params;
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('Before removal:', user.savedItems);

    user.savedItems = user.savedItems.filter(
      (item) => item.product && item.product.toString() !== productId
    );
    console.log('After removal:', user.savedItems);
    await user.save();
    res.status(200).json({ message: 'Saved item removed successfully' });
  } catch (error) {
    console.error('Error removing saved item:', error);
    next(error);
  }
};
const getSavedItems = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).populate('savedItems.product');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.savedItems);
  } catch (error) {
    next(error);
  }
};
const saveForLater = async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.user._id;
  try {
    const cart = await Cart.findOne({ user: userId });
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cartItem = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (cartItem) {
      user.savedItems.push({
        product: productId,
        quantity: cartItem.quantity,
      });
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId
      );

      await Promise.all([cart.save(), user.save()]);
    }

    // Return the saved items for better visualization
    res
      .status(200)
      .json({ message: 'Item saved for later', savedItems: user.savedItems });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  saveForLater,
  removeSaved,
  moveToCart,
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  updateSavedItemQuantity,
  getCart,
  getSavedItems,
};
