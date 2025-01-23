import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import PreviewOverlay from '../Modals/PreviewOverlay/PreviewOverlay';
import BuyModal from '../Modals/BuyModal/BuyModal';
import Api from '../../utils/Api';
import Card, { formatProductData } from '../Card/Card';
import './Products.css';

const Products = () => {
  const { addToCart } = useContext(CartContext);
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalStates, setModalStates] = useState({
    showPreview: false,
    showBuyModal: false,
    previewProduct: null,
    productToBuy: null,
  });
  const [previewQuantity, setPreviewQuantity] = useState(1);

  const normalizeProductData = (product) => {
    return {
      _id: product._id || product.id, // Support different ID formats
      name: product.name || product.title || 'Unknown Product',
      price: product.price || 0,
      description: product.description || 'No description available',
      imageUrl:
        product.image || product.imageUrl?.startsWith('http')
          ? product.imageUrl
          : `http://localhost:5000${product.imageUrl}`, // Local fallback
      isFeatured: product.isFeatured || false,
      categories: product.categories || [],
      isSaved: product.isSaved || false,
      savedQuantity: product.savedQuantity || 1,
    };
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const localProducts = await Api.getItems();

        const normalizedProducts = localProducts.map(normalizeProductData);

        // Extract unique categories
        const uniqueCategories = [
          'All',
          'Featured',
          ...new Set(
            normalizedProducts.flatMap((product) => product.categories || []),
          ),
        ];

        setCategories(uniqueCategories);
        setProducts(normalizedProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const openPreview = (product) => {
    setModalStates({
      showPreview: true,
      showBuyModal: false,
      previewProduct: product,
      productToBuy: null,
    });
  };

  const openBuyModal = (product) => {
    setModalStates({
      showPreview: false,
      showBuyModal: true,
      previewProduct: null,
      productToBuy: product,
    });
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const handlePurchase = async () => {
    try {
      await addToCart(modalStates.productToBuy, previewQuantity);
      navigate('/orders');
    } catch (error) {
      console.error('Error processing purchase:', error);
      alert('Failed to process purchase. Please try again.');
    } finally {
      setModalStates((prev) => ({ ...prev, showBuyModal: false }));
    }
  };

  const toggleFavorite = (product) => {
    const isFavorite = favorites.some((fav) => fav._id === product._id);
    if (isFavorite) {
      removeFavorite(product._id);
    } else {
      addFavorite(product);
    }
  };

  const renderProductCard = (product) => (
    <Card
      key={product._id}
      product={formatProductData(product)}
      isFeatured={product.isFeatured}
      onAddToCart={() => handleAddToCart(product)}
      onBuyNow={() => openBuyModal(product)}
      onFavorite={() => toggleFavorite(product)}
      onClick={() => openPreview(product)}
    />
  );

  const renderCategory = () => {
    const productsToRender = products.filter((product) => {
      if (selectedCategory === 'All') return true;
      if (selectedCategory === 'Featured') return product.isFeatured;
      return product.categories?.includes(selectedCategory);
    });
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
          isOpen={modalStates.showPreview}
          onClose={() =>
            setModalStates((prev) => ({ ...prev, showPreview: false }))
          }
          product={modalStates.previewProduct}
          onBuyNow={openBuyModal}
          quantity={previewQuantity}
          onQuantityChange={(newQuantity) => setPreviewQuantity(newQuantity)}
          onAddToCart={() => handleAddToCart(modalStates.previewProduct)}
          onFavorite={toggleFavorite}
          isLiked={favorites.some(
            (fav) => fav._id === modalStates.previewProduct?._id,
          )}
        />

        {modalStates.showBuyModal && (
          <BuyModal
            isOpen={modalStates.showBuyModal}
            onClose={() =>
              setModalStates((prev) => ({ ...prev, showBuyModal: false }))
            }
            quantity={previewQuantity}
            product={modalStates.productToBuy}
            onPurchase={handlePurchase}
          />
        )}
      </div>
    </div>
  );
};

export default Products;
