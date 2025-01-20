import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Orders.css';
import { formatProductData } from '../Card/Card';
import Api from '../../utils/Api';

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

  const filteredOrders = orders
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .filter((order) => {
      if (filter === 'all') return true;
      return order.status.toLowerCase() === filter;
    });

  return (
    <div className='orders'>
      <div className='orders__container'>
        <h1 className='orders__title'>Your Orders</h1>
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
                  <span>Status: {order.status}</span>
                </div>
                <div className='orders__item-details'>
                  {order.item.map((product) => {
                    const formattedProduct = formatProductData(product);
                    return (
                      <div
                        key={formattedProduct._id}
                        className='orders__product-card'
                      >
                        <img
                          src={formattedProduct.imageUrl}
                          alt={formattedProduct.name}
                        />
                        <div>
                          <p>{formattedProduct.name}</p>
                          <p>${formattedProduct.price.toFixed(2)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className='orders__item-footer'>
                  <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p>Total: ${order.total.toFixed(2)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
