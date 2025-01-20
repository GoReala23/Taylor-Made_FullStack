import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { FaHeart, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../../context/CartContext';
import { formatProductData } from '../../Card/Card';
import './PreviewOverlay.css';

const PreviewOverlay = ({
  isOpen,
  onClose,
  product,
  onQuantityChange,
  quantity,
  isFeatured,
  isLiked,
  onFavorite,
  onBuyNow,
}) => {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  if (!isOpen || !product) return null;

  const formattedProduct = formatProductData(product);

  const handleAddToCart = async () => {
    if (!product || !product._id) {
      console.error('Unable to add to cart: missing product data');
      return;
    }
    try {
      await addToCart({
        productId: product._id,
        quantity,
      });
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const handleBuyNow = () => {
    onBuyNow(formattedProduct);
  };

  return (
    <div className='preview__overlay' onClick={onClose}>
      <div className='preview__container' onClick={(e) => e.stopPropagation()}>
        <button className='preview__close' onClick={onClose}>
          &times;
        </button>
        <div className='preview__image-container'>
          <img
            src={formattedProduct.imageUrl}
            alt={formattedProduct.name}
            className='preview__image'
          />
          <div className='preview__icons'>
            {isFeatured && (
              <FaStar className='preview__star-icon' color='gold' size={24} />
            )}
            <FaHeart
              className={`preview__heart-icon ${isLiked ? 'liked' : 'unliked'}`}
              size={24}
              onClick={(e) => {
                e.stopPropagation();
                if (onFavorite) {
                  onFavorite(formattedProduct);
                }
              }}
            />
          </div>
        </div>
        <h3 className='preview__title'>{formattedProduct.name}</h3>
        <p className='preview__description'>{formattedProduct.description}</p>
        <p className='preview__price'>${formattedProduct.price}</p>
        <div className='preview__quantity-controls'>
          <button onClick={() => onQuantityChange(Math.max(1, quantity - 1))}>
            -
          </button>
          <span>{quantity}</span>
          <button onClick={() => onQuantityChange(quantity + 1)}>+</button>
        </div>
        <p className='card__price-per-quantity'>
          Total: ${(product.price * quantity).toFixed(2)}
        </p>
        <div className='preview__actions'>
          <button onClick={handleAddToCart} className='preview__button'>
            Add to Cart
          </button>
          <button onClick={handleBuyNow} className='preview__button'>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

PreviewOverlay.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.object,
  onQuantityChange: PropTypes.func,
  quantity: PropTypes.number,
  isFeatured: PropTypes.bool,
  isLiked: PropTypes.bool,
  onFavorite: PropTypes.func,
  onBuyNow: PropTypes.func.isRequired,
};

export default PreviewOverlay;
