import React, { useState } from 'react';
import CarSelectModal from './CarSelectModal';
import { useGameContext } from '../context/GameContextProvider';

const Header: React.FC = () => {

  const [isModalOpen, setModalOpen] = useState(false);
  const {score} = useGameContext();

  return (
    <header className="bg-black text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-4xl font-bold">Car Game</h1>
        <div>
          <span className="text-4xl font-bold">Score: {score}</span>
        </div>
        <button
          className="bg-white text-blue-600 px-4 py-2 rounded-lg"
          onClick={() => setModalOpen(true)}
        >
          Select Car
        </button>
      </div>
      {isModalOpen && <CarSelectModal closeModal={() => setModalOpen(false)} />}
    </header>
  );
};

export default Header;