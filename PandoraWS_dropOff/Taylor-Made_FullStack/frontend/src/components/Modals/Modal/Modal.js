import React, { useRef } from 'react';

import './Modal.css';
import useOutsideClick from '../../../hooks/useOutsideClick';

const Modal = ({ isOpen, onClose, children, customContentClass }) => {
  const handleClose = () => {
    onClose();
  };
  const modalRef = useRef(null);
  useOutsideClick(modalRef, onClose);
  if (!isOpen) return null;

  return (
    <div className='modal__overlay' onClick={onClose}>
      <div
        className={`modal__content ${customContentClass || ''}`}
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button className='modal__close' onClick={handleClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
