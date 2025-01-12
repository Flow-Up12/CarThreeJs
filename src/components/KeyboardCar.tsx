import React, { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import BoostParticles from "./BoostParticles";
import CarModel from "./CarModel";
import { useGameContext } from "../context/GameContextProvider";
import FollowCameraKeyboard from "./FollowCameraKeyboard";

interface CarProps {
  carRef: React.MutableRefObject<THREE.Group | null>;
  terrainRef?: React.MutableRefObject<THREE.Mesh | null>;
}

const RocketLeagueCar: React.FC<CarProps> = ({ carRef, terrainRef }) => {
  const normalSpeed = 0.08; // Reduced for better control
  const boostSpeed = 0.3; // Reduced boost speed
  const maxSpeed = 0.8; // Cap for maximum speed
  const rotationSpeed = 0.04;
  const airRotationSpeed = 0.03;
  const gravity = 0.01; // Reduced gravity for smoother descent
  const jumpForce = 1;
  const boostDecay = 0.5;
  const selfLevelingSpeed = 0.1; // Speed at which the car self-levels

  const [position, setPosition] = useState<[number, number, number]>([
    0, 0.5, 0,
  ]);
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [boosting, setBoosting] = useState(false);
  const [flying, setFlying] = useState(false);
  const [canDoubleJump, setCanDoubleJump] = useState(true);

  const keysPressed = useRef<Set<string>>(new Set());
  const velocity = useRef(new THREE.Vector3());
  const angularVelocity = useRef(new THREE.Vector3());
  const raycaster = useRef(new THREE.Raycaster());

  const { car, boostMeter, setBoostMeter } = useGameContext();

  // Handle Key Presses

  // Terrain Height Detection
  const getTerrainHeight = (x: number, z: number): number => {
    if (!terrainRef?.current) return 0;

    const origin = new THREE.Vector3(x, 50, z);
    const direction = new THREE.Vector3(0, -1, 0);
    raycaster.current.set(origin, direction);

    const intersects = raycaster.current.intersectObject(terrainRef.current);
    if (intersects.length > 0) {
      return intersects[0].point.y;
    }

    return 0;
  };

  // Self-Leveling Logic
  const applySelfLeveling = (currentRotation: [number, number, number]) => {
    const [pitch, yaw, roll] = currentRotation;

    // Interpolate pitch and roll to zero (neutral position)
    const newPitch = THREE.MathUtils.lerp(pitch, 0, selfLevelingSpeed);
    const newRoll = THREE.MathUtils.lerp(roll, 0, selfLevelingSpeed);

    return [newPitch, yaw, newRoll] as [number, number, number];
  };

  useEffect(() => {
    // State to track pressed keys
    const keyState = keysPressed.current;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent duplicate state updates
      if (!keyState.has(event.key)) {
        keyState.add(event.key);

        if (event.key === " " && !flying) {
          // Jump mechanics
          velocity.current.y = jumpForce;
          setFlying(true);
          setCanDoubleJump(true);
        } else if (event.key === " " && flying && canDoubleJump) {
          // Double jump
          setCanDoubleJump(false);
          velocity.current.add(new THREE.Vector3(0, jumpForce, 0));
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      // Remove key state when key is released
      keyState.delete(event.key);

      if (event.key === "Shift") {
        keyState.delete(event.key);
        setBoosting(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [boostMeter, canDoubleJump, flying]);

  // Update Car Position and Rotation
  useFrame(() => {
    const terrainHeight = getTerrainHeight(position[0], position[2]);
    const speed = boosting ? boostSpeed : normalSpeed;

    console.log(keysPressed.current);

    // Forward/Backward Movement
    if (keysPressed.current.has("w")) {
      const forward = new THREE.Vector3(0, 0, -1);
      forward.applyQuaternion(carRef.current!.quaternion); // Transform to car's local forward
      velocity.current.add(forward.multiplyScalar(speed));
    }
    if (keysPressed.current.has("s")) {
      const backward = new THREE.Vector3(0, 0, 1);
      backward.applyQuaternion(carRef.current!.quaternion); // Transform to car's local backward
      velocity.current.add(backward.multiplyScalar(speed));
    }

    if (keysPressed.current.has("Shift")) {
      setBoosting(true);
    }

    // Limit Speed
    velocity.current.clampLength(0, maxSpeed);

    // Rotation
    if (keysPressed.current.has("a") ) {
      angularVelocity.current.y = rotationSpeed;
    }
    if (keysPressed.current.has("d")) {
      angularVelocity.current.y = -rotationSpeed;
    }

    // Air Control
    if (flying) {
      if (keysPressed.current.has("ArrowUp")) {
        angularVelocity.current.x = -airRotationSpeed; // Pitch Up
      }
      if (keysPressed.current.has("ArrowDown")) {
        angularVelocity.current.x = airRotationSpeed; // Pitch Down
      }
      if (keysPressed.current.has("ArrowLeft")) {
        angularVelocity.current.z = airRotationSpeed; // Roll Left
      }
      if (keysPressed.current.has("ArrowRight")) {
        angularVelocity.current.z = -airRotationSpeed; // Roll Right
      }
    }

    // Boosting Mechanics
    if (boosting && boostMeter > 0) {
      const forward = new THREE.Vector3(0, 0, -1);
      forward.applyQuaternion(carRef.current!.quaternion); // Transform to car's local forward
      velocity.current.add(forward.multiplyScalar(boostSpeed * 0.5));
      setBoostMeter((prev) => Math.max(0, prev - boostDecay));
    } else if (boostMeter < 100) {
      setBoostMeter((prev) => Math.min(100, prev + 0));
    }

    // Apply Gravity
    velocity.current.y -= gravity;

    // Prevent falling below terrain and apply self-leveling before landing
    if (position[1] + velocity.current.y <= terrainHeight + 0.5) {
      velocity.current.y = 0;
      setFlying(false);
      setRotation((currentRotation) => applySelfLeveling(currentRotation));
    }

    // Update Position
    setPosition(([x, y, z]) => [
      x + velocity.current.x,
      Math.max(y + velocity.current.y, terrainHeight + 0.5),
      z + velocity.current.z,
    ]);

    // Update Rotation
    setRotation(([x, y, z]) => [
      x + angularVelocity.current.x,
      y + angularVelocity.current.y,
      z + angularVelocity.current.z,
    ]);

    // Sync with Three.js
    if (carRef.current) {
      carRef.current.position.set(position[0], position[1], position[2]);
      carRef.current.rotation.set(rotation[0], rotation[1], rotation[2]);
    }

    // Apply Damping
    velocity.current.multiplyScalar(0.9); // Increased damping for smoother control
    angularVelocity.current.multiplyScalar(0.85);
  });

  return (
    <group
      ref={carRef}
      position={position as [number, number, number]}
      rotation={rotation as [number, number, number]}
    >
      <CarModel modelPath={car} />
      <BoostParticles visible={boosting} />
      <FollowCameraKeyboard carRef={carRef} />
    </group>
  );
};

export default RocketLeagueCar;
