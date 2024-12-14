import React, { createContext, useState, useEffect } from 'react';
import Api from '../utils/Api';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [savedItems, setSavedItems] = useState(() => {
    const saved = localStorage.getItem('savedItems');
    return saved ? JSON.parse(saved) : [];
  });

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        alert('Please log in to view your cart.');
        return;
      }
      const cart = await Api.getCart(token);
      setCartItems(cart.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      alert('Failed to fetch cart. Please try again later.');
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    localStorage.setItem('savedItems', JSON.stringify(savedItems));
  }, [savedItems]);

  const addToCart = async (product, quantity = 1) => {
    try {
      const token = localStorage.getItem('token');
      const existingItemIndex = cartItems.findIndex(
        (item) => item.product._id === product._id,
      );

      if (existingItemIndex !== -1) {
        // Update existing item quantity
        const updatedItems = [...cartItems];
        updatedItems[existingItemIndex].quantity += quantity;
        setCartItems(updatedItems);

        // Update in backend
        await Api.updateCartQuantity(
          product._id,
          updatedItems[existingItemIndex].quantity,
          token,
        );
      } else {
        // Add new item
        await Api.addToCart({ productId: product._id, quantity }, token);
        await fetchCart(); // Refresh cart contents
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };
  const calculateTotal = (price, quantity) => {
    if (typeof price !== 'number' || typeof quantity !== 'number') {
      console.warn('Invalid price or quantity', { price, quantity });
      return '0.00';
    }
    return (price * quantity).toFixed(2);
  };
  const calculateCartTotal = () => {
    return cartItems
      .reduce((total, item) => {
        const price = item.product?.price || 0;
        const quantity = item.quantity || 1;
        return total + price * quantity;
      }, 0)
      .toFixed(2);
  };

  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await Api.removeFromCart(productId, token);
      setCartItems((prev) =>
        prev.filter((item) => item.product._id !== productId),
      );
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const removeSavedItem = async (product) => {
    try {
      const token = localStorage.getItem('token');
      await Api.removeSaved(product._id, token);
      setSavedItems((prev) => prev.filter((item) => item._id !== product._id));
    } catch (error) {
      console.error('Error removing saved item:', error);
    }
  };

  const saveForLater = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const cartItem = cartItems.find((item) => item.product._id === productId);
      if (!cartItem) return;

      await Api.saveForLater(productId, token, cartItem.quantity);
      await fetchCart();
    } catch (error) {
      console.error('Error saving for later:', error);
    }
  };
  const updateCartItemQuantity = async (productId, newQuantity) => {
    try {
      await Api.updateCartQuantity(productId, newQuantity);
      await fetchCart();
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      throw error;
    }
  };

  const moveToCart = async (product) => {
    try {
      const token = localStorage.getItem('token');
      await Api.moveToCart(product._id, token);
      await fetchCart();
    } catch (error) {
      console.error('Error moving item to cart:', error);
    }
  };
  const buyNow = async (product) => {
    try {
      await addToCart(product);
    } catch (error) {
      console.error('Error processing purchase:', error);
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        savedItems,
        addToCart,
        removeFromCart,
        fetchCart,
        updateCartItemQuantity,
        moveToCart,
        removeSavedItem,
        saveForLater,
        buyNow,
        calculateTotal,
        calculateCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
