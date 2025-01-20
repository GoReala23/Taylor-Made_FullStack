import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Api from '../../../utils/Api';
import ModalWithForm from '../ModalWithForm/ModalWithForm';
import './OrderModal.css';

const OrderModal = (onClose) => {
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState('');
  const location = useLocation();
  const product = location.state?.product;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await Api.createOrder(
        product._id,
        parseInt(quantity, 10),
        address,
        token,
      );
      onClose();
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className='order__form'>
      <h1>Place Your Order</h1>
      <p>Product: {product?.name}</p>
      <p>Price: ${product?.price}</p>
      <form onSubmit={handleSubmit}>
        <label>
          Quantity:
          <input
            type='number'
            min='1'
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </label>
        <label>
          Address:
          <input
            type='text'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder='123 Main St, City, Country'
          />
        </label>
        <button type='submit'>Submit Order</button>
      </form>
    </div>
  );
};

export default OrderModal;
