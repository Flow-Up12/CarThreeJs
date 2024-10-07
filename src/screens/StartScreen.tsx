import React, { useState, useRef, useEffect } from 'react';
import { Canvas, ThreeEvent, useFrame } from '@react-three/fiber';
import { Environment, Text as DreiText } from '@react-three/drei';
import * as THREE from 'three';
import CarModel from '../components/CarModel';
import { useGameContext } from '../context/GameContextProvider';
import ProgressBar from '../components/ProgressBar';

const DraggableCar: React.FC<{ modelPath: string; setProgress: (value: number) => void }> = ({ modelPath, setProgress }) => {
  const carRef = useRef<THREE.Group>(null);
  const targetPositionX = useRef(0); // Target position for smooth movement

  useFrame(() => {
    if (carRef.current) {
      // Smooth transition towards the target position using linear interpolation
      carRef.current.position.x = THREE.MathUtils.lerp(carRef.current.position.x, targetPositionX.current, 0.1);

      // Limit the car's movement to the right within a range of 0 to 5.5 on the x-axis
      const maxPositionX = 5.5;
      const currentPositionX = carRef.current.position.x;

      // Update the progress based on the car's position, ensure it reaches 100 smoothly
      const currentProgress = Math.min((currentPositionX / maxPositionX) * 100, 100);
      setProgress(Math.min(currentProgress, 99.9)); // Limit to just below 100 for smoother transitions
    }
  });

  const handleDrag = (e: ThreeEvent<PointerEvent>) => {
    if (carRef.current) {
      // Instead of moving the car directly, we update the target position
      const dragDistance = e.movementX * 0.01; // Adjust the drag sensitivity
      const newPosX = THREE.MathUtils.clamp(targetPositionX.current + dragDistance, 0, 5.5);
      targetPositionX.current = newPosX; // Set the new target position
    }
  };

  return (
    <group ref={carRef} onPointerMove={(e) => handleDrag(e)}>
      <CarModel modelPath={modelPath} />
    </group>
  );
};

const StartScreen = () => {
  const [progress, setProgress] = useState(0); // Progress for the progress bar
  const { setIsLoading } = useGameContext();

  useEffect(() => {
    // Ensure smooth transition even after progress reaches 100%
    if (progress >= 99.9 ) {
      // Add a small delay before hiding the loading screen for a smoother effect
      const timeout = setTimeout(() => {
        setIsLoading(false); // Stop the loading screen after the progress reaches 100%
      }, 500); // Adjust the delay as needed
      return () => clearTimeout(timeout);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);


  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas camera={{ position: [0, 5, 10] }}>
        {/* Lighting to make the car glow */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} color={'#ffcc00'} />
        <pointLight position={[-10, -10, -10]} intensity={2} color={'#ff66ff'} />

        {/* 3D Text for the game title */}
        <DreiText
          position={[0, 3, -4]} // Adjust position for the 3D text
          fontSize={1} // Size of the text
          color="white" // Text color
          anchorX="center"
          anchorY="middle"
        >
          Marcos's Car Game
        </DreiText>

        {/* Draggable car model */}
        <DraggableCar modelPath="/nissan_gtr/scene.gltf" setProgress={setProgress} />

        {/* Environment for background */}
        <Environment files="./sky.hdr" background />
      </Canvas>

      {/* Progress Bar */}
      <ProgressBar progress={progress} />
    </div>
  );
};

export default StartScreen;
