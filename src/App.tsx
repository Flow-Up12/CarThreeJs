// src/App.js
import React from 'react';
import BabylonScene from './components/BabylonScene';
import Header from './components/Header';

const App = () => {
  return (
    <main>
      <Header />
      <div style={{ width: '100vw', height: '91vh' }}>
        <BabylonScene />
      </div>
    </main>
  );
};

export default App;