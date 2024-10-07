import { useProgress } from '@react-three/drei';
import React, { createContext, useState, ReactNode, useContext } from 'react';

interface GameContextProviderType {
  car: string;
  setCar: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  inputType: "keyboard" | "controller";
  setInputType: React.Dispatch<React.SetStateAction<"keyboard" | "controller">>;
  framesPerSecond: number;
  setFramesPerSecond: React.Dispatch<React.SetStateAction<number>>;
  progress: number;
}

export const GameContext = createContext<GameContextProviderType>({
  car: '/ferrari/scene.gltf',
  setCar: () => {},
  isLoading: false,
  setIsLoading: () => {},
  score: 0,
  setScore: () => {},
  inputType: "keyboard",
  setInputType: () => {},
  framesPerSecond: 0,
  setFramesPerSecond: () => {},
  progress: 0,
});

// eslint-disable-next-line react-refresh/only-export-components
export const useGameContext = () => useContext(GameContext);

const GameContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [car, setCar] = useState<string>('/ferrari/scene.gltf');
  const [score, setScore] = useState<number>(0);
  const [inputType, setInputType] = useState<"keyboard" | "controller">("controller");
  const [framesPerSecond, setFramesPerSecond] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);


  const { progress } = useProgress(); // Track loading progress


  return (
    <GameContext.Provider value={{ 
      car, 
      setCar, 
      isLoading,
      setIsLoading,
      score,
      setScore,
      inputType,
      setInputType,
      framesPerSecond,
      setFramesPerSecond,
      progress
    }}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContextProvider;
