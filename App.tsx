import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { GameProvider } from './contexts/GameContext';
import { Layout } from './components/Layout';

const App = () => {
  return (
    <ThemeProvider>
      <GameProvider>
        <Layout />
      </GameProvider>
    </ThemeProvider>
  );
};

export default App;
