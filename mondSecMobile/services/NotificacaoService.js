import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function notificacaoService() {
  

  const { status } = await Notifications.requestPermissionsAsync();
  await AsyncStorage.setItem('permissaoNot', status);
  if (status !== 'granted') {
    alert('Permissão para notificações negada');
    return;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('TOKEN DO DISPOSITIVO', token);

  await axios.post('http://192.168.X.X:8000/api/tokenPush', { token });

  //Eae famlia, aqui ó, é pra testar a notificação(funciona só em mobile)
  await axios.post('http://127.0.0.1:8000/api/envNot', {
    token: expoToken,
    title: '🚨 Alerta de segurança',
    body: 'Algo foi detectado no sistema.'
  });
  return token;
}
