import React, { useRef, useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface CarModelProps {
    modelPath: string;
}

const ModalCarModel: React.FC<CarModelProps> = ({ modelPath }) => {

    const { scene } = useGLTF(modelPath);
    const [isLoading, setIsLoading] = useState(true);
    const carRef = useRef<THREE.Group>(null);

    const [dragging, setDragging] = useState(false);
    const [initialMousePosition, setInitialMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [initialRotation, setInitialRotation] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    useEffect(() => {
        setIsLoading(true);
        setInitialMousePosition({ x: 0, y: 0 });
        setInitialRotation({ x: 0, y: 0 });
        if (scene) {
            // Compute the bounding box of the model
            const box = new THREE.Box3().setFromObject(scene);
            const size = new THREE.Vector3();
            box.getSize(size);

            // Compute a uniform scale factor to normalize the model size
            const maxDimension = Math.max(size.x, size.y, size.z);
            const scale = 5 / maxDimension; // Adjust the scale factor as needed

            scene.scale.set(scale, scale, scale);
        }
        setIsLoading(false);
    }, [scene]);

    const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
        setDragging(true);
        setInitialMousePosition({ x: event.clientX, y: event.clientY });
        if (carRef.current) {
            setInitialRotation({ x: carRef.current.rotation.x, y: carRef.current.rotation.y });
        }
    };

    const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
        if (dragging && carRef.current) {
            const deltaX = (event.clientX - initialMousePosition.x) / 200;
            const deltaY = (event.clientY - initialMousePosition.y) / 200;
            carRef.current.rotation.y = initialRotation.y + deltaX;
            carRef.current.rotation.x = initialRotation.x + deltaY;
        }
    };

    const handlePointerUp = () => {
        setDragging(false);
    };

    useFrame(() => {
        // Additional frame updates if needed
    });

    return isLoading ? <>Loading</> : (
        <group
            ref={carRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            scale={[.5, 0.5, 0.5]}
        >   
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <directionalLight position={[-10, -10, -5]} intensity={1} />
            <primitive object={scene}  />
        </group>
    );
};

export default ModalCarModel;