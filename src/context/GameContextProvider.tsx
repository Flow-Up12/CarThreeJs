import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';

interface GameContextProviderType {
   // path to the car model
  car: string;
  setCar: React.Dispatch<React.SetStateAction<string>>;
  isLoading?: boolean;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
}

export const GameContext = createContext<GameContextProviderType>({
  car: '/ferrari/scene.gltf',
  setCar: () => {},
  score: 0,
  setScore: () => {}
});

export const useGameContext = () => useContext(GameContext);

const GameContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [car, setCar] = useState<string>('/ferrari/scene.gltf');
  const [score, setScore] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, [car]);
  return (
    <GameContext.Provider value={{ 
      car, 
      setCar, 
      isLoading,
      score,
      setScore
    }}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContextProvider;