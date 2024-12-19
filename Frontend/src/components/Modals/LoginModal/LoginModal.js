import React from 'react';
import ModalWithForm from '../ModalWithForm/ModalWithForm';
import useFormAndValidation from '../../../hooks/useFormAndValidation';

const LoginModal = ({ isOpen, onClose, onLogin, onSwitchToRegister }) => {
  const { values, handleChange, errors, isValid, resetForm } =
    useFormAndValidation();

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(values);
    resetForm();
    resetForm();
    onClose();
  };

  return (
    <ModalWithForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title='Login'
      buttonText='Log In'
      isSubmitDisabled={!isValid}
      formTabSwitch={onSwitchToRegister}
      switchText='Need to register?'
    >
      <label className='modal__form-label'>
        Email
        <input
          className='modal__form-input'
          type='email'
          name='email'
          value={values.email || ''}
          onChange={handleChange}
          required
        />
        <span>{errors.email}</span>
      </label>
      <label className='modal__form-label'>
        Password
        <input
          className='modal__form-input'
          type='password'
          name='password'
          value={values.password || ''}
          onChange={handleChange}
          required
        />
        <span>{errors.password}</span>
      </label>
    </ModalWithForm>
  );
};

export default LoginModal;
