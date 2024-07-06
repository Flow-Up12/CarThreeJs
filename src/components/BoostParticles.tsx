import  { useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';


const BoostParticles = () => {
  const boostRef = useRef<THREE.Group>(null);
  const gltf = useLoader(GLTFLoader, '/aura/scene.gltf'); // Update with the correct path to your GLB file

  return (
    <group ref={boostRef} position={[0,-.5,-3]}>
      <primitive object={gltf.scene} />
    </group>
  );
};

export default BoostParticles;