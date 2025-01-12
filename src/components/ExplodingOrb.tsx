import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ExplodingOrb: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const particles = useRef<THREE.Points>(null);

  useFrame(({ clock }) => {
    if (particles.current && particles.current.material) {
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
          itemSize={5}
        />
      </bufferGeometry>
      <pointsMaterial attach="material" color="orange" size={0.1} transparent />
    </points>
  );
};

export default ExplodingOrb;
