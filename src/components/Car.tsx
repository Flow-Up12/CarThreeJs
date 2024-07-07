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

const Car: React.FC<CarProps> = ({ position, rotation, setPosition, setRotation, carRef, terrainRef }) => {
  const normalSpeed = 0.2;
  const boostSpeed = 1;
  const rotationSpeed = 0.05;
  const gravity = .10;
  const flySpeed = 0.3;
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const [boosting, setBoosting] = useState(false);
  const [flying, setFlying] = useState(false);
  const raycaster = useRef(new THREE.Raycaster());

  const { car } = useGameContext();

  // Boost Logic
  const [pressBoostCounter, setPressBoostCounter] = useState(0);

  let pressBoostTimer: number;
  let animationFrameId: number;


  useEffect(() => {

    const handleKeyDown = (event: KeyboardEvent) => {
      keysPressed.current[event.key] = true;
      if (event.key === ' ') {
        setPressBoostCounter((prev) => prev + 1);
        setBoosting(true);

        if (pressBoostCounter === 2) {
          setFlying((prevFlying) => !prevFlying);
          setPressBoostCounter(1); // Reset after toggling flying mode
          clearTimeout(pressBoostTimer); // Clear the timer since double space press was detected
        } else {
          pressBoostTimer = setTimeout(() => {
            setPressBoostCounter(1); // Reset count if no double press within
          }, 500);
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed.current[event.key] = false;
      if (event.key === ' ') {
        setBoosting(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearTimeout(pressBoostTimer);
    };
  }, []);


  useEffect(() => {

    const handleGamepadInput = () => {
      const gamepads = navigator.getGamepads();
      const gp = gamepads[0];

      if (gp) {
        const { axes, buttons } = gp;
        const [leftStickX, leftStickY, rightStickX] = axes;
        const boostButtonPressed = buttons[0].pressed;
        
        const speed = boosting ? boostSpeed : normalSpeed;


        // Map left stick to movement
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

        const handleBoost = (pressed: boolean) => {

          if (pressed) {
            if (!boosting) {

              setBoosting(true);
              console.log('boosting')
              setPressBoostCounter((prev) => prev + 1);
              console.log(pressBoostCounter)

              if (pressBoostCounter === 2) {
                console.log('double press')
                setFlying((prevFlying) => !prevFlying);
                setPressBoostCounter(1); // Reset after toggling flying mode
                clearTimeout(pressBoostTimer); // Clear the timer since double press was detected
              } else {
                pressBoostTimer = setTimeout(() => {
                  setPressBoostCounter(1); // Reset count if no double press within
                }, 1);
              }
            }
          } else {
            if (boosting) {
              setBoosting(false);
            }

            if (flying) {
              console.log('flying')
              setPosition(([x, y, z]) => [x, y + flySpeed, z]);
            } else {
              setPosition(([x, y, z]) => [x, y - gravity, z]);
            }
            
          }

        };
        // Handle boost logic
        handleBoost(boostButtonPressed);
      }



      animationFrameId = requestAnimationFrame(handleGamepadInput);
    };

    // Start the gamepad input handling
    animationFrameId = requestAnimationFrame(handleGamepadInput);

    // Cleanup function to cancel animation frame and clear timeout
    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(pressBoostTimer);
    };
  }, [rotation, setPosition, setRotation, boosting, flying, normalSpeed, rotationSpeed, flySpeed, gravity]);


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
    const speed = boosting ? boostSpeed : normalSpeed;
    if (keysPressed.current['w']) {
      setPosition(([x, y, z]) => [x + speed * Math.sin(rotation[1]), y, z + speed * Math.cos(rotation[1])]);
    }
    if (keysPressed.current['s']) {
      setPosition(([x, y, z]) => [x - speed * Math.sin(rotation[1]), y, z - speed * Math.cos(rotation[1])]);
    }
    if (keysPressed.current['a']) {
      setRotation(([x, y, z]) => [x, y + rotationSpeed, z]);
    }
    if (keysPressed.current['d']) {
      setRotation(([x, y, z]) => [x, y - rotationSpeed, z]);
    }

    if (flying) {
      if (keysPressed.current[' ']) {
        setPosition(([x, y, z]) => [x, y + flySpeed, z]);
      } else {
        setPosition(([x, y, z]) => [x, y - gravity, z]);
      }
    } else {
      setPosition(([x, y, z]) => {
        const newY = y - gravity;
        const terrainHeight = getTerrainHeight(x, z);
        return [x, Math.max(newY, terrainHeight + 0.5), z]; // Ensure the car doesn't fall below the terrain height
      });
    }
  });

  return (
    <group ref={carRef} position={position as [number, number, number]} rotation={rotation as [number, number, number]}>
      <CarModel modelPath={car} />
      {boosting && <BoostParticles />}
    </group>
  );
};

export default Car;