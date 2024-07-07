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
}

export const GameContext = createContext<GameContextProviderType>({
  car: '/ferrari/scene.gltf',
  setCar: () => {},
  score: 0,
  setScore: () => {},
  inputType: "keyboard",
  setInputType: () => {}
});

export const useGameContext = () => useContext(GameContext);

const GameContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [car, setCar] = useState<string>('/ferrari/scene.gltf');
  const [score, setScore] = useState<number>(0);
  const [inputType, setInputType] = useState<"keyboard" | "controller">("keyboard");

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
      setInputType
    }}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContextProvider;