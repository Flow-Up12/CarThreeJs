import React from "react";
import "./App.css";
import Header from "./components/Header";
import  {
  useGameContext,
} from "./context/GameContextProvider";
import ThreeDModel from "./components/TreeDModel";
import StartScreen from "./screens/StartScreen";
import LoadingScreen from "./screens/LoadingScreen";
import BoostBar from "./components/BoostBar";

const CarGame: React.FC = () => {
  const { isLoading, progress} = useGameContext();

  return (
    <div>
      {isLoading && <StartScreen />}
      {progress < 100 && <LoadingScreen />}
      {/* Add any loading animation or spinner here */}

      {!isLoading && (
        <div className="App">
          <Header />
          <BoostBar />
          <main className="App-main">
            <ThreeDModel />
          </main>
        </div>
      )}
    </div>
  );
};

export default CarGame;
