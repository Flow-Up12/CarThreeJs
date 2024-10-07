import React from 'react';

interface ProgressBarProps {
  progress: number;
  color?: string; // Custom color for the progress fill
  backgroundColor?: string; // Custom background color for the progress bar
  height?: string; // Custom height for the progress bar
  label?: string; // Optional label inside the progress bar
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = '#00ff00',
  backgroundColor = '#ddd',
  height = '30px',
  label = 'Drag the car to start the game!', // Default label
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '80%',
        height,
        backgroundColor,
        borderRadius: '5px',
        overflow: 'hidden',
        fontWeight: 'bold',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', // Adding shadow for better visual appearance
      }}
    >
      {/* Progress Bar Fill */}
      <div
        style={{
          width: `${progress}%`,
          height: '100%',
          backgroundColor: color,
          transition: 'width 0.3s ease', // Smooth transition for progress bar fill
        }}
      />

      {/* Label (Now fixed and centered on top of the progress bar) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)', // Center the label horizontally
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#000',
          fontSize: '14px', // Adjusted font size for the label
          pointerEvents: 'none', // Prevent interaction with the label
        }}
      >
        {label}
      </div>
    </div>
  );
};

export default ProgressBar;
