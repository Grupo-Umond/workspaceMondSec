import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, Dimensions, Alert } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import * as Location from 'expo-location';

const local = require('./GeoJson/zonaLeste_convertido.json');
const { width, height } = Dimensions.get('window');

const MapaZonaLesteGeojson = forwardRef((props, ref) => {
  const mapRef = useRef(null);
  const [region, setRegion] = useState(null);
  const [polygons, setPolygons] = useState([]);
  const [centroids, setCentroids] = useState([]);

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
        latitudeDelta: 0.06,
        longitudeDelta: 0.06,
      };
      setRegion(userRegion);

      try {
        parseGeoJSON(local);
      } catch (err) {
        console.error('Erro ao carregar GeoJSON local:', err);
        Alert.alert('Erro', 'Falha ao carregar o arquivo local zonaLesteSubPrefeitura.json');
      }
    })();
  }, []);

  function parseGeoJSON(geojson) {
    if (!geojson || !geojson.type) return;
    const feats = geojson.type === 'FeatureCollection' ? geojson.features : [geojson];
    const out = [];
    const cents = [];

    feats.forEach((f, idx) => {
      const name = (f.properties && (f.properties.name || f.properties.nome || f.properties.NAME)) || `Área ${idx + 1}`;
      const geom = f.geometry;
      if (!geom) return;

      if (geom.type === 'Polygon') {
        const rings = geom.coordinates.map((ring) =>
          ring.map(([lng, lat]) => ({ latitude: lat, longitude: lng }))
        );
        out.push({ id: `${idx}`, name, rings });
        cents.push(centroidOfRings(rings[0]));
      } else if (geom.type === 'MultiPolygon') {
        geom.coordinates.forEach((poly, pidx) => {
          const rings = poly.map((ring) => ring.map(([lng, lat]) => ({ latitude: lat, longitude: lng })));
          out.push({ id: `${idx}-${pidx}`, name, rings });
          cents.push(centroidOfRings(rings[0]));
        });
      }
    });

    setPolygons(out);
    setCentroids(cents);
  }

  function centroidOfRings(ring) {
    let x = 0;
    let y = 0;
    ring.forEach((p) => {
      x += p.latitude;
      y += p.longitude;
    });
    return { latitude: x / ring.length, longitude: y / ring.length };
  }

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
    >
      {polygons.map((poly) => {
        const outer = poly.rings[0];
        const holes = poly.rings.length > 1 ? poly.rings.slice(1) : undefined;
        return (
          <Polygon
            key={poly.id}
            coordinates={outer}
            holes={holes}
            tappable
            onPress={() => Alert.alert(poly.name || 'Área', `Subprefeitura / feature: ${poly.name}`)}
            strokeColor={'#0A84FF'}
            fillColor={'rgba(10,132,255,0.12)'}
            strokeWidth={2}
          />
        );
      })}

    </MapView>
  );
});

const styles = StyleSheet.create({
  map: { width, height },
});

export default MapaZonaLesteGeojson;
