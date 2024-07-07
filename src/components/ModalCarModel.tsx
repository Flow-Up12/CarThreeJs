import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface CarModelProps {
    modelPath: string;
}

const ModalCarModel: React.FC<CarModelProps> = ({ modelPath }) => {
    const { scene } = useGLTF(modelPath);
    const carRef = useRef<THREE.Group>(null);

    const determineScale = (modelPath: string) => {
        switch (modelPath) {
            case '/ferrari/scene.gltf':
                return new THREE.Vector3(1.5, 2, 2);
            case '/black_ferrari/scene.gltf':
                return new THREE.Vector3(2, 2, 2);
            case '/nissan_gtr/scene.gltf':
                return new THREE.Vector3(1.5, 2, 2);
            default:
                return new THREE.Vector3(0.2, 0.2, 0.2);
        }
    };

    // reset position and rotation of the car model when the model path changes

    useEffect(() => {
        if (carRef.current) {
            carRef.current.position.set(0, 0, 0);
            carRef.current.rotation.set(0, 0, 0);
        }
    }, [modelPath]);

    useEffect(() => {
        if (scene) {
            // Compute the bounding box of the model
            const box = new THREE.Box3().setFromObject(scene);
            const size = new THREE.Vector3();
            box.getSize(size);

            // Get scale based on model path
            const scale = determineScale(modelPath);

            // Apply scale
            scene.scale.set(scale.x, scale.y, scale.z);

            scene.rotation.y = Math.PI / 2; // Rotate 90 degrees around the y-axis


            // Center the model
            const center = new THREE.Vector3();
            box.getCenter(center);
            scene.position.sub(center);
        }
    }, [scene, modelPath]);

    return (
        <group ref={carRef} >
            <primitive object={scene} />
        </group>
    );
};

export default ModalCarModel;