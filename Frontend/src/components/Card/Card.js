import React, { useContext, useState } from 'react';
import { FaHeart, FaStar, FaPlus, FaMinus } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useFavorites } from '../../context/FavoritesContext';
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
  onMoveToCart,
  onRemove,
  isSavedItem = false,
  initialQuantity = 1,
  showQuantity = false,
  isFeatured,
  ...props
}) => {
  const { favorites, toggleFavorite } = useFavorites();
  const [quantity, setQuantity] = useState(initialQuantity);
  const { handleQuantityChange } = useContext(CartContext);

  const isLiked = favorites?.some((fav) => fav._id === product._id);

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

  const handleInputChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (!Number.isNaN(newQuantity)) {
      handleQuantityChange(product._id, newQuantity, isSavedItem);
      setQuantity(newQuantity);
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
        <button
          className='card__favorite-btn'
          onClick={(e) => {
            e.stopPropagation();
            if (onFavorite) {
              onFavorite(product);
            }
          }}
        >
          <FaHeart color={isLiked ? '#8b4513' : 'white'} />
        </button>
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
      {showQuantity && (
        <div className='card__quantity'>
          <button
            onClick={() =>
              handleQuantityChange(product._id, quantity - 1, isSavedItem)
            }
          >
            <FaMinus />
          </button>
          <input
            className='card__quantity-input'
            type='number'
            value={quantity}
            onChange={handleInputChange}
            min='1'
          />
          <button
            onClick={() =>
              handleQuantityChange(product._id, quantity + 1, isSavedItem)
            }
          >
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
  onMoveToCart: PropTypes.func,
  onRemove: PropTypes.func,
  isSavedItem: PropTypes.bool,
  initialQuantity: PropTypes.number,
  showQuantity: PropTypes.bool,
};

export default Card;
