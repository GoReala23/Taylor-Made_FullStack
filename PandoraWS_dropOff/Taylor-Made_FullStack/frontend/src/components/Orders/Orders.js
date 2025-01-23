import { useState, useEffect } from 'react';
import Api from '../../utils/Api';
import './Orders.css';
import Card from '../Card/Card';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        setLoading(false);
        return;
      }

      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      const fetchedOrders = isAdmin
        ? await Api.getAllOrders(token)
        : await Api.getUserOrders(token);

      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  if (loading) {
    return <div className='orders__loading'>Loading...</div>;
  }

  if (!orders.length) {
    return <div className='orders__empty'>No orders found.</div>;
  }

  return (
    <div className='orders'>
      <h1>Your Orders</h1>
      <div className='orders__filter'>
        <label htmlFor='filter'>Filter by status:</label>
        <select
          id='filter'
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value='all'>All</option>
          <option value='pending'>Pending</option>
          <option value='shipped'>Shipped</option>
          <option value='delivered'>Delivered</option>
        </select>
      </div>
      <div className='orders__list'>
        {filteredOrders.map((order) => (
          <div key={order._id} className='orders__item'>
            {order.item && order.item.length > 0 && (
              <div className='orders__products'>
                {order.item.map((item) => (
                  <Card
                    key={item._id}
                    product={item}
                    showQuantity={false}
                    initialQuantity={1}
                    isFeatured={item.isFeatured}
                    isSaved={item.isSaved}
                    savedQuantity={item.savedQuantity}
                    isOrder={true}
                    isAdmin={false}
                  />
                ))}
              </div>
            )}
            <p>Created At: {new Date(order.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
