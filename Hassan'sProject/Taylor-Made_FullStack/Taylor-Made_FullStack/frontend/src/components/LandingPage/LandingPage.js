import React, { useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import LoginModal from '../Modals/LoginModal/LoginModal';
import RegisterModal from '../Modals/RegisterModal/RegisterModal';
import title from '../../images/backgrounds/Taylor-Made_Title.webp';
import './LandingPage.css';

const LandingPage = () => {
  const { isLoggedIn, login, register } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState('login');
  const location = useLocation();

  const handleOpenModal = (formType) => {
    setCurrentForm(formType);
    setIsModalOpen(true);
  };

  const formTabSwitch = () => {
    setCurrentForm(currentForm === 'login' ? 'register' : 'login');
  };

  return (
    <div className='landing'>
      <div className='landing__container'>
        <div className='landing__title-container'>
          <h1 className='landing__title'>
            <img
              className='landing__title-image'
              src={title}
              alt='Taylor-Made'
            />
          </h1>
          <p className='landing__subtitle'>
            Home is where the food&#39;s good!
          </p>
        </div>
      </div>
      {!isLoggedIn && (
        <div className='landing__button-container'>
          <button
            className='landing__button landing__button-register'
            onClick={() => handleOpenModal('register')}
            aria-label='Register'
          >
            Register
          </button>
          <button
            className='landing__button landing__button-login'
            onClick={() => handleOpenModal('login')}
            aria-label='Login'
          >
            Login
          </button>
        </div>
      )}
      {currentForm === 'login' ? (
        <LoginModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onLogin={login}
          onSwitchToRegister={formTabSwitch}
        />
      ) : (
        <RegisterModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onRegister={register}
          onSwitchToLogin={formTabSwitch}
        />
      )}
    </div>
  );
};

export default LandingPage;
