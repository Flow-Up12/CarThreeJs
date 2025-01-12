import React from 'react';
import { useGameContext } from '../context/GameContextProvider';

const BoostBar: React.FC = () => {
  const { boostMeter } = useGameContext();

  // Normalize boostMeter to ensure it reflects height correctly (assuming boostMeter ranges from 0 to 100)
  const normalizedHeight = Math.min(Math.max(boostMeter, 0), 100); // Clamp to 0-100%

  return (
    <div
      style={{
        position: 'absolute',
        left: '20px',
        bottom: '50px',
        width: '40px',
        height: '300px',
        background: 'rgba(0, 0, 0, 0.5)', // Bar background
        borderRadius: '10px',
        border: '2px solid white',
        display: 'flex',
        flexDirection: 'column-reverse',
        overflow: 'hidden',
        zIndex: 100,
      }}
    >
                {Math.round(boostMeter)}%

      <div
        style={{
          width: '100%',
          height: `${normalizedHeight}%`, // Correctly reflect boost level as percentage
          background: 'linear-gradient(180deg, #f39c12, #e74c3c)', // Boost bar gradient
          transition: 'height 0.05s linear', // Faster transition
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '-25px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'white',
          fontSize: '14px',
          fontWeight: 'bold',
        }}
      >
      </div>
    </div>
  );
};

export default BoostBar;