import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import GameContextProvider from './context/GameContextProvider';
import ThreeDModel from './components/TreeDModel';

const App: React.FC = () => {
  

  return (
    <GameContextProvider>
      <div className="App">
        <Header />
        <main className="App-main">
          <ThreeDModel  />
        </main>
      </div>
    </GameContextProvider>
  );
};

export default App;

