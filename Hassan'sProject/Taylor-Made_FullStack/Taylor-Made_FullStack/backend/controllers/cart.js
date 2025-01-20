const Cart = require('../models/cart');
const Item = require('../models/item');
const User = require('../models/user');
const Product = require('../models/item');

// Add item to cart
const addItemToCart = async (req, res, next) => {
  const { productId, quantity } = req.body;
  const userId = req.user.userId;

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
  const userId = req.user.userId;

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

const updateCartItemQuantity = async (productId, newQuantity) => {
  try {
    const token = localStorage.getItem('token');
    const response = await Api.updateCartQuantity(
      productId,
      newQuantity,
      token
    );
    if (response && response.cart) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.product._id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  } catch (error) {
    console.error('Error updating cart quantity:', error);
  }
};
// Update saved item quantity
const updateSavedItemQuantity = async (savedItemId, newQuantity) => {
  try {
    const token = localStorage.getItem('token');
    const response = await Api.updateSavedItemQuantity(
      savedItemId,
      newQuantity,
      token
    );
    if (response && response.savedItems) {
      setSavedItems(response.savedItems);
    }
  } catch (error) {
    console.error('Error updating saved item quantity:', error);
  }
};
// Get cart contents
const getCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    let cart = await Cart.findOne({ user: userId }).populate('items.product');

    console.log('Existing Cart data:', cart);

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
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
  const userId = req.user.userId;

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
  const userId = req.user.userId;
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
  const userId = req.user.userId;
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
  const userId = req.user.userId;
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
