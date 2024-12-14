import React, { useContext, useState } from 'react';
import { FaHeart, FaStar, FaPlus, FaMinus } from 'react-icons/fa';
import PropTypes from 'prop-types';
import Api from '../../utils/Api';
import './Card.css';
import { CartContext } from '../../context/CartContext';

const Card = ({
  product,
  isAdmin,
  onAddToCart,
  onBuyNow,
  onFavorite,
  onSaveForLater,
  onToggleFeatured,
  onQuantityChange,
  onMoveToCart,
  onRemove,
  isSavedItem = false,
  initialQuantity = 1,
  showQuantity = false,
  isFeatured,
  ...props
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const { calculateTotal, fetchCart, updateCartItemQuantity } =
    useContext(CartContext);

  const {
    name = 'Unnamed Product',
    price = 0,
    description = 'No description',
    imageUrl = '/default-image.jpg',
  } = product;

  if (!name || !imageUrl) {
    console.warn('Incomplete product data:', product);
    return null;
  }

  const actualProduct = product.product || product;

  if (
    !actualProduct ||
    typeof actualProduct.price !== 'number' ||
    !actualProduct.name
  ) {
    console.warn('Invalid product data:', actualProduct);
    return null;
  }

  if (!product || typeof product.price !== 'number' || !product.name) {
    console.warn('Invalid product data:', product);
    return null;
  }

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
    onQuantityChange(product._id, newQuantity);
  };

  const handleInputChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (!Number.isNaN(newQuantity)) {
      handleQuantityChange(newQuantity);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product, quantity);
  };

  return (
    <div
      className='card'
      onClick={() => props.onClick && props.onClick(product)}
    >
      <div className='card__image-container'>
        <img src={imageUrl} alt={name} className='card__image' />
        {isFeatured && <FaStar className='card__featured-star' color='gold' />}
      </div>
      <div className='card__info'>
        <h3 className='card__title'>{name}</h3>
        <p className='card__price'>${price.toFixed(2)}</p>
      </div>
      <div className='card__actions'>
        {isAdmin && (
          <button onClick={onToggleFeatured}>
            <FaStar color={isFeatured ? 'gold' : 'gray'} />
          </button>
        )}
        {isSavedItem && (
          <>
            <button className='card__move-to-cart' onClick={onMoveToCart}>
              Move to Cart
            </button>
            <button
              className='card__remove'
              onClick={() => {
                console.log('Remove button clicked');
                onRemove();
              }}
            >
              Remove
            </button>
          </>
        )}
        {!isSavedItem && onSaveForLater && (
          <>
            <button
              className='card__save-for-later'
              onClick={() => onSaveForLater(product._id)}
            >
              Save for Later
            </button>
            <button className='card__buy-now' onClick={() => onBuyNow(product)}>
              Buy Now
            </button>
            <button
              className='card__remove'
              onClick={(e) => {
                e.stopPropagation();
                onRemove(product._id);
              }}
            >
              Remove
            </button>
          </>
        )}
      </div>
      {showQuantity && onQuantityChange && (
        <div className='card__quantity'>
          <button onClick={() => handleQuantityChange(quantity - 1)}>
            <FaMinus />
          </button>
          <input
            type='number'
            value={quantity}
            onChange={handleInputChange}
            min='1'
          />
          <button onClick={() => handleQuantityChange(quantity + 1)}>
            <FaPlus />
          </button>
          <p className='card__price-per-quantity'>
            Total: ${(price * quantity).toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string,
    imageUrl: PropTypes.string.isRequired,
    isFeatured: PropTypes.bool,
  }).isRequired,
  isAdmin: PropTypes.bool,
  onAddToCart: PropTypes.func,
  onBuyNow: PropTypes.func,
  onFavorite: PropTypes.func,
  onSaveForLater: PropTypes.func,
  onToggleFeatured: PropTypes.func,
  onQuantityChange: PropTypes.func,
  onMoveToCart: PropTypes.func,
  onRemove: PropTypes.func,
  isSavedItem: PropTypes.bool,
  initialQuantity: PropTypes.number,
  showQuantity: PropTypes.bool,
};

export default Card;
