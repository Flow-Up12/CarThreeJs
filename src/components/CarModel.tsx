import React, { useMemo, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface CarModelProps {
  modelPath: string;
}

const CarModel: React.FC<CarModelProps> = ({ modelPath }) => {
  const { scene: originalScene } = useGLTF(modelPath);

  // Clone the scene to create an independent instance
  const scene = useMemo(() => originalScene.clone(), [originalScene]);

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
  useEffect(() => {
    scene.rotation.set(0, Math.PI, 0); // Adjust the rotation values as needed
  }, [scene]);

  return <primitive object={scene} scale={scale} />;
};

export default CarModel;