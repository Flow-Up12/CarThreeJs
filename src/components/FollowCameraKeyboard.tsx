import React, { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface FollowCameraProps {
  carRef: React.MutableRefObject<THREE.Group | null>;
}

const FollowCameraKeyboard: React.FC<FollowCameraProps> = ({ carRef }) => {
  const { camera } = useThree();

  // Camera offset relative to the car
  const cameraOffset = new THREE.Vector3(-3, 1, 15); // Higher and farther behind
  const smoothFactor = 0.1; // Interpolation speed for smooth transitions
  const rotationOffset = useRef(new THREE.Euler(0, 0, 0)); // Stores mouse-induced rotation
  const isDragging = useRef(false); // Tracks whether the left mouse button is held
  const mouseDelta = useRef({ x: 0, y: 0 }); // Tracks mouse movement

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (event.button === 0) isDragging.current = true; // Left-click starts dragging
    };

    const handleMouseUp = () => {
      isDragging.current = false; // Stop dragging
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging.current) {
        mouseDelta.current.x += event.movementX * 0.005; // Adjust sensitivity
        mouseDelta.current.y += event.movementY * 0.005;
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useFrame(() => {
    if (carRef.current) {
      const carPosition = new THREE.Vector3();
      carRef.current.getWorldPosition(carPosition);

      const carQuaternion = carRef.current.quaternion;

      // Apply camera offset and mouse-induced rotation
      const offset = cameraOffset.clone().applyQuaternion(carQuaternion);

      // Adjust rotation offset based on mouse input when dragging
      if (isDragging.current) {
        rotationOffset.current.y -= mouseDelta.current.x; // Horizontal rotation
        rotationOffset.current.x = THREE.MathUtils.clamp(
          rotationOffset.current.x - mouseDelta.current.y, // Vertical rotation
          -Math.PI / 4,
          Math.PI / 4
        );

        // Reset mouse delta
        mouseDelta.current.x = 0;
        mouseDelta.current.y = 0;
      } else {
        // Smoothly return to default rotation behind the car
        rotationOffset.current.x = THREE.MathUtils.lerp(rotationOffset.current.x, 0, smoothFactor);
        rotationOffset.current.y = THREE.MathUtils.lerp(rotationOffset.current.y, 0, smoothFactor);
      }

      // Apply rotation offset to the camera offset
      const rotatedOffset = offset.applyEuler(rotationOffset.current);

      // Calculate desired camera position
      const desiredPosition = carPosition.clone().add(rotatedOffset);

      // Smoothly interpolate the camera position
      camera.position.lerp(desiredPosition, smoothFactor);

      // Make the camera look at the car
      camera.lookAt(carPosition);
    }
  });

  return null;
};

export default FollowCameraKeyboard;