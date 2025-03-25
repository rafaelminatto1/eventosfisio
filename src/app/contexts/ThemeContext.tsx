import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeType = 'light';

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Sempre usar o tema claro
  const getInitialTheme = (): ThemeType => 'light';

  const [theme, setTheme] = useState<ThemeType>(getInitialTheme);

  useEffect(() => {
    // Aplicar classe ao elemento HTML
    const root = window.document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    
    // Salvar preferência no localStorage
    localStorage.setItem('theme', 'light');
  }, [theme]);

  // Função toggle não faz mais nada, já que só temos o tema claro
  const toggleTheme = () => {
    // Manter o tema claro
    setTheme('light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}; 