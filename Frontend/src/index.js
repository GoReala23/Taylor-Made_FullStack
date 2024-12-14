import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './components/App/App';
import { AuthProvider } from './context/AuthContext';
import { FeaturedProductsProvider } from './context/FeaturedProductsContext';
import reportWebVitals from './reportWebVitals';
import { FavoritesProvider } from './context/FavoritesContext';
import { CartProvider } from './context/CartContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FeaturedProductsProvider>
          <FavoritesProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </FavoritesProvider>
        </FeaturedProductsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

reportWebVitals();
