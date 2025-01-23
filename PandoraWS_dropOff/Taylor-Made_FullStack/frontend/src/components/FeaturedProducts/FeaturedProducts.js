import React, { useContext, useState } from 'react';
import { FaHeart, FaStar } from 'react-icons';
import { useFeaturedProducts } from '../../context/FeaturedProductsContext';
import { useFavorites } from '../../context/FavoritesContext';
import { AuthContext } from '../../context/AuthContext';
import './FeaturedProducts.css';

const FeaturedProducts = () => {
  const { featuredProducts, toggleFeatured } = useFeaturedProducts();
  const { favorites, toggleFavorite } = useFavorites();
  const { isLoggedIn, currentUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);

  const handleToggleFeatured = (productId) => {
    if (isLoggedIn && currentUser.isAdmin && isEditing) {
      toggleFeatured(productId);
    }
  };

  return (
    <div className='featured__products'>
      <h2>Featured Products</h2>
      <div className='featured__products-grid'>
        {featuredProducts.map((product) => (
          <div key={product._id} className='featured__product-card'>
            <div className='featured__product_image-container'>
              <img
                src={product.imageUrl}
                alt={product.name}
                className='featured__product-image'
              />
              <div className='featured__product-overlay'>
                {isLoggedIn && (
                  <button
                    className='featured__product_favorite-btn'
                    onClick={() => toggleFavorite(product)}
                  >
                    <FaHeart
                      color={
                        favorites.some((fav) => fav._id === product._id)
                          ? 'red'
                          : 'white'
                      }
                    />
                  </button>
                )}
                {isLoggedIn && currentUser.isAdmin && isEditing && (
                  <button
                    className='featured__product_star-btn'
                    onClick={() => handleToggleFeatured(product._id)}
                  >
                    <FaStar color={product.isFeatured ? 'gold' : 'white'} />
                  </button>
                )}
              </div>
            </div>
            <h3 className='featured__product-name'>{product.name}</h3>
            <p className='featured__product-price'>
              ${product.price.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
      {isLoggedIn && currentUser.isAdmin && (
        <button
          className='featured__products-edit-btn'
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Exit Edit Mode' : 'Enter Edit Mode'}
        </button>
      )}
    </div>
  );
};

export default FeaturedProducts;
