import React, { createContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import Api from '../utils/Api';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [savedItems, setSavedItems] = useState(() => {
    const saved = localStorage.getItem('savedItems');
    return saved ? JSON.parse(saved) : [];
  });

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.log('No authentication token found');
        setCartItems([]);
        return;
      }
      const response = await Api.getCart(token);

      if (response && response.items && Array.isArray(response.items)) {
        setCartItems(response.items.filter((item) => item && item.product));
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]);
    }
  };

  const getSavedItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await Api.getSavedItems(token);
      setSavedItems(response);
    } catch (error) {
      console.error('Error fetching saved items:', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    localStorage.setItem('savedItems', JSON.stringify(savedItems));
  }, [savedItems]);

  const addToCart = async ({ productId, quantity }) => {
    if (!productId) {
      throw new Error('Product ID is required');
    }
    if (!quantity || typeof quantity !== 'number') {
      throw new Error('Valid quantity is required');
    }
    try {
      const token = localStorage.getItem('token');
      await Api.addToCart({ productId, quantity }, token);
      await fetchCart();
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

  const updateCartItemQuantity = async (productId, newQuantity) => {
    try {
      const token = localStorage.getItem('token');
      const response = await Api.updateCartQuantity(
        productId,
        newQuantity,
        token,
      );

      if (response && response.cart) {
        setCartItems(response.cart.items);
      } else {
        console.warn('Unexpected response format from API:', response);
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    }
  };
  const updateSavedItemQuantity = async (savedItemId, newQuantity) => {
    try {
      const token = localStorage.getItem('token');
      const response = await Api.updateSavedItemQuantity(
        savedItemId,
        newQuantity,
        token,
      );

      if (response && response.savedItems) {
        setSavedItems(response.savedItems);
      } else {
        console.warn('Unexpected response format from API:', response);
      }
    } catch (error) {
      console.error('Error updating saved item quantity:', error);
    }
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

  const removeSavedItem = async (productData) => {
    try {
      const productId =
        typeof productData === 'string' ? productData : productData._id;
      if (!productId) {
        console.error('Invalid product data');
        return;
      }
      const token = localStorage.getItem('token');
      await Api.removeSaved(productId, token);
      setSavedItems((prev) =>
        prev.filter((item) => {
          const itemId = item.product ? item.product._id : item._id;
          return itemId !== productId;
        }),
      );
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const saveForLater = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const cartItem = cartItems.find((item) => item.product._id === productId);
      const quantity = cartItem ? cartItem.quantity : 1;

      await Api.saveForLater(productId, token, quantity);

      setCartItems((prev) =>
        prev.filter((item) => item.product._id !== productId),
      );
      const updatedSavedItems = await Api.getSavedItems(token);

      setSavedItems(updatedSavedItems);
    } catch (error) {
      console.error('Error saving for later:', error);
    }
  };
  const moveToCart = async (productId) => {
    try {
      if (!productId) {
        throw new Error('Invalid product data');
      }
      const token = localStorage.getItem('token');
      await Api.moveToCart(productId, token);
      await removeSavedItem(productId);
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
  const handleQuantityChange = async (id, newQuantity, isSavedItem) => {
    try {
      if (isSavedItem) {
        const response = await updateSavedItemQuantity(id, newQuantity);
        if (response && response.savedItems) {
          setSavedItems(response.savedItems);
        }
      } else {
        const response = await updateCartItemQuantity(id, newQuantity);
        if (response && response.cart) {
          setCartItems(response.cart.items);
        }
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
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
        getSavedItems,
        handleQuantityChange,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
