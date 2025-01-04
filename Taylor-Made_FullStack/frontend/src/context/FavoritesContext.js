import React, { createContext, useState } from 'react';

export const FavoritesContext = createContext(null);

export const useFavorites = () => {
  const context = React.useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (product) => {
    setFavorites((prevFavorites) => [...prevFavorites, product]);
  };

  const removeFavorite = (productId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((fav) => fav._id !== productId),
    );
  };

  const toggleFavorite = (product) => {
    const isFavorite = favorites.some((fav) => fav._id === product._id);
    if (isFavorite) {
      removeFavorite(product._id);
    } else {
      addFavorite(product);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesProvider;
