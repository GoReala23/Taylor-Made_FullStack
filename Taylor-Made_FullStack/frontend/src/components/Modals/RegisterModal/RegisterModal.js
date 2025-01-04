import React from 'react';
import ModalWithForm from '../ModalWithForm/ModalWithForm';
import useFormAndValidation from '../../../hooks/useFormAndValidation';

const RegisterModal = ({ isOpen, onClose, onRegister, onSwitchToLogin }) => {
  const { values, handleChange, errors, isValid, resetForm } =
    useFormAndValidation();

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(values);
    resetForm();
    onClose();
  };

  return (
    <ModalWithForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title='Register'
      buttonText='Sign Up'
      isSubmitDisabled={!isValid}
      formTabSwitch={onSwitchToLogin}
      switchText='Already have an account?'
    >
      <label className='modal__form-label'>
        Name
        <input
          className='modal__form-input'
          type='text'
          name='name'
          value={values.name || ''}
          onChange={handleChange}
          required
        />
        <span>{errors.name}</span>
      </label>
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

export default RegisterModal;
