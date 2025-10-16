import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import UrlService from './UrlService';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function NotificacaoService() {
  

  const { status } = await Notifications.requestPermissionsAsync();
  await AsyncStorage.setItem('Notificacao', status);
  if (status !== 'granted') {
    alert('Permissão para notificações negada');
    return;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('TOKEN DO DISPOSITIVO', token);

  await UrlService.post('/notificacao/token', { token });

  await UrlService.post('/notificacao/enviar', {
    token: expoToken,
    title: '🚨 Alerta de segurança',
    body: 'Algo foi detectado no sistema.'
  });
  return token;
}
