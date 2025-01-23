const BASE_URL = 'http://localhost:5000';

const checkIfAdmin = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/api/user/check-admin`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.isAdmin;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch data');
  }
  return response.json();
};

const Api = {
  register: async (name, email, password) => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error('Both email and password are required');
      }

      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  getCurrentUser: async (token) => {
    if (!token) {
      throw new Error('No authentication token provided');
    }

    try {
      const response = await fetch(`${BASE_URL}/api/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Failed to get current user:', error);
      throw error;
    }
  },

  updateUser: async (token, userData) => {
    try {
      const response = await fetch(`${BASE_URL}/api/user/me`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  },
  getItems: async (token) => {
    try {
      const response = await fetch(`${BASE_URL}/api/item`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to get items:', error);
      throw error;
    }
  },
  addToCart: async (data, token) => {
    try {
      const response = await fetch(`${BASE_URL}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      alert('Item added to cart');
      return handleResponse(response);
    } catch (error) {
      console.error('Error in addToCart:', error);
      throw error;
    }
  },

  moveToCart: async (productId, token) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/cart/move-to-cart/${productId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error moving item to cart:', error);
      throw error;
    }
  },

  removeSaved: async (productId, token) => {
    try {
      const response = await fetch(`${BASE_URL}/api/cart/saved/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove saved item');
      }
      return response.json();
    } catch (error) {
      console.error('Error removing saved item:', error);
      throw error;
    }
  },

  removeFromCart: async (productId, token) => {
    try {
      const response = await fetch(`${BASE_URL}/api/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    }
  },

  // Like an item
  likeItem: async (itemId, token) => {
    try {
      const response = await fetch(`${BASE_URL}/api/item/${itemId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error liking item:', error);
      throw error;
    }
  },

  // Get User Orders
  getUserOrders: async (token) => {
    try {
      const response = await fetch(`${BASE_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Failed to get user orders:', error);
      throw error;
    }
  },

  getAllOrders: async (token) => {
    try {
      const response = await fetch(`${BASE_URL}/api/orders/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          // Check if the user is an admin
          const isAdmin = await checkIfAdmin(token);
          if (isAdmin) {
            // If the user is an admin, retry the request
            const adminResponse = await fetch(`${BASE_URL}/api/orders/all`, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });

            if (!adminResponse.ok) {
              throw new Error('Failed to get all orders as admin');
            }

            return adminResponse.json();
          }
        }
        throw new Error('Network response was not ok');
      }

      return response.json();
    } catch (error) {
      console.error('Failed to get all orders:', error);
      throw error;
    }
  },

  removeOrder: async (orderId, token) => {
    try {
      const response = await fetch(`${BASE_URL}/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to remove order');
      }
      return response.json();
    } catch (error) {
      console.error('Error removing order:', error);
      throw error;
    }
  },

  cancelOrder: async (orderId, token) => {
    try {
      const response = await fetch(`${BASE_URL}/api/orders/cancel/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }
      return response.json();
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  },
  updateCartQuantity: async (productId, newQuantity, token) => {
    try {
      const response = await fetch(`${BASE_URL}/api/cart/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, newQuantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update cart quantity');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      throw error;
    }
  },

  updateSavedItemQuantity: async (savedItemId, newQuantity, token) => {
    try {
      const response = await fetch(`${BASE_URL}/api/cart/saved/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ savedItemId, newQuantity }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || 'Failed to update saved item quantity',
        );
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating saved item quantity:', error);
      throw error;
    }
  },

  getSavedItems: async (token) => {
    try {
      const response = await fetch(`${BASE_URL}/api/cart/saved`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch saved items');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching saved items:', error);
      throw error;
    }
  },

  getCart: async (token) => {
    try {
      const response = await fetch(`${BASE_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await handleResponse(response);

      return data;
    } catch (error) {
      console.error('Failed to get cart:', error);
      throw error;
    }
  },

  saveForLater: async (productId, token, quantity) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/cart/save-for-later/${productId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity }),
        },
      );
      return handleResponse(response);
    } catch (error) {
      console.error('Error moving item to save for later:', error);
      throw error;
    }
  },

  createOrder: async (productId, quantity, address, token) => {
    try {
      const response = await fetch(`${BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          quantity,
          address,
        }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  },
  updateOrderStatus: async (orderId, status, token) => {
    const response = await fetch(`${BASE_URL}/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update order status');
    }
    return response.json();
  },

  getFeaturedProducts: async () => {
    const response = await fetch(`${BASE_URL}/api/item/featured`);
    return handleResponse(response);
  },

  toggleFeaturedProduct: async (productId) => {
    const response = await fetch(
      `${BASE_URL}/api/items/${productId}/featured`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return handleResponse(response);
  },

  setupTwoFactor: async (token) => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/setup-2fa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Failed to set up 2FA:', error);
      throw error;
    }
  },

  verifyTwoFactor: async (token, twoFactorToken) => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/verify-2fa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token: twoFactorToken }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Failed to verify 2FA:', error);
      throw error;
    }
  },
};

export default Api;
