import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaStar } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { CartContext } from '../../context/CartContext';
import BuyModal from '../Modals/BuyModal/BuyModal';
import { useFeaturedProducts } from '../../context/FeaturedProductsContext';
import PreviewOverlay from '../Modals/PreviewOverlay/PreviewOverlay';
import Card, { formatProductData } from '../Card/Card';
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
  const [modalState, setModalState] = useState({
    type: null,
    product: null,
    quantity: 1,
  });
  const previewRef = useRef(null);

  console.log('Passing product to Card:', products);

  const openPreview = (product) => {
    setModalState({
      type: 'preview',
      product: formatProductData(product),
      quantity: 1,
    });
  };

  const openBuyModal = (product, quantity = 1) => {
    console.log('openBuyModal called with:', product, quantity);
    setModalState({
      type: 'buy',
      product: formatProductData(product),
      quantity,
    });
    console.log('Updated modalState:', {
      type: 'buy',
      product: formatProductData(product),
      quantity,
    });
  };

  const closeModal = () => {
    console.log('closeModal called');
    setModalState({
      type: null,
      product: null,
      quantity: 1,
    });
  };

  const handleBuyNow = async (product) => {
    console.log('handleBuyNow called with product:', product);

    // Directly set the modalState to open the BuyModal
    setModalState({
      type: 'buy',
      product: formatProductData(product),
      quantity: 1,
    });

    console.log('BuyModal state updated:', {
      type: 'buy',
      product: formatProductData(product),
      quantity: 1,
    });
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const fetchedProducts = await Api.getItems();
        console.log('Fetched Products:', fetchedProducts);
        const validProducts = fetchedProducts.filter(
          (product) =>
            product && product.name && product.price && product.imageUrl,
        );
        setProducts(validProducts);
      } catch (productError) {
        console.error('Error fetching products:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const fetchedOrders = await Api.getUserOrders(token);
        setOrders(fetchedOrders);
      } catch (orderError) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
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

  const renderOrdersSection = () => {
    if (orders.length === 0) {
      return <p>You have no orders.</p>;
    }

    return (
      <section className='home__section'>
        <div className='home__section-title'>My Orders</div>
        <div className='home__grid'>
          {orders.map((product) => (
            <Card
              key={product._id}
              product={{ ...product, price: product.price }}
              isFeatured={product.isFeatured}
              isAdmin={false}
              onAddToCart={() => handleAddToCart(product)}
              onBuyNow={() => handleBuyNow(product)}
              onFavorite={toggleFavorite}
              onClick={() => openPreview(product)}
              showQuantity={false}
              initialQuantity={1}
            />
          ))}
        </div>
        <button
          className='home__view-more'
          onClick={() => handleViewMore('Orders')}
        >
          View More
        </button>
      </section>
    );
  };

  const renderProductGrid = (items, title, limit = 4) => {
    const mealPlanClassName = 'home__meal-plan-section';
    if (title === 'Meal Plans') {
      return (
        <section className={`home__section ${mealPlanClassName}`}>
          <div className='home__section-title'>{title}</div>
          <div className='home__grid home__grid-placeholder'>
            <div className='home__placeholder-message'>
              <h3>Cooking Up Some Delicious Plans!</h3>
              <p>
                {
                  "We're busy in the kitchen, whipping up some tasty meal plans "
                }
                {'just for you!'}
              </p>
              <p>{'Stay tuned for our culinary creations coming soon!'}</p>
            </div>
          </div>
          <button
            className='home__view-more'
            onClick={() => handleViewMore(title)}
          >
            Get Updates!
          </button>
        </section>
      );
    }

    return (
      <section className='home__section'>
        <div className='home__section-title'>{title}</div>
        <div className='home__grid'>
          {items.slice(0, limit).map((product) => (
            <Card
              key={product._id}
              name={product.name}
              product={product}
              isFeatured={product.isFeatured}
              isAdmin={false}
              onAddToCart={() => handleAddToCart(product)}
              onBuyNow={() =>
                openBuyModal(modalState.product, modalState.quantity)
              }
              onFavorite={toggleFavorite}
              onClick={() => openPreview(product)}
              showQuantity={false}
              initialQuantity={1}
            />
          ))}
        </div>
        <button
          className='home__view-more'
          onClick={() => handleViewMore(title)}
        >
          View More
        </button>
      </section>
    );
  };

  const renderCartSection = () => {
    if (error) {
      return <p>Error: {error}</p>;
    }

    if (!cartItems || cartItems.length === 0) {
      return <p>Your cart is empty.</p>;
    }

    return (
      <section className='home__section'>
        <div className='home__section-title'>My Cart</div>
        <div className='home__grid'>
          {cartItems.map((item) => (
            <Card
              key={item.product?._id}
              product={item.product}
              isFeatured={false}
              isAdmin={false}
              onAddToCart={() => handleAddToCart(item.product)}
              onBuyNow={() => handleBuyNow(item.product)}
              onFavorite={toggleFavorite}
              onClick={() => openPreview(item.product)}
              initialQuantity={item.quantity}
            />
          ))}
        </div>
        <button
          className='home__view-more'
          onClick={() => handleViewMore('My cart')}
        >
          View More
        </button>
      </section>
    );
  };
  return (
    <div className='home__container'>
      <PreviewOverlay
        isOpen={modalState.type === 'preview'}
        onClose={closeModal}
        product={modalState.product}
        quantity={modalState.quantity}
        isFeatured={modalState.product?.isFeatured}
        isLiked={favorites.some((fav) => fav._id === modalState.product?._id)}
        onQuantityChange={(newQuantity) =>
          setModalState((prev) => ({ ...prev, quantity: newQuantity }))
        }
        onAddToCart={() => handleAddToCart(modalState.product)}
        onBuyNow={() => openBuyModal(modalState.product, modalState.quantity)}
        onFavorite={toggleFavorite}
      />
      <BuyModal
        isOpen={modalState.type === 'buy'}
        onClose={closeModal}
        product={modalState.product}
        quantity={modalState.quantity}
        onPurchase={async () => {
          handleBuyNow(modalState.product);
        }}
      />
      {renderProductGrid(featuredProducts, 'Featured Products')}
      {renderProductGrid(products, 'Products')}
      {renderProductGrid(favorites, 'Favorites')}
      {renderCartSection(cartItems, 'Cart')}
      {renderProductGrid(mealPlans, 'Meal Plans')}
      {renderOrdersSection(orders, 'Orders')}
    </div>
  );
};

export default Home;
