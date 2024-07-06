import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BoostLight: React.FC = () => {
  const boostLightRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (boostLightRef.current) {
      boostLightRef.current.rotation.x += 0.01; // Rotate light for dynamic effect
      boostLightRef.current.rotation.y += 0.01; // Rotate light for dynamic effect
    }
  });

  return (
    <mesh ref={boostLightRef} position={[0, 0.5, -2]}>
      <coneGeometry args={[0.2, 1, 32]} /> {/* args: radius, height, radialSegments */}
      <meshBasicMaterial color="blue" transparent opacity={0.8} />
    </mesh>
  );
};

export default BoostLight;