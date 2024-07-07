import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface FollowCameraProps {
  carRef: React.MutableRefObject<THREE.Group | null>;
}

const FollowCamera: React.FC<FollowCameraProps> = ({ carRef }) => {
  const { camera } = useThree();
  const cameraRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (cameraRef.current) {
      camera.position.set(0, 5, 10); // Set initial camera position
      camera.lookAt(0, 0, 0); // Set initial camera target
    }
  }, [camera]);

  useFrame(() => {
    if (carRef.current && cameraRef.current) {
      const carPosition = new THREE.Vector3();
      carRef.current.getWorldPosition(carPosition);

      // Calculate the desired camera position
      const desiredPosition = new THREE.Vector3(
        carPosition.x,
        carPosition.y + 5,
        carPosition.z + 10
      );

      // Smoothly interpolate the camera position towards the desired position
      camera.position.lerp(desiredPosition, 0.1);

      // Make the camera look at the car
      camera.lookAt(carPosition);
    }
  });

  return <group ref={cameraRef} />;
};

export default FollowCamera;

