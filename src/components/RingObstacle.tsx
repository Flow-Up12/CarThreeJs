import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const RingObstacle: React.FC<{
  position: [number, number, number];
  setScore: React.Dispatch<React.SetStateAction<number>>;
  carRef: React.MutableRefObject<THREE.Group | null>;
}> = ({ position, setScore, carRef }) => {
  const ringRef = useRef<THREE.Mesh>(null);
  const [passedThrough, setPassedThrough] = useState(false);

  useFrame(() => {
    if (ringRef.current && carRef.current) {
      const carPosition = new THREE.Vector3();
      carRef.current.getWorldPosition(carPosition);
      const distance = ringRef.current.position.distanceTo(carPosition);
      
      if (distance < 5 && !passedThrough) {
        setScore((prevScore) => prevScore + 5);
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

export default RingObstacle;
