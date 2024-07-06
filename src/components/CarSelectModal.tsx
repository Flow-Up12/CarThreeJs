
import React, { Suspense, useState } from 'react';
import { useGameContext } from '../context/GameContextProvider';
import { Canvas } from '@react-three/fiber';
import ModalCarModel from './ModalCarModel';

const carModels = [
  { id: 1, name: 'Ferrari Enzo', modelPath: '/ferrari/scene.gltf' },
  { id: 2, name: 'Lamborghini Aventador', modelPath: '/fennec/scene.gltf' },
  { id: 3, name: 'Porsche 911', modelPath: '/nissan_gtr/scene.gltf' },
];

interface CarSelectModalProps {
  closeModal: () => void;
}

const CarSelectModal: React.FC<CarSelectModalProps> = ({ closeModal }) => {
  const { setCar } = useGameContext();
  const [selectedCarIndex, setSelectedCarIndex] = useState(0);

  const handleCarChange = (direction: 'left' | 'right') => {
    setSelectedCarIndex((prevIndex) => {
      if (direction === 'left') {
        return prevIndex === 0 ? carModels.length - 1 : prevIndex - 1;
      } else {
        return prevIndex === carModels.length - 1 ? 0 : prevIndex + 1;
      }
    });
  };

  const handleSelectCar = () => {
    setCar(carModels[selectedCarIndex].modelPath);
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-8/12">
        <h2 className="text-2xl font-bold mb-4 text-center">Select Your Car</h2>
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => handleCarChange('left')} className="text-2xl">{'<'}</button>
          <div className="flex flex-col items-center w-full">
            <Canvas>
              <Suspense fallback={null}>
                <ModalCarModel modelPath={carModels[selectedCarIndex].modelPath} />
              </Suspense>
            </Canvas>
            <span className="mt-2 text-black">{carModels[selectedCarIndex].name}</span>
          </div>
          <button onClick={() => handleCarChange('right')} className="text-2xl">{'>'}</button>
        </div>
        <button
          onClick={handleSelectCar}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
        >
          Select
        </button>
        <button
          onClick={closeModal}
          className="mt-4 text-blue-600 w-full"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CarSelectModal;