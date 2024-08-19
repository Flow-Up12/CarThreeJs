import React, { useRef, useState, useEffect, MutableRefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Environment } from '@react-three/drei';
import FollowCamera from './FollowCamera';
import Terrain from './Terrain';
import { useGameContext } from '../context/GameContextProvider';
import ControllerCar from './ControllerCar';
import KeyboardCar from './KeyboardCar';
import { Ball } from './Ball';
import { io } from 'socket.io-client';
import CarModel from './CarModel';
import { useCarModel } from '../context/useCarModel';

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

const RingObstacle: React.FC<{ position: [number, number, number]; setScore: React.Dispatch<React.SetStateAction<number>>; carRef: MutableRefObject<THREE.Group | null>; }> = ({ position, setScore, carRef }) => {
  const ringRef = useRef<THREE.Mesh>(null);
  const [passedThrough, setPassedThrough] = useState(false);

  useFrame(() => {
    if (ringRef.current && carRef.current) {
      const carPosition = new THREE.Vector3();
      carRef.current.getWorldPosition(carPosition);
      const distance = ringRef.current.position.distanceTo(carPosition);
      if (distance < 5 && !passedThrough) {
        setScore((prevScore) => prevScore + 5); // Increase score by 5 for going through a ring
        setPassedThrough(true);
        ringRef.current.visible = false;
      }
    }
  });

  return (
    <mesh ref={ringRef} position={position}>
      <torusGeometry args={[10, 1, 16, 100]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
};

const generateRandomPositions = (count: number): [number, number, number][] => {
  const terrainWidth = 400;
  const terrainHeight = 400;
  const terrainDepth = 10;

  const positions: [number, number, number][] = [];
  for (let i = 0; i < count; i++) {
    const x = Math.random() * terrainWidth - terrainWidth / 2; // Random positions within terrainWidth
    const z = Math.random() * terrainHeight - terrainHeight / 2; // Random positions within terrainHeight
    const y = Math.random() * terrainDepth / 2 + 0.5; // Random positions above terrainDepth
    positions.push([x, y, z]);
  }
  return positions;
};

const socket = io('http://localhost:4000');

const MultiplayerCar: React.FC<{ carState: { position: [number, number, number]; rotation: [number, number, number] }; carRef: MutableRefObject<THREE.Group | null> }> = ({ carState, carRef }) => {

  return (
    <group ref={carRef} position={carState.position} rotation={carState.rotation}>
      <CarModel modelPath='/ferrari/scene.gltf'/>
    </group>
  );
};

const ThreeDModel: React.FC = () => {
  const { isLoading, setScore, inputType } = useGameContext();
  const [collectibles, setCollectibles] = useState<[number, number, number][]>([]);
  const [ringPositions, setRingPositions] = useState<[number, number, number][]>([]);
  const [position, setPosition] = useState<[number, number, number]>([0, 0.5, 0]);
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);
  const carRef = useRef<THREE.Group>(null);
  const multiplayerCarRef = useRef<THREE.Group>(null);
  const terrainRef = useRef<THREE.Mesh>(null);
  const [cars, setCars] = useState<{ [id: string]: { position: [number, number, number]; rotation: [number, number, number] } }>({});


  useEffect(() => {
    setCollectibles(generateRandomPositions(100));
    setRingPositions(generateRandomPositions(20));
  }, []);

  useEffect(() => {
    socket.on('initialize', (initialCars) => {
      setCars(initialCars);
    });

    socket.on('newCar', ({ id, state }) => {
      setCars((prevCars) => ({ ...prevCars, [id]: state }));
    });

    socket.on('updateCar', ({ id, state }) => {
      setCars((prevCars) => ({ ...prevCars, [id]: state }));
    });

    socket.on('removeCar', (id) => {
      setCars((prevCars) => {
        const newCars = { ...prevCars };
        delete newCars[id];
        return newCars;
      });
    });

    return () => {
      socket.off('initialize');
      socket.off('newCar');
      socket.off('updateCar');
      socket.off('removeCar');
    };
  }, []);

  useEffect(() => {
    if (carRef.current) {
      socket.emit('updateCar', {
        position,
        rotation,
      });
    }
  }, [position, rotation]);

  const addOrb = (position: [number, number, number]) => {
    setCollectibles((prev) => [...prev, position]);
  };

  return isLoading ? <></> : (
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
      {inputType === 'controller' && <ControllerCar position={position} rotation={rotation} setPosition={setPosition} setRotation={setRotation} carRef={carRef} terrainRef={terrainRef} />}
      {inputType === 'keyboard' && <KeyboardCar position={position} rotation={rotation} setPosition={setPosition} setRotation={setRotation} carRef={carRef} terrainRef={terrainRef} />}
      <FollowCamera carRef={carRef} />
      <mesh ref={terrainRef}>
        <Terrain />
      </mesh>
      {Object.entries(cars).map(([id, carState]) => (
        <MultiplayerCar key={id} carState={carState} carRef={multiplayerCarRef} />
      ))}
      {collectibles.map((pos, index) => (
        <Collectible key={index} position={pos} setScore={setScore} carRef={carRef} addOrb={addOrb} />
      ))}
      {ringPositions.map((pos, index) => (
        <RingObstacle key={index} position={pos} setScore={setScore} carRef={carRef} />
      ))}
      
      <Environment background files="/sky.hdr" />
    </Canvas>
  )
}
export default ThreeDModel;