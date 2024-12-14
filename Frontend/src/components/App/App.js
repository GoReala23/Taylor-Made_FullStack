import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

import Header from '../Header/Header';
import Dashboard from '../Dashboard/Dashboard';
import Home from '../Home/Home';
import Products from '../Products/Products';
import Profile from '../Profile/Profile';
import Orders from '../Orders/Orders';
import Settings from '../Settings/Settings';
import About from '../About/About';
import Locations from '../Locations/Locations';
import LandingPage from '../LandingPage/LandingPage';
import CartModal from '../Modals/CartModal/CartModal';
import './App.css';

const App = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div className='App'>
      <Header />
      {isLoggedIn && <Dashboard />}
      <Routes>
        <Route path='/' element={isLoggedIn ? <Home /> : <LandingPage />} />
        <Route
          path='/dashboard'
          element={isLoggedIn ? <Home /> : <Navigate to='/login' />}
        />
        <Route path='/products' element={<Products />} />
        <Route
          path='/profile'
          element={isLoggedIn ? <Profile /> : <Navigate to='/login' />}
        />
        <Route
          path='/orders'
          element={isLoggedIn ? <Orders /> : <Navigate to='/login' />}
        />
        <Route
          path='/settings'
          element={isLoggedIn ? <Settings /> : <Navigate to='/login' />}
        />
        <Route
          path='/cart'
          element={isLoggedIn ? <CartModal /> : <Navigate to='/login' />}
        />
        <Route path='/about' element={<About />} />
        <Route path='/locations' element={<Locations />} />
      </Routes>
    </div>
  );
};

export default App;
