import React, { useRef, useState, useEffect, forwardRef } from 'react';
import {
  StyleSheet,
  Dimensions,
  Alert,
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import UrlService from './UrlService';
import * as IconServiceModule from './IconService'; // carregamos tudo para ser robusto com exports

const local = require('./GeoJson/zonaLeste_convertido.json');
const { width, height } = Dimensions.get('window');

// fallback local (garanta que esse arquivo exista)
const DEFAULT_ICON = require('../assets/icones/default.png'); // ajuste caminho relativo se necessário

const MapaZonaLesteGeojson = forwardRef(({ ocorrencias = [] }, ref) => {
  const mapRef = useRef(null);
  const [region, setRegion] = useState(null);
  const [polygons, setPolygons] = useState([]);
  const [bounds, setBounds] = useState(null);
  const [ocorrenciasState, setOcorrencias] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOcorrencia, setSelectedOcorrencia] = useState(null);

  // resolve um "serviço" de ícones de forma tolerante a diferentes exports
  const resolveIconFromService = (tipo) => {
    // IconServiceModule pode ter: default, IconService, ou ser o próprio objeto
    const svc = IconServiceModule.default || IconServiceModule.IconService || IconServiceModule;
    if (!svc) {
      console.warn('[IconService] nenhum serviço de ícone disponível, usando default.');
      return DEFAULT_ICON;
    }

    if (!tipo) return svc.default || DEFAULT_ICON;

    const key = String(tipo).trim();

    // tenta várias formas: exata, lowercase, sem acentos (simples), fallback
    let icon = svc[key] || svc[key.toLowerCase()];

    // se ainda não achou, tenta buscar por chaves também sem espaços repetidos
    if (!icon) {
      const compactKey = key.replace(/\s+/g, ' ').trim();
      icon = svc[compactKey] || svc[compactKey.toLowerCase()];
    }

    if (!icon) {
      // possível que o serviço tenha chaves em outras formas; log útil pra debug
      console.warn(`[IconService] ícone não encontrado para tipo="${tipo}". Usando fallback.`);
      return svc.default || DEFAULT_ICON;
    }

    return icon;
  };

  // -----------------------------------------------------
  // 1) PERMISSÃO + POSIÇÃO DO USUÁRIO + CARREGAR GEOJSON
  // -----------------------------------------------------
  useEffect(() => {
    (async () => {
      try {
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

        const allCoords = parsed.flatMap(p => p.rings[0] || []);
        const latitudes = allCoords.map(c => c.latitude).filter(Boolean);
        const longitudes = allCoords.map(c => c.longitude).filter(Boolean);

        if (latitudes.length && longitudes.length) {
          setBounds({
            minLat: Math.min(...latitudes),
            maxLat: Math.max(...latitudes),
            minLng: Math.min(...longitudes),
            maxLng: Math.max(...longitudes),
          });
        } else {
          console.warn('[Mapa] Não foi possível calcular bounds do GeoJSON (arrays vazios).');
        }
      } catch (err) {
        console.warn('[Mapa] Erro ao obter localização/geojson:', err);
      }
    })();
  }, []);

  // ---------------------------------------
  // 2) BUSCAR OCORRÊNCIAS DO BACKEND (REAL)
  // ---------------------------------------
  useEffect(() => {
    const puxarOcorrencias = async () => {
      try {
        const response = await UrlService.get('/ocorrencia/getall');
        // suporte a duas formas: {ocorrencias: [...]} ou array direto
        const list = response?.data?.ocorrencias ?? response?.data ?? [];
        if (!Array.isArray(list)) {
          console.warn('[Mapa] resposta de ocorrências inesperada:', response?.data);
          setOcorrencias([]);
          return;
        }
        setOcorrencias(list);
        console.log(`[Mapa] ${list.length} ocorrências carregadas do backend.`);
      } catch (err) {
        console.warn('Erro ao puxar ocorrências:', err);
        setOcorrencias([]);
      }
    };
    puxarOcorrencias();
  }, []);

  // ------------------------
  // 3) PARSE GEOJSON
  // ------------------------
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

  // ---------------------------------------------------------
  // 4) IMPEDIR O USUÁRIO DE SAIR DA ZONA LESTE
  // ---------------------------------------------------------
  const handleRegionChangeComplete = (rgn) => {
    if (!bounds || !mapRef.current) return;

    const { minLat, maxLat, minLng, maxLng } = bounds;
    let { latitude, longitude, latitudeDelta, longitudeDelta } = rgn;

    const latOut = latitude < minLat || latitude > maxLat;
    const lngOut = longitude < minLng || longitude > maxLng;

    if (latOut || lngOut || latitudeDelta > 0.25 || longitudeDelta > 0.25) {
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

  // ------------------------
  // 5) MODAL
  // ------------------------
  const abrirModal = (ocorrencia) => {
    setSelectedOcorrencia(ocorrencia);
    setModalVisible(true);
  };

  const fecharModal = () => {
    setModalVisible(false);
    setSelectedOcorrencia(null);
  };

  if (!region) return null;

  return (
    <>
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
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        {/* POLÍGONOS DA ZONA LESTE */}
        {polygons.map((poly) => (
          <Polygon
            key={poly.id}
            coordinates={poly.rings[0]}
            strokeColor={'#0A84FF'}
            fillColor={'rgba(10,132,255,0.12)'}
            strokeWidth={2}
          />
        ))}

        {/* MARCADORES DAS OCORRÊNCIAS */}
        {ocorrenciasState.map((oc, index) => {
          // tenta várias propriedades possíveis para lat/lng
          const lat = Number(oc.latitude ?? oc.lat ?? oc.latitud ?? NaN);
          const lng = Number(oc.longitude ?? oc.lng ?? oc.long ?? NaN);

          if (!isFinite(lat) || !isFinite(lng)) {
            console.warn(`[Mapa] Ocorrência sem coord válida (index ${index}, id:${oc.id ?? oc._id ?? '??'})`, {
              latitude: oc.latitude,
              longitude: oc.longitude,
              raw: oc,
            });
            return null;
          }

          // resolve o ícone de forma tolerante e garante fallback
          const icone = resolveIconFromService(oc.tipo);

          // debug: se quiser ver o tipo e o ícone resolvido, descomente:
          // console.log('[Mapa] tipo:', oc.tipo, 'icone resolvido:', icone);

          return (
            <Marker
              key={oc.id ?? index}
              coordinate={{ latitude: lat, longitude: lng }}
              title={oc.tipo}
              description={oc.descricao}
              onPress={() => abrirModal(oc)}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              {/* Image sempre recebe algo válido (require ou objeto uri) */}
              <Image
                source={icone || DEFAULT_ICON}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />
            </Marker>
          );
        })}
      </MapView>

      {/* MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={fecharModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedOcorrencia?.tipo || 'Detalhes'}
              </Text>
              <TouchableOpacity onPress={fecharModal}>
                <Text style={styles.modalClose}>Fechar</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>Descrição:</Text>
              <Text style={styles.modalText}>
                {selectedOcorrencia?.descricao || 'Sem descrição'}
              </Text>

              {selectedOcorrencia?.endereco && (
                <>
                  <Text style={[styles.modalLabel, { marginTop: 12 }]}>Endereço:</Text>
                  <Text style={styles.modalText}>{selectedOcorrencia.endereco}</Text>
                </>
              )}

              {selectedOcorrencia?.data && (
                <>
                  <Text style={[styles.modalLabel, { marginTop: 12 }]}>Data:</Text>
                  <Text style={styles.modalText}>{selectedOcorrencia.data}</Text>
                </>
              )}

              <View style={{ marginTop: 18, alignItems: 'flex-end' }}>
                <TouchableOpacity onPress={fecharModal} style={styles.btn}>
                  <Text style={styles.btnText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
});

const styles = StyleSheet.create({
  map: { width, height },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 12,
      },
      android: { elevation: 8 },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  modalClose: { color: '#0A84FF', fontWeight: '600' },
  modalBody: { marginTop: 6 },
  modalLabel: { fontSize: 13, fontWeight: '600', color: '#333' },
  modalText: { fontSize: 14, color: '#222', marginTop: 4 },
  btn: {
    backgroundColor: '#0A84FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  btnText: { color: '#fff', fontWeight: '700' },
});

export default MapaZonaLesteGeojson;
