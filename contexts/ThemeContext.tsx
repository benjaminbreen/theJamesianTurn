import React, { createContext, useContext, useState, ReactNode, PropsWithChildren } from 'react';

export type ThemeMode = 'chronoscope' | 'gaslight';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: PropsWithChildren<{}>) => {
  const [theme, setTheme] = useState<ThemeMode>('chronoscope');

  // Persist theme preference if needed, default to chronoscope for modern HUD look
  const toggleTheme = () => {
    setTheme(prev => prev === 'chronoscope' ? 'gaslight' : 'chronoscope');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};