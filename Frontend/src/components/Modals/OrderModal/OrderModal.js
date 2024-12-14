import React from 'react';
import { useLocation } from 'react-router-dom';
import ModalWithForm from '../ModalWithForm/ModalWithForm';
import './OrderModal.css';

const OrderModal = () => {
  const location = useLocation();
  const product = location.state?.product;

  if (!product) {
    return <p>No product selected for ordering.</p>;
  }

  return (
    <div className='order__form'>
      <h1>Place Your Order</h1>
      <p>Product: {product.name}</p>
      <p>Price: ${product.price}</p>
      <form>
        <label>
          Quantity:
          <input type='number' min='1' defaultValue='1' />
        </label>
        <label>
          Special Instructions:
          <textarea placeholder='Any special instructions' />
        </label>
        <button type='submit'>Submit Order</button>
      </form>
    </div>
  );
};

export default OrderModal;
