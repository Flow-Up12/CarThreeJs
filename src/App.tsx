import React, { useState } from 'react';
import './App.css';
import ThreeDModel from './components/TreeDModel';

const App: React.FC = () => {
  const [score, setScore] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-4xl font-bold">Car Game</h1>
        <div className="scoreboard">
          <p>Score: {score}</p>
          {/* ADD a menue to select a car model create a menue where you click 
          through the different car models and select the one you want to useya */}
        </div>
      </header>
      <main className="App-main">
        <ThreeDModel setScore={setScore} />
      </main>
    </div>
  );
};

export default App;