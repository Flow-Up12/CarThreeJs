import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import BoostParticles from './BoostParticles';
import CarModel from './CarModel';
import { useGameContext } from '../context/GameContextProvider';

interface CarProps {
  position: [number, number, number];
  rotation: [number, number, number];
  setPosition: React.Dispatch<React.SetStateAction<[number, number, number]>>;
  setRotation: React.Dispatch<React.SetStateAction<[number, number, number]>>;
  carRef: React.MutableRefObject<THREE.Group | null>;
  terrainRef: React.MutableRefObject<THREE.Mesh | null>;
}

const ControllerCar: React.FC<CarProps> = ({ position, rotation, setPosition, setRotation, carRef, terrainRef }) => {
  const normalSpeed = 0.2;
  const boostSpeed = 1;
  const rotationSpeed = 0.05;
  const airRotationSpeed = 0.1;
  const gravity = 0.1;
  const jumpForce = 1.0;
  const boostDecay = 0.02;
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const [boosting, setBoosting] = useState(false);
  const [jumping, setJumping] = useState(false);
  const [inAir, setInAir] = useState(false);
  const raycaster = useRef(new THREE.Raycaster());
  const { car } = useGameContext();

  const [boostCounter, setBoostCounter] = useState(0);

  let animationFrameId: number;

  useEffect(() => {
    const handleGamepadInput = () => {
      const gamepads = navigator.getGamepads();
      const gp = gamepads[0];

      if (gp) {
        const { axes, buttons } = gp;
        const [leftStickX, leftStickY] = axes;
        const boostButtonPressed = buttons[7].pressed; // Right bumper (R1)
        const jumpButtonPressed = buttons[0].pressed; // X button
        const airControlButtonPressed = buttons[6].pressed; // Left bumper (L1)

        const speed = boosting ? boostSpeed : normalSpeed;

        if (!inAir) {
          // Ground controls
          if (Math.abs(leftStickY) > 0.1) {
            setPosition(([x, y, z]) => [
              x + leftStickY * speed * Math.sin(rotation[1]),
              y,
              z + leftStickY * speed * Math.cos(rotation[1]),
            ]);
          }
          if (Math.abs(leftStickX) > 0.1) {
            setRotation(([x, y, z]) => [x, y - leftStickX * rotationSpeed, z]);
          }
        } else if (airControlButtonPressed) {
          // Air controls
          if (Math.abs(leftStickX) > 0.1 || Math.abs(leftStickY) > 0.1) {
            setRotation(([x, y, z]) => [
              x + leftStickY * airRotationSpeed,
              y - leftStickX * airRotationSpeed,
              z
            ]);
          }
        }

        // Handle boosting
        if (boostButtonPressed) {
          setBoosting(true);
        } else {
          setBoosting(false);
        }

        // Handle jumping
        if (jumpButtonPressed && !jumping) {
          setJumping(true);
          setPosition(([x, y, z]) => [x, y + jumpForce, z]);
          setInAir(true);
        }

        if (!jumpButtonPressed && jumping) {
          setJumping(false);
        }
      }

      animationFrameId = requestAnimationFrame(handleGamepadInput);
    };

    // Start the gamepad input handling
    animationFrameId = requestAnimationFrame(handleGamepadInput);

    // Cleanup function to cancel animation frame
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [rotation, setPosition, setRotation, boosting, jumping, inAir]);

  const getTerrainHeight = (x: number, z: number): number => {
    if (!terrainRef.current) return 0;

    const origin = new THREE.Vector3(x, 50, z);
    const direction = new THREE.Vector3(0, -1, 0);
    raycaster.current.set(origin, direction);

    const intersects = raycaster.current.intersectObject(terrainRef.current);
    if (intersects.length > 0) {
      return intersects[0].point.y;
    }

    return 0;
  };

  useFrame(() => {
    setPosition(([x, y, z]) => {
      const newY = y - gravity;
      const terrainHeight = getTerrainHeight(x, z);
      if (newY <= terrainHeight + 0.5) {
        setInAir(false);
        return [x, Math.max(newY, terrainHeight + 0.5), z];
      } else {
        setInAir(true);
        return [x, newY, z];
      }
    });

    if (boosting && inAir) {
      setPosition(([x, y, z]) => [x + Math.sin(rotation[1]) * boostSpeed, y, z + Math.cos(rotation[1]) * boostSpeed]);
      setBoostCounter(boostCounter - boostDecay);
      if (boostCounter <= 0) {
        setBoosting(false);
      }
    }

    if (carRef.current) {
      carRef.current.position.set(position[0], position[1], position[2]);
      carRef.current.rotation.set(rotation[0], rotation[1], rotation[2]);
    }
  });

  return (
    <group ref={carRef} position={position as [number, number, number]} rotation={rotation as [number, number, number]}>
      <CarModel modelPath={car} />
      {boosting && <BoostParticles />}
    </group>
  );
};

export default ControllerCar;