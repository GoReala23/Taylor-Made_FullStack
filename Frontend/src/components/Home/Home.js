import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaStar } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { CartContext } from '../../context/CartContext';
import { useFeaturedProducts } from '../../context/FeaturedProductsContext';
import Card from '../Card/Card';
import Api from '../../utils/Api';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { featuredProducts } = useFeaturedProducts();
  const {
    cartItems,
    addToCart,
    removeFromCart,
    fetchCart,
    saveForLater,
    updateCartItemQuantity,
  } = useContext(CartContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [orders, setOrders] = useState([]);
  const { favorites, addFavorite, removeFavorite, isLoggedIn } = useFavorites();
  const [forceRender, setForceRender] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [previewQuantity, setPreviewQuantity] = useState(1);
  const previewRef = useRef(null);

  const openPreview = (product) => {
    setShowPreview(true);
    setPreviewProduct(product);
    setPreviewQuantity(1);
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewProduct(null);
  };

  const handleQuantityChange = async (newQuantity) => {
    try {
      await updateCartItemQuantity(previewProduct._id, newQuantity);
      setPreviewQuantity(newQuantity);
    } catch (err) {
      console.error('Error updating quantity:', error);
      alert('An error occurred while updating the cart. Please try again.');
    }
  };

  const handleAddToCart = async (product) => {
    if (!product || !product._id) {
      console.error('Invalid product data');
      return;
    }
    try {
      await addToCart({
        productId: product._id,
        quantity: 1,
      });
    } catch (err) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleBuyNow = async (product) => {
    try {
      await addToCart(product);
      navigate('/orders');
    } catch (buyError) {
      console.error('Error processing purchase:', error);
      alert('Failed to process purchase. Please try again.');
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await Api.getItems();
        setProducts(fetchedProducts);
      } catch (cartError) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleViewMore = (section) => {
    switch (section) {
      case 'Featured Products':
        navigate('/products', { state: { filter: 'featured' } });
        break;
      case 'Products':
        navigate('/products');
        break;
      case 'Favorites':
        navigate('/favorites');
        break;
      case 'Meal Plans':
        navigate('/meal-plans');
        break;
      case 'Orders':
        navigate('/orders');
        break;
      case 'Cart':
        navigate('/cart');
        break;
      default:
        navigate('/products');
    }
  };

  const handleSaveForLater = (productId) => {
    try {
      saveForLater(productId);
    } catch (saveError) {
      console.error('Error saving item for later:', error);
    }
  };

  const toggleFavorite = (product) => {
    if (!favorites || !Array.isArray(favorites)) return;
    const isFavorite = favorites.some((fav) => fav._id === product._id);
    if (isFavorite) {
      removeFavorite(product._id);
    } else {
      addFavorite(product);
    }
  };

  const renderProductGrid = (items, title, limit = 4) => (
    <section className='home__section'>
      <div className='home__section-title'>{title}</div>
      <div className='home__grid'>
        {items.slice(0, limit).map((product) => (
          <Card
            key={product._id}
            product={product}
            isAdmin={false}
            onAddToCart={() => handleAddToCart(product)}
            onBuyNow={() => handleBuyNow(product)}
            onFavorite={() => toggleFavorite(product)}
            onClick={() => openPreview(product)}
            showQuantity={true}
            initialQuantity={1}
          />
        ))}
      </div>
    </section>
  );

  const renderCartSection = () => {
    if (isLoading) {
      return <p>Loading cart...</p>;
    }

    if (error) {
      return <p>Error: {error}</p>;
    }

    if (cartItems.length === 0) {
      return <p>Your cart is empty.</p>;
    }

    return (
      <section className='home__cart'>
        <h2>My Cart</h2>
        <ul className='home__cart-list'>
          {cartItems.map((item) => (
            <li key={item.product?._id} className='home__cart-item'>
              {item.product && (
                <>
                  <img
                    src={item.product.imageUrl || '/default-product-image.jpg'}
                    alt={item.product.name || 'Product Name'}
                    className='home__cart-image'
                  />
                  <div className='home__cart-info'>
                    <h3>{item.product.name || 'Product Name'}</h3>
                    <p>Price: {(item.product.price || 0).toFixed(2)}</p>
                    <p>Quantity: {item.quantity || 1}</p>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    );
  };
  return (
    <div className='home__container'>
      {showPreview && (
        <div className='home__preview-overlay' onClick={closePreview}>
          <div
            className='home__preview-container'
            ref={previewRef}
            onClick={(e) => e.stopPropagation()}
          >
            <button className='home__close-preview' onClick={closePreview}>
              &times;
            </button>
            {previewProduct && (
              <>
                <img
                  src={previewProduct.imageUrl}
                  alt={previewProduct.name}
                  className='home__preview-image'
                />
                <h3 className='home__preview-title'>{previewProduct.name}</h3>
                <p className='home__preview-price'>${previewProduct.price}</p>
                <p className='card__price-per-quantity'>
                  Total: $
                  {(previewProduct.price * previewProduct.quantity).toFixed(2)}
                </p>
                <p className='home__preview-description'>
                  {previewProduct.description}
                </p>

                <div className='home__quantity-controls'>
                  <button
                    className='home__minus-btn'
                    onClick={() =>
                      handleQuantityChange(Math.max(1, previewQuantity - 1))
                    }
                  >
                    -
                  </button>
                  <span className='home__current-quantity'>
                    {previewQuantity}
                  </span>
                  <button
                    className='home__plus-btn'
                    onClick={() => handleQuantityChange(previewQuantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div className='home__preview-actions'>
                  <button
                    className='home__add-to-cart'
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(previewProduct);
                      closePreview();
                    }}
                  >
                    Add to Cart
                  </button>
                  <button className='home__buy-now'>Buy Now</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      ,{renderProductGrid(featuredProducts, 'Featured Products')}
      {renderProductGrid(products, 'Products')}
      {renderProductGrid(favorites, 'Favorites')}
      {renderCartSection()}
      {renderProductGrid(mealPlans, 'Meal Plans')}
      {renderProductGrid(orders, 'Orders')}
    </div>
  );
};

export default Home;
