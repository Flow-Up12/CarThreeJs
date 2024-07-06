import React, { createContext, useState, ReactNode, useContext } from 'react';

interface PortfolioContextType {
  panels: string[];
  setPanels: React.Dispatch<React.SetStateAction<string[]>>;
}

export const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const usePortfolioContext = () => useContext(PortfolioContext);

const PortfolioContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [panels, setPanels] = useState<string[]>(['Home Page']);

  return (
    <PortfolioContext.Provider value={{ panels, setPanels }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export default PortfolioContextProvider;