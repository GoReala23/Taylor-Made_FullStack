const Cart = require('../models/cart');
const Item = require('../models/item');
const User = require('../models/user');

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

const updateCartItemQuantity = async (req, res) => {
  try {
    const { productId, newQuantity } = req.body;

    res.status(200).json({ message: 'Cart quantity updated successfully' });
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    res.status(400).json({ error: 'Failed to update cart quantity' });
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
    // Remove from saved items

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.savedItems) {
      user.savedItems = [];
    }

    user.savedItems = user.savedItems.filter(
      (item) => item.toString() !== productId
    );
    await user.save();

    // Add to cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    cart.items.push({ product: productId, quantity: 1 });
    await cart.save();

    res.status(200).json({ message: 'Item moved to cart' });
  } catch (error) {
    next(error);
  }
};

const removeSaved = async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize savedItems if undefined
    if (!user.savedItems) {
      user.savedItems = [];
    }

    user.savedItems = user.savedItems.filter(
      (item) => item.toString() !== productId
    );
    await user.save();

    res.status(200).json({ message: 'Item removed from saved items' });
  } catch (error) {
    next(error);
  }
};

const saveForLater = async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.user._id;

  try {
    // First find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get cart item quantity before removing
    let cart = await Cart.findOne({ user: userId });
    const cartItem = cart?.items.find(
      (item) => item.product.toString() === productId
    );
    const quantity = cartItem ? cartItem.quantity : 1;

    // Initialize savedItems if needed
    if (!user.savedItems) {
      user.savedItems = [];
    }

    // Add to saved items
    user.savedItems.push({ productId, quantity });
    await user.save();

    // Remove from cart
    if (cart) {
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId
      );
      await cart.save();
    }

    res.status(200).json({ message: 'Item saved for later successfully' });
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
  getCart,
};
