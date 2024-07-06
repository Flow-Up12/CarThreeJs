import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { ImprovedNoise } from 'three/examples/jsm/Addons.js';

const Terrain: React.FC = () => {
  const terrainWidth = 100;
  const terrainHeight = 100;
  const terrainDepth = 10;
  const segments = 128;

  const texture = useLoader(THREE.TextureLoader, '/grass.jpg'); // Replace with your texture path

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(terrainWidth, terrainHeight, segments, segments);
    const vertices = geo.attributes.position.array as Float32Array;
    const noise = new ImprovedNoise();

    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i] / terrainWidth;
      const y = vertices[i + 1] / terrainHeight;
      vertices[i + 2] = noise.noise(x * 5, y * 5, 0) * terrainDepth;
    }

    geo.attributes.position.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, [terrainWidth, terrainHeight, segments, terrainDepth]);

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(terrainWidth / 10, terrainHeight / 10);

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
      <meshStandardMaterial map={texture} color="#00ff00" />
    </mesh>
  );
};

export default Terrain;