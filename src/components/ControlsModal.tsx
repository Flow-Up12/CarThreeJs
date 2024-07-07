import React from 'react';
import { useGameContext } from '../context/GameContextProvider';

const ControlsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { inputType } = useGameContext();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-2xl p-8 z-10 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl text-black font-bold">Game Controls</h1>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {inputType === 'controller' ? (
          <div>
            <h2 className="text-2xl mb-4">Controller Controls</h2>
            <ul className="list-disc ml-5">
              <li>Left Stick: Move</li>
              <li>Right Stick: Rotate Camera</li>
              <li>X Button: Jump</li>
              <li>R1: Boost</li>
              <li>L1: Air Control</li>
            </ul>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl mb-4">Keyboard Controls</h2>
            <ul className="list-disc ml-5">
              <li>W: Move Forward</li>
              <li>S: Move Backward</li>
              <li>A: Turn Left</li>
              <li>D: Turn Right</li>
              <li>Space: Jump/Boost</li>
              <li>Y: Toggle Camera View</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlsModal;