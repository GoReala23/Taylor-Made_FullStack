import React from 'react';
import './Main.css';

function Main({ onRegister, onLogin }) {
  return (
    <main className='main'>
      <h1 className='main__title'>TaylorMade</h1>
      <p className='main__subtitle'>
        {' '}
        {/* might add subtitle text here if needed */}{' '}
      </p>
      <div className='main__buttons'>
        <button
          className='main__button main__button-register'
          onClick={onRegister}
        >
          Sign Up
        </button>
        <button className='main__button main__button-login' onClick={onLogin}>
          Log In
        </button>
      </div>
    </main>
  );
}

export default Main;
