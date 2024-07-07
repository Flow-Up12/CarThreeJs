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

    console.log(size);

    const maxDimension = Math.max(size.x, size.y, size.z);
    const scale = 5 / maxDimension;

    console.log(scale); 

    console.log(maxDimension)

    return scale;
  }

  const scale = useMemo(() => calculateScale(scene), [scene]);

  // Apply rotation to ensure all cars point in the same direction
  useMemo(() => {
    scene.rotation.set(0, Math.PI , 0); // Adjust the rotation values as needed
  }, [scene]);

  return <primitive object={scene} scale={scale} />;
};

export default CarModel;