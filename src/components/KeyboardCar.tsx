import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import BoostParticles from './BoostParticles';
import CarModel from './CarModel';
import { useGameContext } from '../context/GameContextProvider';

interface CarProps {
  position: [number, number, number];
  rotation: [number, number, number];
  setPosition: React.Dispatch<React.SetStateAction<[number, number, number]>>;
  setRotation: React.Dispatch<React.SetStateAction<[number, number, number]>>;
  carRef: React.MutableRefObject<THREE.Group | null>;
  terrainRef: React.MutableRefObject<THREE.Mesh | null>;
}

const KeyboardCar: React.FC<CarProps> = ({ position, rotation, setPosition, setRotation, carRef, terrainRef }) => {
  const normalSpeed = 0.2;
  const boostSpeed = .5;
  const rotationSpeed = 0.05;
  const gravity = .10;
  const flySpeed = 0.3;
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const [boosting, setBoosting] = useState(false);
  const [flying, setFlying] = useState(false);
  const raycaster = useRef(new THREE.Raycaster());

  const { car } = useGameContext();

  // Boost Logic

  let pressBoostTimer: number;

  useEffect(() => {

    let pressSpaceCounter = 0;

    const handleKeyDown = (event: KeyboardEvent) => {
      keysPressed.current[event.key] = true;

      if (event.key === ' ') {
        pressSpaceCounter++;
        setBoosting(true);
        if (pressSpaceCounter === 2) {
          setFlying((prevFlying) => !prevFlying);
            pressSpaceCounter = 0; // Reset after toggling flying mode
            clearTimeout(pressBoostTimer); // Clear the timer since double space press was detected
        } else {
          pressBoostTimer = setTimeout(() => {
            pressSpaceCounter = 0; // Reset count if no double press within
          }, 500);
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed.current[event.key] = false;
      if (event.key === ' ') {
        setBoosting(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearTimeout(pressBoostTimer);
    };
  }, []);

  const getTerrainHeight = (x: number, z: number): number => {
    if (!terrainRef.current) return 0;

    const origin = new THREE.Vector3(x, 50, z);
    const direction = new THREE.Vector3(0, -1, 0);
    raycaster.current.set(origin, direction);

    const intersects = raycaster.current.intersectObject(terrainRef.current);
    if (intersects.length > 0) {
      return intersects[0].point.y;
    }

    return 0;
  };

  useFrame(() => {
    const speed = boosting ? boostSpeed : normalSpeed;
    if (keysPressed.current['w']) {
      setPosition(([x, y, z]) => [x + speed * Math.sin(rotation[1]), y, z + speed * Math.cos(rotation[1])]);
    }
    if (keysPressed.current['s']) {
      setPosition(([x, y, z]) => [x - speed * Math.sin(rotation[1]), y, z - speed * Math.cos(rotation[1])]);
    }
    if (keysPressed.current['a']) {
      setRotation(([x, y, z]) => [x, y + rotationSpeed, z]);
    }
    if (keysPressed.current['d']) {
      setRotation(([x, y, z]) => [x, y - rotationSpeed, z]);
    }

    if (flying) {
      if (keysPressed.current[' ']) {
        setPosition(([x, y, z]) => [x, y + flySpeed, z]);
      } else {
        setPosition(([x, y, z]) => [x, y - gravity, z]);
      }
    } else {
      setPosition(([x, y, z]) => {
        const newY = y - gravity;
        const terrainHeight = getTerrainHeight(x, z);
        return [x, Math.max(newY, terrainHeight + 0.5), z]; // Ensure the car doesn't fall below the terrain height
      });
    }
  });

  return (
    <group ref={carRef} position={position as [number, number, number]} rotation={rotation as [number, number, number]}>
      <CarModel modelPath={car} />
      {boosting && <BoostParticles />}
    </group>
  );
};

export default KeyboardCar;