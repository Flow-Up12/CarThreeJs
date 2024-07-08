import { useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

export const Ball: React.FC<{ position: [number, number, number], carRef: React.MutableRefObject<THREE.Group | null> }> = ({ position, carRef }) => {
  const ballRef = useRef<THREE.Mesh>(null);
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const ballRadius = 5; // Ball radius
  const gravity = new THREE.Vector3(0, -0.005, 0); // Gravity

  // To store the previous position of the car for velocity calculation
  const prevCarPosition = useRef(new THREE.Vector3());

  useFrame(() => {
    if (ballRef.current && carRef.current) {
      // Ball physics
      const ballPosition = new THREE.Vector3();
      ballRef.current.getWorldPosition(ballPosition);

      const carPosition = new THREE.Vector3();
      carRef.current.getWorldPosition(carPosition);

      // Calculate car's velocity
      const carVelocity = new THREE.Vector3().subVectors(carPosition, prevCarPosition.current);
      prevCarPosition.current.copy(carPosition); // Update the previous position

      const distance = ballPosition.distanceTo(carPosition);
      const collisionDistance = ballRadius + 1.5;

      // Simple collision detection and response
      if (distance < collisionDistance && ballPosition.y > carPosition.y + ballRadius - 1) { // Ensure ball is above car
        const direction = new THREE.Vector3().subVectors(ballPosition, carPosition).normalize();
        const impactForce = direction.multiplyScalar(0.3); // Adjust the force for a more realistic impact
        impactForce.add(carVelocity.multiplyScalar(0.5)); // Incorporate car's velocity into the impact force
        impactForce.y += 0.3; // Add upward force to make the ball come off the ground
        velocity.current.add(impactForce); // Apply the impact force to the ball's velocity

        // Ensure the ball does not overlap with the car
        const penetrationDepth = collisionDistance - distance;
        ballPosition.add(direction.multiplyScalar(penetrationDepth));
      }

      // Apply gravity
      velocity.current.add(gravity);

      // Simple friction
      velocity.current.multiplyScalar(0.99); // Friction

      // Update the ball's position
      ballPosition.add(velocity.current);

      // Make sure the ball doesn't fall below the terrain
      ballPosition.y = Math.max(ballPosition.y, ballRadius);

      // If the ball is above the car and within balancing range, add a balancing force
      if (ballPosition.y > carPosition.y + ballRadius && ballPosition.y < carPosition.y + ballRadius + 1) {
        const upwardForce = new THREE.Vector3(0, 0.01, 0);
        velocity.current.add(upwardForce);
      }

      ballRef.current.position.copy(ballPosition);
    }
  });

  return (
    <mesh ref={ballRef} position={position}>
      <sphereGeometry args={[ballRadius, 32, 32]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};