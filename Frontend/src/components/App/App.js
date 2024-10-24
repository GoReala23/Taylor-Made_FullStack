import React from 'react';
import Map from '../Map/Map';
import './App.css';

const App = () => (
  <div className='App'>
    <header className='App-header'>
      <h1>Taylor Made</h1>
      <Map /> {/* This will render the Map component */}
    </header>
  </div>
);

export default App;
