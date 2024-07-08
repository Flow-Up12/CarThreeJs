import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import BoostParticles from './BoostParticles';
import CarModel from './CarModel';
import { useGameContext } from '../context/GameContextProvider';
import { useSpring, animated } from '@react-spring/three';

interface CarProps {
  position: [number, number, number];
  rotation: [number, number, number];
  setPosition: React.Dispatch<React.SetStateAction<[number, number, number]>>;
  setRotation: React.Dispatch<React.SetStateAction<[number, number, number]>>;
  carRef: React.MutableRefObject<THREE.Group | null>;
  terrainRef: React.MutableRefObject<THREE.Mesh | null>;
}

const ControllerCar: React.FC<CarProps> = ({ position, rotation, setRotation, carRef, terrainRef }) => {
  const normalSpeed = 2;
  const boostSpeed = 4;
  const rotationSpeed = 0.05;
  const airRotationSpeed = 0.05;
  const gravity = 1;
  const jumpForce = 60;
  const flipForce = 20; // Reduced force applied during flip for more control
  const boostDecay = 0.02;
  const [boosting, setBoosting] = useState(false);
  const [jumping, setJumping] = useState(false);
  const [inAir, setInAir] = useState(false);
  const [canDoubleJump, setCanDoubleJump] = useState(false);
  const [flipping, setFlipping] = useState(false); // State to handle flip
  const raycaster = useRef(new THREE.Raycaster());
  const { car, setFramesPerSecond } = useGameContext();

  const [boostCounter, setBoostCounter] = useState(0);
  const [{ x, y, z }, api] = useSpring(() => ({
    x: position[0],
    y: position[1],
    z: position[2],
  }));

  // Add velocity state
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const flipVelocity = useRef(new THREE.Vector3(0, 0, 0));

  let animationFrameId: number;

  useEffect(() => {
    const handleGamepadInput = () => {
      const gamepads = navigator.getGamepads();
      const gp = gamepads[0];

      if (gp) {
        const { axes, buttons } = gp;
        const [leftStickX, leftStickY] = axes;
        const accelerateButtonPressed = buttons[7].value; // Right trigger (R2)
        const brakeButtonPressed = buttons[6].value; // Left trigger (L2)
        const boostButtonPressed = buttons[5].pressed; // Right bumper (R1)
        const jumpButtonPressed = buttons[0].pressed; // X button
        const leftBumperPressed = buttons[4].pressed; // Left bumper (L1)

        const speed = boosting ? boostSpeed : normalSpeed;

        if (!inAir) {
          // Ground controls
          if (accelerateButtonPressed > 0.1) {
            api.start({
              x: x.get() + accelerateButtonPressed * speed * Math.sin(rotation[1]),
              z: z.get() + accelerateButtonPressed * speed * Math.cos(rotation[1]),
            });
          }
          if (brakeButtonPressed > 0.1) {
            api.start({
              x: x.get() - brakeButtonPressed * speed * Math.sin(rotation[1]),
              z: z.get() - brakeButtonPressed * speed * Math.cos(rotation[1]),
            });
          }
          if (Math.abs(leftStickX) > 0.1) {
            setRotation(([x, y, z]) => [x, y - leftStickX * rotationSpeed, z]);
          }
        } else {
          // Air controls
          const quaternion = new THREE.Quaternion();
          const euler = new THREE.Euler(rotation[0], rotation[1], rotation[2], 'YXZ');

          if (Math.abs(leftStickX) > 0.1 && !leftBumperPressed) {
            euler.y -= leftStickX * airRotationSpeed;
          }
          if (Math.abs(leftStickY) > 0.1 && !leftBumperPressed) {
            euler.x += leftStickY * airRotationSpeed;
          }
          if (leftBumperPressed) {
            if (Math.abs(leftStickX) > 0.1 || Math.abs(leftStickY) > 0.1) {
              euler.z += leftStickX * airRotationSpeed;
              euler.x += leftStickY * airRotationSpeed;
            }
          }

          quaternion.setFromEuler(euler);
          setRotation([euler.x, euler.y, euler.z]);
        }

        // Handle boosting
        if (boostButtonPressed) {
          setBoosting(true);
        } else {
          setBoosting(false);
        }

        // Handle jumping and flipping
        if (jumpButtonPressed && !jumping) {
          if (!inAir) {
            setJumping(true);
            setInAir(true);
            setCanDoubleJump(true);
            api.start({ y: y.get() + jumpForce });
          } else if (canDoubleJump && !flipping) {
            setCanDoubleJump(false);
            setFlipping(true);
            if (Math.abs(leftStickX) > 0.1 || Math.abs(leftStickY) > 0.1) {
              // Apply flip rotation based on left stick direction
              const flipDirection = new THREE.Vector3(leftStickX, 0, leftStickY).normalize().multiplyScalar(flipForce);
              flipVelocity.current.copy(flipDirection); // Apply flip direction to velocity
              setRotation(([x, y, z]) => [x + leftStickY * Math.PI / 10, y + leftStickX * Math.PI / 2, z]); // Slow down the rotation
            } else {
              // Regular jump without flip
              api.start({ y: y.get() + jumpForce });
            }
            setTimeout(() => {
              setFlipping(false);
              // setRotation([0, rotation[1], 0]); // Reset to flat rotation
            }, 500); // Extend the flipping duration
          }
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
  }, [rotation, boosting, jumping, inAir, canDoubleJump, flipping, api, x, y, z]);

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
    api.start(() => {
      const newY = y.get() - gravity;
      const terrainHeight = getTerrainHeight(x.get(), z.get());
      if (newY <= terrainHeight + 0.5) {
        setInAir(false);
        return { y: Math.max(newY, terrainHeight + 0.5) };
      } else {
        setInAir(true);
        return { y: newY };
      }
    });

    // Apply flip velocity
    if (flipping) {
      api.start({
        x: x.get() + flipVelocity.current.x,
        y: y.get() + flipVelocity.current.y,
        z: z.get() + flipVelocity.current.z,
      });
      // Apply damping to gradually reduce flip velocity
      flipVelocity.current.multiplyScalar(0.9);
    }

    if (boosting) {
      const forwardVector = new THREE.Vector3();
      if (carRef.current) {
        carRef.current.getWorldDirection(forwardVector);
      }
      api.start(() => ({
        x: x.get() + forwardVector.x * boostSpeed,
        y: y.get() + (inAir ? forwardVector.y * boostSpeed : 0),
        z: z.get() + forwardVector.z * boostSpeed,
      }));
      setBoostCounter((prev) => prev - boostDecay);
      if (boostCounter <= 0) {
        setBoosting(false);
      }
    }

    if (carRef.current) {
      carRef.current.position.set(x.get(), y.get(), z.get());
      carRef.current.rotation.set(rotation[0], rotation[1], rotation[2]);
    }
  });

  let frameCount = 0;
  let lastTime = performance.now();
  
  useFrame(() => {
    const currentTime = performance.now();
    frameCount++;
    if (currentTime > lastTime + 1000) {
      setFramesPerSecond(Math.round((frameCount * 1000) / (currentTime - lastTime)));
      frameCount = 0;
      lastTime = currentTime;
    }
  });

  return (
    <animated.group ref={carRef} position={[x.get(), y.get(), z.get()]} rotation={rotation as [number, number, number]}>
      <CarModel modelPath={car} />
      {boosting && <BoostParticles />}
    </animated.group>
  );
};

export default ControllerCar;