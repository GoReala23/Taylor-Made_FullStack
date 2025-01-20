import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFeaturedProducts } from '../../context/FeaturedProductsContext';
import Api from '../../utils/Api';

const FeaturedProductsManager = () => {
  const { currentUser } = useAuth();
  const [allProducts, setAllProducts] = useState([]);
  const { setFeaturedProducts } = useFeaturedProducts();

  // Check for admin access
  if (!currentUser?.isAdmin) {
    return <Navigate to='/' />;
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await Api.getItems();
        setAllProducts(products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchProducts();
  }, []);

  const toggleFeatured = async (productId) => {
    try {
      await Api.toggleFeaturedProduct(productId);
      // Update local state
      setAllProducts(
        allProducts.map((product) =>
          product.id === productId
            ? { ...product, isFeatured: !product.isFeatured }
            : product,
        ),
      );
      // Refresh featured products list
      const featured = await Api.getFeaturedProducts();
      setFeaturedProducts(featured);
    } catch (error) {
      console.error('Failed to update featured status:', error);
    }
  };

  return (
    <div className='admin__featured-manager'>
      <h2>Manage Featured Products</h2>
      <div className='admin__products-grid'>
        {allProducts.map((product) => (
          <div key={product.id} className='admin__product-item'>
            <img src={product.imageUrl} alt={product.name} />
            <h3>{product.name}</h3>
            <label>
              <input
                type='checkbox'
                checked={product.isFeatured}
                onChange={() => toggleFeatured(product.id)}
              />
              Featured
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProductsManager;
