import  { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';


const BoostParticles = () => {
  const boostRef = useRef<THREE.Group>(null);
  const gltf = useLoader(GLTFLoader, '/aura/scene.gltf'); // Update with the correct path to your GLB file

  gltf.scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      (mesh.material as THREE.MeshStandardMaterial).color.set('red'); // Set the color to red
    }
  });
  useFrame(() => {
    if (boostRef.current) {
      boostRef.current.scale.addScalar(0.0001); // Scale the boost particles
    }
  });


  return (
    <group ref={boostRef} position={[0,-.5,-2.4]}>
      <primitive object={gltf.scene} />
    </group>
  );
};

export default BoostParticles;