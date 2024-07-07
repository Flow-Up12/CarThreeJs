import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';

interface GameContextProviderType {
   // path to the car model
  car: string;
  setCar: React.Dispatch<React.SetStateAction<string>>;
  isLoading?: boolean;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  inputType: "keyboard" | "controller";
  setInputType: React.Dispatch<React.SetStateAction<"keyboard" | "controller">>;
  framesPerSecond: number;
  setFramesPerSecond: React.Dispatch<React.SetStateAction<number>>;
}

export const GameContext = createContext<GameContextProviderType>({
  car: '/ferrari/scene.gltf',
  setCar: () => {},
  score: 0,
  setScore: () => {},
  inputType: "keyboard",
  setInputType: () => {},
  framesPerSecond: 0,
  setFramesPerSecond: () => {},
});

export const useGameContext = () => useContext(GameContext);

const GameContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [car, setCar] = useState<string>('/ferrari/scene.gltf');
  const [score, setScore] = useState<number>(0);
  const [inputType, setInputType] = useState<"keyboard" | "controller">("controller");
  const [framesPerSecond, setFramesPerSecond] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, [car, inputType]);
  
  return (
    <GameContext.Provider value={{ 
      car, 
      setCar, 
      isLoading,
      score,
      setScore,
      inputType,
      setInputType,
      framesPerSecond,
      setFramesPerSecond
    }}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContextProvider;