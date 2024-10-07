import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import ExplodingOrb from './ExplodingOrb';

const Collectible: React.FC<{
  position: [number, number, number];
  setScore: React.Dispatch<React.SetStateAction<number>>;
  carRef: React.MutableRefObject<THREE.Group | null>;
  addOrb: (position: [number, number, number]) => void;
}> = ({ position, setScore, carRef, addOrb }) => {
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
        addOrb([Math.random() * 200 - 50, 0.5, Math.random() * 200 - 50]);
      }
    }
  });

  return collected ? (
    <ExplodingOrb position={position} />
  ) : (
    <mesh ref={collectibleRef} position={position}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

export default Collectible;
