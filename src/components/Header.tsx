import React, { useState } from 'react';
import CarSelectModal from './CarSelectModal';
import { useGameContext } from '../context/GameContextProvider';
import SettingsModal from './SettingsModal';

const Header: React.FC = () => {

  const [isModalOpen, setModalOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  const { score, framesPerSecond } = useGameContext();

  return (
    <header className="bg-black text-white py-2">
      <div className="container flex justify-between mx-auto">
        <h1 className="text-4xl font-bold">Car Game</h1>
        <div>
          <span className="text-4xl font-bold">Score: {score}</span>
        </div>
        <div >
          <button
            className="bg-white text-blue-600 px-4 rounded-lg mr-5"
            onClick={() => setModalOpen(true)}
          >
            Select Car
          </button>
          {/* settings button add icon */}
          <button
            className="bg-white text-blue-600  rounded-lg"
            onClick={() => setSettingsOpen(true)}
          >
            Settings
          </button>
          <span className='ml-5'>FPS: {framesPerSecond}</span>
        </div>
      </div>

      {isModalOpen && <CarSelectModal closeModal={() => setModalOpen(false)} />}
      {isSettingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} isOpen={isSettingsOpen} />}
    </header>
  );
};

export default Header;