import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface CarModelProps {
  modelPath: string;
}

const CarModel: React.FC<CarModelProps> = ({ modelPath }) => {
  const { scene } = useGLTF(modelPath);

  const calculateScale = (scene: THREE.Object3D) => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);

    const maxDimension = Math.max(size.x, size.y, size.z);
    const scale = 5 / maxDimension;

    return scale;
  };

  const scale = useMemo(() => calculateScale(scene), [scene]);

  // Apply rotation to ensure all cars point in the same direction
  useMemo(() => {
    if (scene) {
      scene.rotation.set(0, 0, 0); // Rotate to face correct direction
    }
  }, [scene]);

  // Fallback in case the model doesn't load
  if (!scene) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  }

  return <primitive object={scene} scale={scale} />;
};

export default CarModel;
