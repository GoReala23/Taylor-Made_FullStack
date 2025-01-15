import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { CartContext } from '../../../context/CartContext';
import './CartModal.css';
import BuyModal from '../BuyModal/BuyModal';
import Card from '../../Card/Card';

const CartModal = ({ isOpen = true, onClose }) => {
  const {
    cartItems,
    savedItems,
    removeFromCart,
    moveToCart,
    removeSavedItem,
    saveForLater,
    calculateCartTotal,
    handleQuantityChange,
    getSavedItems,
    fetchCart,
    addToCart,
  } = useContext(CartContext);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [productToBuy, setProductToBuy] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        await fetchCart();
        await getSavedItems();
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log('Saved items updated:', savedItems);
  }, [cartItems, savedItems]);

  const handleBuyNow = async (product) => {
    setProductToBuy(product);
    setShowBuyModal(true);
  };

  const renderCartItems = () => {
    if (!cartItems || cartItems.length === 0) {
      return null;
    }
    const validItems = cartItems.filter((item) => {
      const { product } = item;
      return product && product.name && product.description && product.imageUrl;
    });
    return validItems.map((item, index) => {
      const { product, quantity } = item;
      return (
        <li key={product._id || index} className='cart__modal-item'>
          {product && (
            <Card
              product={product}
              isFeatured={product.isFeatured}
              quantity={quantity}
              onRemove={() => removeFromCart(product._id)}
              onSaveForLater={() => saveForLater(product._id)}
              onMoveToCart={() => moveToCart(product._id)}
              onBuyNow={() => handleBuyNow(product)}
              showQuantity={true}
              initialQuantity={quantity}
              onQuantityChange={(newQuantity) =>
                handleQuantityChange(product._id, newQuantity, false)
              }
              cartCardSize={true}
            />
          )}
        </li>
      );
    });
  };

  const renderSavedForLaterSection = () => {
    return (
      <section className='cart__modal-section'>
        <h3 className='cart__modal-section-header'>Saved for Later</h3>
        <ul className='cart__modal-items'>
          {savedItems.map((item, index) => {
            const { product } = item;
            if (!product || !product._id) {
              return null;
            }
            return (
              <li key={product._id || index} className='cart__modal-item'>
                {product && (
                  <Card
                    isSavedItem={true}
                    isFeatured={product.isFeatured}
                    product={product}
                    onBuyNow={() => handleBuyNow(product)}
                    onMoveToCart={() => moveToCart(product._id)}
                    onRemove={() => removeSavedItem(product._id)}
                    showQuantity={true}
                    initialQuantity={item.quantity}
                    onQuantityChange={(newQuantity) =>
                      handleQuantityChange(product._id, newQuantity, true)
                    }
                    cartCardSize={true}
                  />
                )}
              </li>
            );
          })}
        </ul>
      </section>
    );
  };

  if (!isOpen) return null;
  const isBothSectionsEmpty = cartItems.length === 0 && savedItems.length === 0;

  return (
    <div className='cart__modal'>
      <div className='cart__modal-content'>
        <button className='cart__modal-close' onClick={onClose}>
          &times;
        </button>
        <h2 className='cart__modal-header'>
          <FaShoppingCart /> Your Cart ({cartItems.length} items)
        </h2>
        {isBothSectionsEmpty ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <section className='cart__modal-section'>
              <h3 className='cart__modal-section-header'>Cart Items</h3>
              <ul className='cart__modal-items'>{renderCartItems()}</ul>
            </section>
            <div className='cart__modal-summary'>
              <p>Total: ${calculateCartTotal()}</p>
            </div>
            {savedItems.length > 0 && renderSavedForLaterSection()}
            <button className='cart__modal-checkout-btn'>
              Proceed to Checkout
            </button>
          </>
        )}
        {showBuyModal && productToBuy && (
          <BuyModal
            isOpen={showBuyModal}
            onClose={() => setShowBuyModal(false)}
            product={productToBuy}
            quantity={productToBuy.quantity || 1}
          />
        )}
      </div>
    </div>
  );
};

export default CartModal;
