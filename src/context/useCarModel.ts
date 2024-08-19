import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

export const useCarModel = (path: string) => {
  const gltf = useLoader(GLTFLoader, path);
  return gltf;
};