import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';

import { AuthProvider, AuthContext } from './services/AuthContext';
import { ThemeProvider } from "./services/themes/themecontext";

import IntroducaoScreen from './pages/Introducao';
import HomeScreen from './pages/home';
import LoginScreen from './pages/login';
import CadastroScreen from './pages/cadastro';
import MenuScreen from './pages/perfil/menu';
import OcorrenciaScreen from './pages/perfil/ocorrencia';
import PoliticaScreen from './pages/perfil/politica';
import SobreScreen from './pages/sobre';
import RegistrarScreen from './pages/registrar';
import ConfiguracaoScreen from './pages/configuracao';
import DigiteDadosScreen from './pages/perfil/alterarDados/digiteDados';
import DigiteCodigoScreen from './pages/perfil/alterarDados/digiteCodigo';
import AlterarSenhaScreen from './pages/perfil/alterarDados/alterarSenha';
import DigiteCampoScreen from './pages/perfil/alterarDados/digiteCampo';

const Stack = createStackNavigator();

function AppRoutes() {
  const { tokenUser, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Introducao">
      <Stack.Screen name="Introducao" component={IntroducaoScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Sobre" component={SobreScreen} />
      <Stack.Screen name="Configuracao" component={ConfiguracaoScreen} />
      <Stack.Screen name="DigiteCodigo" component={DigiteCodigoScreen} />
      <Stack.Screen name="AlterarSenha" component={AlterarSenhaScreen} />
      <Stack.Screen name="Politica" component={PoliticaScreen} />


      {tokenUser ? (
        <>
          <Stack.Screen name="Menu" component={MenuScreen} />
          <Stack.Screen name="Ocorrencia" component={OcorrenciaScreen} />
          <Stack.Screen name="Registrar" component={RegistrarScreen} />
          <Stack.Screen name="DigiteDados" component={DigiteDadosScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="DigiteCampo" component={DigiteCampoScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Cadastro" component={CadastroScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NavigationContainer>
          <AppRoutes />
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
}
