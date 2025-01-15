import React, { createContext, useState, useEffect } from 'react';
import Api from '../utils/Api';

const FeaturedProductsContext = createContext();

export const FeaturedProductsProvider = ({ children }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  const fetchFeaturedProducts = async () => {
    try {
      const fetchedProducts = await Api.getFeaturedProducts();

      setFeaturedProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const toggleFeatured = async (productId) => {
    try {
      await Api.toggleFeaturedProduct(productId);
      fetchFeaturedProducts();
    } catch (error) {
      console.error('Error toggling featured product:', error);
    }
  };

  return (
    <FeaturedProductsContext.Provider
      value={{ featuredProducts, toggleFeatured }}
    >
      {children}
    </FeaturedProductsContext.Provider>
  );
};

export const useFeaturedProducts = () => {
  const context = React.useContext(FeaturedProductsContext);
  if (!context) {
    throw new Error(
      'useFeaturedProducts must be used within a FeaturedProductsProvider',
    );
  }
  return context;
};

export default FeaturedProductsProvider;
