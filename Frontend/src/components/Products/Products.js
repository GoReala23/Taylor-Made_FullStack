import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaStar } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import PreviewOverlay from '../Modals/PreviewOverlay/PreviewOverlay';
import Api from '../../utils/Api';
import BuyModal from '../Modals/BuyModal/BuyModal';
import Card from '../Card/Card';
import useOutsideClick from '../../hooks/useOutsideClick';
import './Products.css';

const Products = () => {
  const navigate = useNavigate();
  const { addToCart, removeFromCart, saveForLater, updateCartItemQuantity } =
    useContext(CartContext);
  const { isLoggedIn } = useContext(AuthContext);
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [productToBuy, setProductToBuy] = useState(null);
  const [previewQuantity, setPreviewQuantity] = useState(1);
  const previewRef = useRef(null);

  // Close preview function
  const closePreview = () => {
    setShowPreview(false);
    setPreviewProduct(null);
  };

  useOutsideClick(previewRef, () => {
    if (showPreview) {
      closePreview();
    }
  });

  useEffect(() => {
    const fetchCartContents = async () => {
      try {
        const fetchedProducts = await Api.getItems();
        const categorySet = new Set(['All']);
        fetchedProducts.forEach((product) => {
          if (product.categories) {
            product.categories.forEach((category) => categorySet.add(category));
          } else if (product.category) {
            categorySet.add(product.category);
          }
        });
        categorySet.add('Featured');
        setCategories([...categorySet]);
        setProducts(fetchedProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchCartContents();
  }, []);

  const openPreview = (product) => {
    console.log('Opening preview for:', product);
    setShowPreview(true);
    setPreviewProduct(product);
    setPreviewQuantity(1);
  };

  const toggleFavorite = (product) => {
    if (!favorites || !Array.isArray(favorites)) return;
    const isFavorite = favorites.some((fav) => fav._id === product._id);
    if (isFavorite && typeof removeFavorite === 'function') {
      removeFavorite(product._id);
    } else if (!isFavorite && typeof addFavorite === 'function') {
      addFavorite(product);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const handleBuyNow = (product) => {
    setProductToBuy(product);
    setShowBuyModal(true);
  };

  const handlePurchase = async () => {
    try {
      await addToCart(productToBuy);
      navigate('/orders');
    } catch (error) {
      console.error('Error processing purchase:', error);
      alert('Failed to process purchase. Please try again.');
    }
  };

  const renderProductCard = (product) => (
    <Card
      key={product._id}
      product={product}
      isFeatured={product.isFeatured}
      isAdmin={false}
      onAddToCart={() => handleAddToCart(product)}
      onBuyNow={() => handleBuyNow(product)}
      onFavorite={() => toggleFavorite(product)}
      onClick={() => openPreview(product)}
      showQuantity={false}
    />
  );

  const renderCategory = () => {
    let productsToRender = [];
    if (selectedCategory === 'All') {
      productsToRender = products;
    } else if (selectedCategory === 'Featured') {
      productsToRender = products.filter((p) => p.isFeatured);
    } else {
      productsToRender = products.filter(
        (p) =>
          p.categories?.includes(selectedCategory) ||
          p.category === selectedCategory,
      );
    }
    return (
      <div className='products__grid'>
        {productsToRender.map(renderProductCard)}
      </div>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='products'>
      <div className='products__container'>
        <div className='products__category-bar'>
          {categories.map((category) => (
            <button
              key={category}
              className={`products__category-button ${
                selectedCategory === category ? 'active' : ''
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        {renderCategory()}
        <PreviewOverlay
          isOpen={showPreview}
          onClose={closePreview}
          product={previewProduct}
          isFeatured={previewProduct?.isFeatured}
          isLiked={favorites?.some((fav) => fav._id === previewProduct?._id)}
          quantity={previewQuantity}
          onQuantityChange={(newQuantity) => setPreviewQuantity(newQuantity)}
          onAddToCart={() => handleAddToCart(previewProduct)}
          onBuyNow={() => handleBuyNow(previewProduct)}
          onFavorite={toggleFavorite}
        />
        {showBuyModal && (
          <BuyModal
            isOpen={showBuyModal}
            onClose={() => setShowBuyModal(false)}
            product={productToBuy}
            onPurchase={handlePurchase}
          />
        )}
      </div>
    </div>
  );
};

export default Products;
