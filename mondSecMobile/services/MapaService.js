import React, {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { StyleSheet, Dimensions, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

const MapaService = forwardRef((props, ref) => {
  const mapRef = useRef(null);
  const [region, setRegion] = useState(null);

  const zonaLesteBounds = {
    northEast: { latitude: -23.4800, longitude: -46.4000 },
    southWest: { latitude: -23.7000, longitude: -46.6500 },
  };

  const locations = [
    { lat: -23.5456, lng: -46.5175, title: "Shopping Aricanduva" },
    { lat: -23.5390, lng: -46.4755, title: "Itaquera" },
    { lat: -23.5405, lng: -46.4638, title: "Parque do Carmo" },
    { lat: -23.5635, lng: -46.4950, title: "Tatuapé" },
    { lat: -23.5845, lng: -46.5290, title: "São Mateus" },
  ];

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Ative a localização para usar o mapa.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const userRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };

      if (!isInsideZonaLeste(location.coords.latitude, location.coords.longitude)) {
        userRegion.latitude = -23.5635;
        userRegion.longitude = -46.4950;
      }

      setRegion(userRegion);
    })();
  }, []);

  function isInsideZonaLeste(lat, lng) {
    return (
      lat <= zonaLesteBounds.northEast.latitude &&
      lat >= zonaLesteBounds.southWest.latitude &&
      lng >= zonaLesteBounds.southWest.longitude &&
      lng <= zonaLesteBounds.northEast.longitude
    );
  }

  useImperativeHandle(ref, () => ({
    centralizarNoEndereco(lat, lng) {
      if (!lat || !lng) return;

      if (!isInsideZonaLeste(lat, lng)) {
        Alert.alert('Fora da Zona Leste', 'O mapa está limitado à Zona Leste de São Paulo.');
        return;
      }

      const novaRegiao = {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      mapRef.current?.animateToRegion(novaRegiao, 1000);
    },
  }));

  if (!region) return null;

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={region}
      showsUserLocation
      showsMyLocationButton
      loadingEnabled
      toolbarEnabled
      zoomControlEnabled
      minZoomLevel={12}
      maxZoomLevel={18}
      onRegionChangeComplete={(r) => {
        
        if (!isInsideZonaLeste(r.latitude, r.longitude)) {
          mapRef.current?.animateToRegion(region, 500);
        }
      }}
    >
      {locations.map((loc, index) => (
        <Marker
          key={index}
          coordinate={{ latitude: loc.lat, longitude: loc.lng }}
          title={loc.title}
          pinColor={index === 0 ? 'blue' : 'red'}
        />
      ))}
    </MapView>
  );
});

const styles = StyleSheet.create({
  map: {
    width,
    height,
  },
});

export default MapaService;
