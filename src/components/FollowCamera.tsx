import React, { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface FollowCameraProps {
  carRef: React.MutableRefObject<THREE.Group | null>;
}

const FollowCamera: React.FC<FollowCameraProps> = ({ carRef }) => {
  const { camera } = useThree();
  const cameraRef = useRef<THREE.Group>(null);
  const [cameraOffset] = useState(new THREE.Vector3(0, 5, 10));
  const [rotationOffset] = useState(new THREE.Euler(0, 0, 0));
  const [rightStickX, setRightStickX] = useState(0);
  const [rightStickY, setRightStickY] = useState(0);
  const deadzone = 0.1; // Deadzone threshold

  useEffect(() => {
    if (cameraRef.current) {
      camera.position.set(cameraOffset.x, cameraOffset.y, cameraOffset.z);
      camera.lookAt(0, 0, 0);
    }
  }, [camera, cameraOffset]);

  const handleGamepadInput = () => {
    const gamepads = navigator.getGamepads();
    const gp = gamepads[0];

    if (gp) {
      const { axes } = gp;
      const newRightStickX = Math.abs(axes[2]) > deadzone ? axes[2] : 0;
      const newRightStickY = Math.abs(axes[3]) > deadzone ? axes[3] : 0;

      // Update the right stick states
      setRightStickX(newRightStickX);
      setRightStickY(newRightStickY);
    }
  };

  useFrame(() => {
    if (carRef.current && cameraRef.current) {
      const carPosition = new THREE.Vector3();
      carRef.current.getWorldPosition(carPosition);

      // Calculate the desired camera position
      const desiredPosition = carPosition.clone().add(cameraOffset.clone().applyEuler(rotationOffset));

      // Smoothly interpolate the camera position towards the desired position
      camera.position.lerp(desiredPosition, 0.1);

      // Handle gamepad input to adjust camera rotation
      handleGamepadInput();

      // Adjust the rotation offset based on right stick input
      const rotationSpeed = 0.05;
      rotationOffset.y -= rightStickX * rotationSpeed;
      rotationOffset.x -= rightStickY * rotationSpeed;

      // Make the camera look at the car
      camera.lookAt(carPosition);
    }
  });

  return <group ref={cameraRef} />;
};

export default FollowCamera;