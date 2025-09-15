import * as Location from 'expo-location';
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function LocalizacaoService() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    await AsyncStorage.setItem('permissaoLocal', status);

    if (status !== 'granted') {
      return null;
    }

    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    };
  } catch (error) {
    console.log("Erro ao obter localização:", error);
    return null;
  }
}
