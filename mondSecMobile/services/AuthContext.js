import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [tokenUser, setTokenUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) setTokenUser(token);
      setLoading(false);
    };
    loadToken();
  }, []);

  const logar = async (token) => {
    await AsyncStorage.setItem('userToken', token);
    setTokenUser(token);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('Localizacao');
    await AsyncStorage.removeItem('viewModal');
    await AsyncStorage.removeItem('userTOken');

    setTokenUser(null);
  };

  return (
    <AuthContext.Provider value={{ tokenUser, logar, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
