import React from 'react';
import './App.css';
import GameContextProvider from './context/GameContextProvider';
import CarGame from './CarGame';

const App: React.FC = () => {

  return (
    <GameContextProvider>
     <CarGame/>
    </GameContextProvider>
  );
};

export default App;
