import React, { useContext, useState, useMemo } from 'react';
import { FaHeart, FaStar, FaPlus, FaMinus } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useFavorites } from '../../context/FavoritesContext';
import './Card.css';
import { CartContext } from '../../context/CartContext';

export const formatProductData = (productFormatted) => {
  if (!productFormatted || !productFormatted.imageUrl) return null;
  return {
    ...productFormatted,
    imageUrl: productFormatted.imageUrl.startsWith('http')
      ? productFormatted.imageUrl
      : `http://localhost:5000${productFormatted.imageUrl}`,

    price: productFormatted.price || productFormatted.item?.price || 0,
    description: productFormatted.description || 'No description available',
    isSaved: productFormatted.isSaved || false,
    savedQuantity: productFormatted.savedQuantity || 1,
    servings: productFormatted.servings || 1,
    isFeatured: productFormatted.isFeatured || false,
  };
};

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
  cartCardSize,
  ...props
}) => {
  const { favorites } = useFavorites();
  const [quantity, setQuantity] = useState(initialQuantity);
  const {
    handleQuantityChange,
    updateSavedItemQuantity,
    updateCartItemQuantity,
  } = useContext(CartContext);

  const isLiked = favorites?.some((fav) => fav._id === product._id);
  const [localQuantity, setLocalQuantity] = useState(initialQuantity);

  const formattedProduct = useMemo(() => formatProductData(product), [product]);

  if (!formattedProduct) {
    console.warn('Incomplete product data:', product);
    return null;
  }

  const { name, price, description, imageUrl } = formattedProduct;
  console.log('Rendering Card with:', { name, price, description, imageUrl });
  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product, quantity);
  };

  const handleQuantityUpdate = async (newQuantity) => {
    if (newQuantity < 1) {
      console.error('Quantity cannot be less than 1');
      return;
    }
    try {
      setLocalQuantity(newQuantity);
      await handleQuantityChange(product._id, newQuantity, isSavedItem);
    } catch (error) {
      setLocalQuantity(localQuantity);
      console.error('Error updating quantity:', error);
    }
  };

  return (
    <div
      className={`card ${cartCardSize ? 'card__cart-modal' : ''}`}
      onClick={() => props.onClick && props.onClick(formattedProduct)}
    >
      <div className='card__image-container'>
        <img
          onError={(e) => {
            e.target.src = '/Images/products/default.jpg'; // Fallback image
            console.warn('Image failed to load, using fallback');
          }}
          src={imageUrl}
          alt={name}
          className='card__image'
        />
        {isFeatured && <FaStar className='card__featured-star' color='gold' />}
        <button
          className='card__favorite-btn'
          onClick={(e) => {
            e.stopPropagation();
            if (onFavorite) {
              onFavorite(formattedProduct);
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
            <button className='card__buy-now' onClick={() => onBuyNow(product)}>
              Buy Now
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
          <button onClick={() => handleQuantityUpdate(localQuantity - 1)}>
            <FaMinus />
          </button>
          <input
            className='card__quantity-input'
            type='number'
            value={localQuantity}
            onChange={(e) => handleQuantityUpdate(parseInt(e.target.value, 10))}
            min='1'
          />
          <button onClick={() => handleQuantityUpdate(localQuantity + 1)}>
            <FaPlus />
          </button>
          <p className='card__price-per-quantity'>
            Total: ${(price * localQuantity).toFixed(2)}
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
