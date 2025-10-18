import React, { useRef, useState, useEffect, forwardRef } from 'react';
import { StyleSheet, Dimensions, Alert } from 'react-native';
import MapView, { Polygon } from 'react-native-maps';
import * as Location from 'expo-location';

const local = require('./GeoJson/zonaLeste_convertido.json');
const { width, height } = Dimensions.get('window');

const MapaZonaLesteGeojson = forwardRef((props, ref) => {
  const mapRef = useRef(null);
  const [region, setRegion] = useState(null);
  const [polygons, setPolygons] = useState([]);
  const [bounds, setBounds] = useState(null);

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
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      };
      setRegion(userRegion);

      const parsed = parseGeoJSON(local);
      setPolygons(parsed);

      // Calcula limites da Zona Leste (bounding box)
      const allCoords = parsed.flatMap(p => p.rings[0]);
      const latitudes = allCoords.map(c => c.latitude);
      const longitudes = allCoords.map(c => c.longitude);

      setBounds({
        minLat: Math.min(...latitudes),
        maxLat: Math.max(...latitudes),
        minLng: Math.min(...longitudes),
        maxLng: Math.max(...longitudes),
      });
    })();
  }, []);

  function parseGeoJSON(geojson) {
    const feats = geojson.type === 'FeatureCollection' ? geojson.features : [geojson];
    const out = [];

    feats.forEach((f, idx) => {
      const name = f.properties?.name || f.properties?.nome || `Área ${idx + 1}`;
      const geom = f.geometry;
      if (!geom) return;

      if (geom.type === 'Polygon') {
        const rings = geom.coordinates.map(ring =>
          ring.map(([lng, lat]) => ({ latitude: lat, longitude: lng }))
        );
        out.push({ id: `${idx}`, name, rings });
      } else if (geom.type === 'MultiPolygon') {
        geom.coordinates.forEach((poly, pidx) => {
          const rings = poly.map(ring =>
            ring.map(([lng, lat]) => ({ latitude: lat, longitude: lng }))
          );
          out.push({ id: `${idx}-${pidx}`, name, rings });
        });
      }
    });

    return out;
  }

  // Impede o usuário de ver fora da Zona Leste
  const handleRegionChangeComplete = (rgn) => {
    if (!bounds || !mapRef.current) return;

    const { minLat, maxLat, minLng, maxLng } = bounds;
    let { latitude, longitude, latitudeDelta, longitudeDelta } = rgn;

    const latOut = latitude < minLat || latitude > maxLat;
    const lngOut = longitude < minLng || longitude > maxLng;

    if (latOut || lngOut || latitudeDelta > 0.25 || longitudeDelta > 0.25) {
      // 🔒 Reposiciona automaticamente para dentro da Zona Leste
      const centerLat = (minLat + maxLat) / 2;
      const centerLng = (minLng + maxLng) / 2;

      mapRef.current.animateToRegion({
        latitude: centerLat,
        longitude: centerLng,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });

      Alert.alert('Zona restrita', 'Você não pode sair da Zona Leste!');
    }
  };

  if (!region) return null;

  return (
    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={region}
      showsUserLocation
      showsMyLocationButton={false}
      loadingEnabled
      toolbarEnabled
      zoomControlEnabled={false}
      minZoomLevel={10}
      maxZoomLevel={19}
      onRegionChangeComplete={handleRegionChangeComplete} // 👈 trava de área
    >
      {polygons.map((poly) => (
        <Polygon
          key={poly.id}
          coordinates={poly.rings[0]}
          strokeColor={'#0A84FF'}
          fillColor={'rgba(10,132,255,0.12)'}
          strokeWidth={2}
        />
      ))}
    </MapView>
  );
});

const styles = StyleSheet.create({
  map: { width, height },
});

export default MapaZonaLesteGeojson;
