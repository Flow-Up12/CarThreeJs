import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import FollowCamera from './FollowCamera';
import Terrain from './Terrain';
import ControllerCar from './ControllerCar';
import KeyboardCar from './KeyboardCar';
import Collectible from './Collectible';
import RingObstacle from './RingObstacle';
import LoadingScreen from '../screens/LoadingScreen';
import { useGameContext } from '../context/GameContextProvider';
import * as THREE from 'three';
import { generateRandomPositions } from '../utils/generateRandomPositions';
import { Ball } from './Ball';

const ThreeDModel: React.FC = () => {
  const { setScore, inputType, progress } = useGameContext();
  
  const [collectibles, setCollectibles] = useState<[number, number, number][]>([]);
  const [ringPositions, setRingPositions] = useState<[number, number, number][]>([]);
  const [position, setPosition] = useState<[number, number, number]>([0, 0.5, 0]);
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);

  const carRef = useRef<THREE.Group>(null);
  const terrainRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    setCollectibles(generateRandomPositions(100));
    setRingPositions(generateRandomPositions(20));
  }, []);

  const addOrb = (position: [number, number, number]) => {
    setCollectibles((prev) => [...prev, position]);
  };

  return progress < 100 ? (
    <LoadingScreen />
  ) : (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight
        intensity={1.0}
        position={[5, 10, 7.5]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-10, 10, -10]} intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      
      {inputType === 'controller' && (
        <ControllerCar
          position={position}
          rotation={rotation}
          setPosition={setPosition}
          setRotation={setRotation}
          carRef={carRef}
          terrainRef={terrainRef}
        />
      )}
      
      {inputType === 'keyboard' && (
        <KeyboardCar
          position={position}
          rotation={rotation}
          setPosition={setPosition}
          setRotation={setRotation}
          carRef={carRef}
          terrainRef={terrainRef}
        />
      )}

      <FollowCamera carRef={carRef} />
      
      <mesh ref={terrainRef}>
        <Terrain />
      </mesh>
      
      {collectibles.map((pos, index) => (
        <Collectible key={index} position={pos} setScore={setScore} carRef={carRef} addOrb={addOrb} />
      ))}
      
      {ringPositions.map((pos, index) => (
        <RingObstacle key={index} position={pos} setScore={setScore} carRef={carRef} />
      ))}

      <Ball position={[0, 1, 5]} carRef={carRef} />
      <Environment background files="/sky.hdr" />
    </Canvas>
  );
};

export default ThreeDModel;
