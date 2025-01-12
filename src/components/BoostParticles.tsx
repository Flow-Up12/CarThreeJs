import React, { useEffect, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

interface BoostParticlesProps {
  visible: boolean; // Pass visibility as a prop
}

const BoostParticles: React.FC<BoostParticlesProps> = ({ visible }) => {
  const boostRef = useRef<THREE.Group>(null);
  const gltf = useLoader(GLTFLoader, "/aura/scene.gltf"); // Replace with the correct path to your GLTF file

  // Preload the model to avoid loading delays
  useEffect(() => {
    gltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [gltf]);

  return (
    <group
      ref={boostRef}
      position={[0, -0.5, +3]}
      rotation={[0, Math.PI, 0]} // Rotate on X-axis by Math.PI
      visible={visible}
    >
      <primitive object={gltf.scene} />
    </group>
  );
};

export default BoostParticles;
