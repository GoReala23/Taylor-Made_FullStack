import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Header.css';
import logo from '../../images/logo.webp';

const Header = () => {
  const { isLoggedIn, logout, user } = useContext(AuthContext);

  return (
    <header className='header'>
      <Link to='/' className='header__logo'>
        <img className='header__logo-image' src={logo} alt='Taylor-Made' />
      </Link>
      <nav className='header__nav'>
        <Link to='/products' className='header__nav-link'>
          Products
        </Link>
        <Link to='/about' className='header__nav-link'>
          About
        </Link>
        <Link to='/locations' className='header__nav-link'>
          Locations
        </Link>
        {isLoggedIn ? (
          <div className='header__user'>
            {user && (
              <span className='header__welcome'>Welcome, {user.name}</span>
            )}
            <button onClick={logout} className='header__logout-btn'>
              Logout
            </button>
          </div>
        ) : (
          <Link to='/login' className='header__nav-link'>
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
