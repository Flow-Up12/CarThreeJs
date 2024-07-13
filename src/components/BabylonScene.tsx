import React, { useEffect, useRef } from 'react';
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, SceneLoader } from '@babylonjs/core';
import '@babylonjs/loaders';

const BabylonScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const carRef = useRef<any>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const engine = new Engine(canvasRef.current, true);
      const scene = new Scene(engine);

      const camera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 4, 10, Vector3.Zero(), scene);
      camera.attachControl(canvasRef.current, true);

      const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);

      const ground = MeshBuilder.CreateGround("ground", { width: 50, height: 50 }, scene);

      // Load the Ferrari model
      SceneLoader.ImportMesh("", "/", "ferrari_enzo.glb", scene, (meshes) => {
        const car = meshes[0];
        carRef.current = car;
        car.scaling = new Vector3(0.5, 0.5, 0.5);
        car.position.y = 1;
        car.rotation = new Vector3(0, Math.PI, 0);
      });

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
        }
        scene.render();
      });

      return () => {
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
        engine.dispose();
      };
    }
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export default BabylonScene;