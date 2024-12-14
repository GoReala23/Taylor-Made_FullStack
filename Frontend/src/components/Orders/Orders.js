import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Orders.css';
import Api from '../../utils/Api';
import Card from '../Card/Card';

const Orders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        const response = currentUser?.isAdmin
          ? await Api.getAllOrders(token)
          : await Api.getUserOrders(token);
        setOrders(response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, [currentUser]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await Api.updateOrderStatus(orderId, newStatus, token);
      const updatedOrders = await Api.getUserOrders(token);
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      await Api.cancelOrder(orderId, token);
      const updatedOrders = await Api.getUserOrders(token);
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  const handleRemoveOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      await Api.removeOrder(orderId, token);
      const updatedOrders = await Api.getAllOrders(token);
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Error removing order:', error);
    }
  };

  const renderOrderStatus = (order) => {
    if (currentUser?.isAdmin) {
      return (
        <select
          value={order.status}
          onChange={(e) => handleStatusChange(order._id, e.target.value)}
          className='orders__status-select'
        >
          <option value='pending'>Pending</option>
          <option value='shipped'>Shipped</option>
          <option value='delivered'>Delivered</option>
          <option value='cancelled'>Cancelled</option>
        </select>
      );
    }

    return (
      <div className='orders__status-container'>
        <span className='orders__item-status'>{order.status}</span>
        {order.status === 'pending' && (
          <button
            onClick={() => handleCancelOrder(order._id)}
            className='orders__cancel-btn'
          >
            Cancel Order
          </button>
        )}
      </div>
    );
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true;
    return order.status.toLowerCase() === filter;
  });

  return (
    <div className='orders'>
      <div className='orders__container'>
        <h1 className='orders__title'>Your Orders</h1>
        <div className='orders__content'>
          <div className='orders__filters'>
            <select
              className='orders__filter-select'
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value='all'>All Orders</option>
              <option value='pending'>Pending</option>
              <option value='shipped'>Shipped</option>
              <option value='delivered'>Delivered</option>
            </select>
          </div>
          <div className='orders__list'>
            {loading ? (
              <div>Loading...</div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order._id} className='orders__item'>
                  <div className='orders__item-header'>
                    <h3>Order #{order._id}</h3>
                    {renderOrderStatus(order)}
                    <div className='orders__item-actions'>
                      {!currentUser?.isAdmin && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className='orders__cancel-btn'
                        >
                          Cancel Order
                        </button>
                      )}
                      {currentUser?.isAdmin && (
                        <button
                          onClick={() => handleRemoveOrder(order._id)}
                          className='orders__remove-btn'
                        >
                          Remove Order
                        </button>
                      )}
                    </div>
                  </div>
                  <div className='orders__item-details'>
                    {order.item.map((product) => (
                      <Card
                        key={product._id}
                        product={{
                          _id: product._id,
                          name: product.name,
                          price: product.price || 0,
                          description: product.description,
                          imageUrl: product.imageUrl,
                          isFeatured: product.isFeatured,
                        }}
                        isAdmin={currentUser?.isAdmin}
                      />
                    ))}
                    <p>
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p>Total: ${order.total.toFixed(2)}</p>
                    <p>Address: {order.address}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
