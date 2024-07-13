import React, { useEffect, useRef, useState } from 'react';
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, SceneLoader, PointLight } from '@babylonjs/core';
import '@babylonjs/loaders';
import { AdvancedDynamicTexture, Control, StackPanel, TextBlock } from '@babylonjs/gui';

const BabylonScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const carRef = useRef<any>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (canvasRef.current) {
      const engine = new Engine(canvasRef.current, true);
      const scene = new Scene(engine);

      const camera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 4, 10, Vector3.Zero(), scene);
      camera.attachControl(canvasRef.current, true);

      const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);
      const pointLight = new PointLight("pointLight", new Vector3(10, 10, 10), scene);

      const ground = MeshBuilder.CreateGround("ground", { width: 50, height: 50 }, scene);

      // Load the Ferrari model
      SceneLoader.ImportMesh("", "/", "ferrari_enzo.glb", scene, (meshes) => {
        const car = meshes[0];
        carRef.current = car;
        car.scaling = new Vector3(0.5, 0.5, 0.5);
        car.position.y = 1;
        car.rotation = new Vector3(0, Math.PI, 0);
      });

      const generateRandomPositions = (count: number): [number, number, number][] => {
        const positions: [number, number, number][] = [];
        for (let i = 0; i < count; i++) {
          const x = Math.random() * 50 - 25;
          const z = Math.random() * 50 - 25;
          positions.push([x, 0.5, z]);
        }
        return positions;
      };

      const collectibles = generateRandomPositions(100);
      const rings = generateRandomPositions(20);

      collectibles.forEach((position, index) => {
        const collectible = MeshBuilder.CreateSphere(`collectible-${index}`, { diameter: 0.5 }, scene);
        collectible.position = new Vector3(position[0], position[1], position[2]);
      });

      rings.forEach((position, index) => {
        const ring = MeshBuilder.CreateTorus(`ring-${index}`, { diameter: 5, thickness: 0.2 }, scene);
        ring.position = new Vector3(position[0], position[1], position[2]);
      });

      // GUI for score display
      const guiTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
      const scorePanel = new StackPanel();
      scorePanel.width = "220px";
      scorePanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
      scorePanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
      guiTexture.addControl(scorePanel);

      const scoreText = new TextBlock();
      scoreText.text = `Score: ${score}`;
      scoreText.height = "30px";
      scoreText.color = "white";
      scorePanel.addControl(scoreText);

      type KeysType = { w: boolean; a: boolean; s: boolean; d: boolean };

      const keys: KeysType = { w: false, a: false, s: false, d: false };

      const onKeyDown = (event: KeyboardEvent) => {
        if (keys[event.key as keyof KeysType] !== undefined) {
          keys[event.key as keyof KeysType] = true;
        }
      };

      const onKeyUp = (event: KeyboardEvent) => {
        if (keys[event.key as keyof KeysType] !== undefined) {
          keys[event.key as keyof KeysType] = false;
        }
      };

      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);

      engine.runRenderLoop(() => {
        if (carRef.current) {
          const car = carRef.current;
          if (keys.w) {
            car.position.z -= 0.1;
          }
          if (keys.s) {
            car.position.z += 0.1;
          }
          if (keys.a) {
            car.rotation.y -= 0.05;
          }
          if (keys.d) {
            car.rotation.y += 0.05;
          }

          // Update the camera to follow the car
          camera.target = car.position.clone();

          // Check for collectible collisions
          collectibles.forEach((position, index) => {
            const distance = Vector3.Distance(car.position, new Vector3(position[0], position[1], position[2]));
            if (distance < 1) {
              const collectible = scene.getMeshByName(`collectible-${index}`);
              if (collectible) {
                collectible.dispose();
                setScore((prevScore) => prevScore + 1);
                scoreText.text = `Score: ${score + 1}`;
              }
            }
          });

          // Check for ring collisions
          rings.forEach((position, index) => {
            const distance = Vector3.Distance(car.position, new Vector3(position[0], position[1], position[2]));
            if (distance < 5) {
              const ring = scene.getMeshByName(`ring-${index}`);
              if (ring) {
                ring.dispose();
                setScore((prevScore) => prevScore + 5);
                scoreText.text = `Score: ${score + 5}`;
              }
            }
          });
        }
        scene.render();
      });

      return () => {
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
        engine.dispose();
      };
    }
  }, [score]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export default BabylonScene;