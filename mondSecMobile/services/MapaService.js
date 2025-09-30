import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, Dimensions, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

const MapaService = forwardRef((props, ref) => {
  const mapRef = useRef(null);
  const [region, setRegion] = useState({
    latitude: -23.5505,
    longitude: -46.6333,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

  const locations = [
    { lat: -23.5489, lng: -46.6388, title: "Shopping Paulista" },
    { lat: -23.5520, lng: -46.6315, title: "Teatro Municipal" },
    { lat: -23.5456, lng: -46.6340, title: "Parque da República" },
    { lat: -23.5550, lng: -46.6410, title: "Rua Augusta" },
    { lat: -23.5470, lng: -46.6440, title: "Avenida Paulista" }
  ];

  useImperativeHandle(ref, () => ({
    centralizarNoEndereco(lat, lng) {
      const novaRegiao = {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      };
      setRegion(novaRegiao);
      mapRef.current?.animateToRegion(novaRegiao, 1000);
    }
  }));

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      region={region}
      showsUserLocation={true}
      showsMyLocationButton={true}
    >
      {locations.map((loc, index) => (
        <Marker
          key={index}
          coordinate={{ latitude: loc.lat, longitude: loc.lng }}
          title={loc.title}
        />
      ))}
    </MapView>
  );
});

const styles = StyleSheet.create({
  map: {
    width: width,
    height: height,
  },
});

export default MapaService;
