import React, { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import LoginModal from '../LoginModal/LoginModal';
import RegisterModal from '../RegisterModal/RegisterModal';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onLogin, onRegister, initialTab }) => {
  const [activeTab, setActiveTab] = useState(initialTab || 'login');

  useEffect(() => {
    setActiveTab(initialTab || 'login');
  }, [initialTab]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='auth__modal'>
        <div className='auth__modal-tabs'>
          <button
            className={`auth__modal-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            className={`auth__modal-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>
        {activeTab === 'login' ? (
          <LoginModal isOpen={true} onClose={onClose} onLogin={onLogin} />
        ) : (
          <RegisterModal
            isOpen={true}
            onClose={onClose}
            onRegister={onRegister}
          />
        )}
      </div>
    </Modal>
  );
};

export default AuthModal;
