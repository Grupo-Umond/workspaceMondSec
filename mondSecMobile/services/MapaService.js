// MapaZonaLesteGeojson.js
import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, Dimensions, Alert } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

// Tente esse URL; se der 404, baixe o .geojson e coloque em ./assets/subprefeituras-sp.geojson
const GEOJSON_URL =
  'https://raw.githubusercontent.com/codigourbano/subprefeituras-sp/master/subprefeituras-sp.geojson';

const MapaZonaLesteGeojson = forwardRef((props, ref) => {
  const mapRef = useRef(null);
  const [region, setRegion] = useState(null);
  const [polygons, setPolygons] = useState([]); // {id, name, rings: [ [ {lat,lng}, ... ], ... ] }
  const [centroids, setCentroids] = useState([]); // centroids for quick checks

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

      // carrega o geojson remoto ou local
      try {
        const resp = await fetch(GEOJSON_URL);
        if (!resp.ok) throw new Error('Falha ao baixar GeoJSON remoto');
        const geo = await resp.json();
        parseGeoJSON(geo);
      } catch (err) {
        console.warn('Erro ao buscar GeoJSON remoto:', err.message);
        // fallback: usuário deve colocar o arquivo em assets e descomentar a linha abaixo
        try {
          // eslint-disable-next-line import/no-unresolved
          const local = require('./assets/subprefeituras-sp.geojson');
          parseGeoJSON(local);
        } catch (e) {
          Alert.alert(
            'GeoJSON não disponível',
            'Não foi possível baixar o GeoJSON remoto nem encontrar o arquivo local. Baixe o GeoJSON oficial (GeoSampa / repositório mirror) e coloque em ./assets/subprefeituras-sp.geojson'
          );
        }
      }
    })();
  }, []);

  // Converte GeoJSON -> array de polígonos renderizáveis
  function parseGeoJSON(geojson) {
    if (!geojson || !geojson.type) return;
    const feats = geojson.type === 'FeatureCollection' ? geojson.features : [geojson];
    const out = [];
    const cents = [];

    feats.forEach((f, idx) => {
      const name = (f.properties && (f.properties.name || f.properties.nome || f.properties.NAME)) || `feat-${idx}`;
      const geom = f.geometry;
      if (!geom) return;

      if (geom.type === 'Polygon') {
        // geom.coordinates -> [ ring0, ring1(hole), ... ]
        const rings = geom.coordinates.map((ring) =>
          ring.map(([lng, lat]) => ({ latitude: lat, longitude: lng }))
        );
        out.push({ id: `${idx}`, name, rings });
        cents.push(centroidOfRings(rings[0]));
      } else if (geom.type === 'MultiPolygon') {
        // geom.coordinates -> [ [ ring0, ring1... ], [ ring0... ], ... ]
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

  // calcula centróide simples do anel exterior para zoom inicial / checagem rápida
  function centroidOfRings(ring) {
    let x = 0;
    let y = 0;
    ring.forEach((p) => {
      x += p.latitude;
      y += p.longitude;
    });
    return { latitude: x / ring.length, longitude: y / ring.length };
  }

  // Teste ponto-em-polígono (ray-casting) para um único anel (array de {latitude,longitude})
  function pointInRing(point, ring) {
    const x = point.longitude;
    const y = point.latitude;
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const xi = ring[i].longitude,
        yi = ring[i].latitude;
      const xj = ring[j].longitude,
        yj = ring[j].latitude;

      const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi + 0.0) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }

  // Verifica se ponto está dentro de *qualquer* dos polígonos (considera ring[0] como exterior)
  function isInsideAnyPolygons(lat, lng) {
    if (!polygons || polygons.length === 0) return true; // se não carregou, permita
    const pt = { latitude: lat, longitude: lng };
    for (const poly of polygons) {
      const exterior = poly.rings[0];
      if (pointInRing(pt, exterior)) {
        // se estiver no exterior, garantir que não esteja em um hole (rings 1..n)
        let inHole = false;
        for (let h = 1; h < poly.rings.length; h++) {
          if (pointInRing(pt, poly.rings[h])) {
            inHole = true;
            break;
          }
        }
        if (!inHole) return true;
      }
    }
    return false;
  }

  // API externa: centralizar em lat/lng apenas se dentro das áreas carregadas
  useImperativeHandle(ref, () => ({
    centralizarNoEndereco(lat, lng, zoomDelta = 0.01) {
      if (!lat || !lng) return;
      if (!isInsideAnyPolygons(lat, lng)) {
        Alert.alert('Fora da área definida', 'O ponto informado não está dentro das subprefeituras carregadas.');
        return;
      }
      const nova = { latitude: lat, longitude: lng, latitudeDelta: zoomDelta, longitudeDelta: zoomDelta };
      mapRef.current?.animateToRegion(nova, 800);
    },
  }));

  // Quando o usuário arrasta o mapa, impede sair das áreas carregadas
  function onRegionChangeComplete(r) {
    const centerInside = isInsideAnyPolygons(r.latitude, r.longitude);
    if (!centerInside && region) {
      // volta para último region conhecido
      mapRef.current?.animateToRegion(region, 600);
    } else {
      // atualiza região salvo
      setRegion(r);
    }
  }

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
      minZoomLevel={10}
      maxZoomLevel={19}
      onRegionChangeComplete={onRegionChangeComplete}
    >
      {/* Renderiza cada polygon ring (com holes caso existam) */}
      {polygons.map((poly) => {
        // Para react-native-maps, passamos 'coordinates' (outer ring) e 'holes' como array de coords para buracos
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

      {/* Exemplo de marcadores de centros (opcional) */}
      {centroids.map((c, i) => (
        <Marker key={`c-${i}`} coordinate={c} title={`centro-${i}`} />
      ))}
    </MapView>
  );
});

const styles = StyleSheet.create({
  map: { width, height },
});

export default MapaZonaLesteGeojson;
