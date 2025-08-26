import React from "react";
import * as Location from 'expo-location';
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function LocalizacaoService() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  await AsyncStorage.setItem('Localizacao', status);
  if (status !== 'granted') {
    alert('Permissão de localização negada!');
    return;
  }

  const loc = await Location.getCurrentPositionAsync({});
  
  //console.log('Latitude:', loc.coords.latitude);
  //console.log('Longitude:', loc.coords.longitude);


};
