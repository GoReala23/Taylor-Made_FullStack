import React from 'react';
import Modal from '../Modal/Modal';
import './ModalWithForm.css';

const ModalWithForm = ({
  isOpen,
  children,
  buttonText,
  title,
  onClose,
  onSubmit,
  isSubmitDisabled,
  formTabSwitch,
  switchText,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='modal__content'>
        <h3 className='modal__title'>{title}</h3>
        <form className='modal__form' onSubmit={onSubmit}>
          {children}
          <button
            className='modal__form-submit'
            type='submit'
            disabled={isSubmitDisabled}
          >
            {buttonText}
          </button>
          {formTabSwitch && (
            <button
              type='button'
              className='modal__form-switch'
              onClick={formTabSwitch}
            >
              {switchText}
            </button>
          )}
        </form>
      </div>
    </Modal>
  );
};

export default ModalWithForm;
