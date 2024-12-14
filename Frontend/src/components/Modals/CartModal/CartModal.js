import React, { useContext } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { CartContext } from '../../../context/CartContext';
import './CartModal.css';
import Card from '../../Card/Card';

const CartModal = ({ isOpen = true, onClose }) => {
  const {
    cartItems,
    savedItems,
    removeFromCart,
    updateCartItemQuantity,
    moveToCart,
    removeSavedItem,
    saveForLater,
    calculateCartTotal,
  } = useContext(CartContext);

  console.log('Initial cartItems:', JSON.stringify(cartItems, null, 2));

  const handleQuantityChange = (productId, newQuantity) => {
    console.log(
      'Quantity change for product ID:',
      productId,
      'New Quantity:',
      newQuantity,
    );
    updateCartItemQuantity(productId, newQuantity);
  };

  console.log('cartItems:', JSON.stringify(cartItems, null, 2));
  console.log('savedItems:', JSON.stringify(savedItems, null, 2));

  const renderCartItems = () => {
    if (cartItems.length === 0) {
      return null;
    }

    const validItems = cartItems.filter((item) => {
      const { product } = item;
      return product && product.name && product.description && product.imageUrl;
    });

    return validItems.map((item, index) => {
      const { product, quantity } = item;

      return (
        <li key={`${product._id}-${index}`} className='cart__modal-item'>
          {product && (
            <Card
              product={item.product}
              quantity={item.quantity}
              onRemove={() => removeFromCart(product._id)}
              onSaveForLater={() => saveForLater(product._id)}
              showQuantity={true}
              initialQuantity={quantity}
              onQuantityChange={(newQuantity) =>
                handleQuantityChange(product._id, newQuantity)
              }
            />
          )}
        </li>
      );
    });
  };

  const uniqueSavedItems = [
    ...new Map(savedItems.map((item) => [item._id, item])).values(),
  ];
  const renderSavedForLaterSection = () => (
    <section className='cart__modal-saved-section'>
      <h3 className='cart__modal-section-header'>Saved for Later</h3>
      {uniqueSavedItems.length > 0 ? (
        <ul className='cart__modal-items'>
          {uniqueSavedItems.map((item, index) => (
            <li key={`${item._id}-${index}`} className='cart__modal-item'>
              <Card
                isSavedItem={true}
                product={{
                  _id: item._id,
                  name: item.name,
                  price: item.price || 0,
                  description: item.description,
                  imageUrl: item.imageUrl,
                  isFeatured: item.isFeatured,
                }}
                onMoveToCart={() => moveToCart(item._id)}
                onRemove={() => removeSavedItem(item._id)}
                showQuantity={true}
                initialQuantity={item.quantity || 1}
                onQuantityChange={(newQuantity) =>
                  updateCartItemQuantity(item._id, newQuantity)
                }
              />
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no saved items.</p>
      )}
    </section>
  );

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
            <ul className='cart__modal-items'>{renderCartItems()}</ul>
            <div className='cart__modal-summary'>
              <p>Total: ${calculateCartTotal()}</p>
            </div>
            <button className='cart__modal-checkout-btn'>
              Proceed to Checkout
            </button>
            {renderSavedForLaterSection()}
          </>
        )}
      </div>
    </div>
  );
};

export default CartModal;
