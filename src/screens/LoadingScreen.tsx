import React from 'react';
import { useProgress } from '@react-three/drei';

const LoadingScreen: React.FC = () => {
  const { progress } = useProgress(); // Track loading progress

  return (
    <div className="loading-container">
      <div className="loading-content">
        {/* Circular Spinner */}
        <div className="loading-spinner">
          <div className="loading-circle"></div>
        </div>

        {/* Loading Text */}
        <div className="loading-text">
          <h1>Loading...</h1>
          <p>{Math.floor(progress)}% Complete</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
