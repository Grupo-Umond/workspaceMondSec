import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import HomeScreen from './pages/home';
import LoginScreen from './pages/login';
import CadastroScreen from './pages/cadastro';
import MenuScreen from './pages/perfil/menu';
import OcorrenciaScreen from './pages/perfil/ocorrencia';
import SobreScreen from './pages/sobre';
import RegistrarScreen from './pages/registrar';
import ConfiguracaoScreen from './pages/configuracao';
import DigiteDadosScreen from './pages/perfil/alterarDados/digiteDados';
import DigiteCodigoScreen from './pages/perfil/alterarDados/digiteCodigo';
import AlterarSenhaScreen from './pages/perfil/alterarDados/alterarSenha';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }} 
      >
       
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="Ocorrencia" component={OcorrenciaScreen} />
        <Stack.Screen name="Sobre" component={SobreScreen} />
        <Stack.Screen name="Registrar" component={RegistrarScreen} />
        <Stack.Screen name="Configuracao" component={ConfiguracaoScreen} />
        <Stack.Screen name="DigiteDados" component={DigiteDadosScreen} />
        <Stack.Screen name="DigiteCodigo" component={DigiteCodigoScreen} />
        <Stack.Screen name="AlterarSenha" component={AlterarSenhaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}