import React from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

const FerrariModel: React.FC = () => {
  const gltf = useLoader(GLTFLoader, '/src/ferrari_enzo/scene.gltf'); 

  return <primitive object={gltf.scene} scale={[0.5, 0.5, 0.5]} rotation={[0, Math.PI, 0]} />;
};

export default FerrariModel;