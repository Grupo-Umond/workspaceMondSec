import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Carregar o tema salvo ao iniciar o app
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("@themeMode");
        if (savedTheme !== null) {
          setIsDarkMode(savedTheme === "dark");
        }
      } catch (error) {
        console.log("Erro ao carregar tema:", error);
      }
    };

    loadTheme();
  }, []);

  // Alternar o tema e salvar no Storage
  const toggleTheme = async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);

      await AsyncStorage.setItem("@themeMode", newMode ? "dark" : "light");
    } catch (error) {
      console.log("Erro ao salvar tema:", error);
    }
  };

  const theme = isDarkMode
  ? {
      // Dark Theme
      background: "#111",
      text: "#fff", 
      title: "#fff", 
      textSecondary: "#ccc",
      border: "#333",
      primary: "#4FC3F7",
      secundary: "#01080aff",
      button: "#093043ff", 
      icon: "#fff",
      danger: "#ff6b6b",
      cimaDark: "#10405eff",
      baixoDark: "#2c3e50",
       buttonColor: '#0c2946ff', 
       backlegenda: '#4FC3F7', 
      colorlegenda: '#0b0505ff'
     
    }
  : {
      // Light Theme  
      background: "#ffffffff",
      text: "#000",
      title: "#003366", 
      textSecondary: "#555",
      secundary: "#fafeffff",
      button: "#61a3c4ff", 
      border: "#ddd",
      primary: "#003366",
      icon: "#fff6f6ff",
      danger: "#E53935",
      cimaDark: "#ffffff", 
      baixoDark: "#ffffff",
      buttonColor: '#003366',
      backlegenda: '#e1e5eaff', 
      colorlegenda: '#05101dff'
    };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
