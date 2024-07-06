import React, { useRef, useState, useEffect, MutableRefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Environment } from '@react-three/drei';
import Car from './Car';
import FollowCamera from './FollowCamera';
import Terrain from './Terrain';
import { useGameContext } from '../context/GameContextProvider';

const ExplodingOrb: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const particles = useRef<THREE.Points>(null);

  useFrame(({ clock }) => {
    if (particles.current) {
      const elapsedTime = clock.getElapsedTime();
      (particles.current.material as THREE.PointsMaterial).opacity = Math.max(0, 1 - elapsedTime * 2);
    }
  });

  return (
    <points ref={particles} position={position}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={100}
          array={new Float32Array(Array.from({ length: 300 }, () => (Math.random() - 0.5) * 2))}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial attach="material" color="orange" size={0.1} transparent />
    </points>
  );
};

const Collectible: React.FC<{ position: [number, number, number]; setScore: React.Dispatch<React.SetStateAction<number>>; carRef: MutableRefObject<THREE.Group | null>; addOrb: (position: [number, number, number]) => void }> = ({ position, setScore, carRef, addOrb }) => {
  const collectibleRef = useRef<THREE.Mesh>(null);
  const [collected, setCollected] = useState(false);

  useFrame(() => {
    if (collectibleRef.current && carRef.current) {
      const carPosition = new THREE.Vector3();
      carRef.current.getWorldPosition(carPosition);
      const distance = collectibleRef.current.position.distanceTo(carPosition);
      if (distance < 1.5 && !collected) {
        setScore((prevScore) => prevScore + 1);
        setCollected(true);
        collectibleRef.current.visible = false;
        addOrb([
          Math.random() * 200 - 50, // Update to fit within terrainWidth
          0.5,
          Math.random() * 200 - 50, // Update to fit within terrainHeight
        ]);
      }
    }
  });

  if (collected) {
    return <ExplodingOrb position={position} />;
  }

  return (
    <mesh ref={collectibleRef} position={position}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

const generateRandomPositions = (count: number): [number, number, number][] => {
  
  const terrainWidth = 200;
  const terrainHeight = 200;
  const terrainDepth = 10;

  const positions: [number, number, number][] = [];
  for (let i = 0; i < count; i++) {
    const x = Math.random() * terrainWidth - terrainWidth / 2; // Random positions within terrainWidth
    const z = Math.random() * terrainHeight - terrainHeight / 2; // Random positions within terrainHeight
    // Random positions above terrainDepth 
    const y = Math.random() * terrainDepth / 2 + 0.5;
    positions.push([x, y, z]);
  }
  return positions;
};

const ThreeDModel = () => {

  const {isLoading, setScore} = useGameContext();

  const [collectibles, setCollectibles] = useState<[number, number, number][]>([]);
  const [position, setPosition] = useState<[number, number, number]>([0, 0.5, 0]);
  // roate the car to face the direction it is moving
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);
  const carRef = useRef<THREE.Group>(null);
  const terrainRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    setCollectibles(generateRandomPositions(100));
  }, []);

  const addOrb = (position: [number, number, number]) => {
    setCollectibles((prev) => [...prev, position]);
  };

  return isLoading ? <></> :(
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
      <Car
        position={position}
        rotation={rotation}
        setPosition={setPosition}
        setRotation={setRotation}
        carRef={carRef}
        terrainRef={terrainRef}
      />
      <FollowCamera carRef={carRef} />
      <mesh ref={terrainRef}>
        <Terrain />
      </mesh>
      {collectibles.map((pos, index) => (
        <Collectible key={index} position={pos} setScore={setScore} carRef={carRef} addOrb={addOrb} />
      ))}
      <Environment background files="/sky.hdr" />
    </Canvas>
  );
};

export default ThreeDModel;