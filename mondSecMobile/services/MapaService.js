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
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import UrlService from './UrlService';
import * as IconServiceModule from './IconService';
const local = require('./GeoJson/zonaLeste_convertido.json');
const { width, height } = Dimensions.get('window');

const DEFAULT_ICON = require('../assets/icones/default.png');

const MapaZonaLesteGeojson = forwardRef(({ ocorrencias = [], currentUserId = null }, ref) => {
  const mapRef = useRef(null);
  const [region, setRegion] = useState(null);
  const [polygons, setPolygons] = useState([]);
  const [bounds, setBounds] = useState(null);
  const [ocorrenciasState, setOcorrencias] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOcorrencia, setSelectedOcorrencia] = useState(null);

  const [comentarios, setComentarios] = useState([]);
  const [mensagemComentario, setMensagemComentario] = useState('');
  const [loadingComentarios, setLoadingComentarios] = useState(false);
  const [sendingComentario, setSendingComentario] = useState(false);
  const [loggedUserId, setLoggedUserId] = useState(currentUserId);

  const resolveIcon = (key) => {
    const svc = IconServiceModule.default || IconServiceModule;
    if (!svc) return DEFAULT_ICON;
    if (!key) return svc.default || DEFAULT_ICON;

    const t = String(key).trim();
    return svc[t] || svc[t.toLowerCase()] || svc.default || DEFAULT_ICON;
  };

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão negada', 'Ative a localização para usar o mapa.');
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        });

        const parsed = parseGeoJSON(local);
        setPolygons(parsed);

        const all = parsed.flatMap((p) => p.rings[0] || []);
        const lat = all.map((c) => c.latitude);
        const lng = all.map((c) => c.longitude);

        if (lat.length && lng.length) {
          setBounds({
            minLat: Math.min(...lat),
            maxLat: Math.max(...lat),
            minLng: Math.min(...lng),
            maxLng: Math.max(...lng),
          });
        }
      } catch (e) {
        console.warn('ERRO AO CARREGAR:', e);
      }
    })();
  }, []);

  useEffect(() => {
    const puxar = async () => {
      try {
        const r = await UrlService.get('/ocorrencia/getall');
        const list = r?.data?.ocorrencias ?? r?.data ?? [];
        if (!Array.isArray(list)) {
          console.warn('Formato inesperado:', r.data);
          return;
        }
        setOcorrencias(list);
      } catch (e) {
        console.warn('Erro ao puxar ocorrências:', e);
      }
    };
    puxar();
  }, []);

  function parseGeoJSON(geojson) {
    const feats = geojson.type === 'FeatureCollection' ? geojson.features : [geojson];
    const out = [];

    feats.forEach((f, i) => {
      const name = f.properties?.name || `Area ${i}`;
      const g = f.geometry;
      if (!g) return;

      if (g.type === 'Polygon') {
        const rings = g.coordinates.map((ring) =>
          ring.map(([lng, lat]) => ({ latitude: lat, longitude: lng }))
        );
        out.push({ id: String(i), name, rings });
      }

      if (g.type === 'MultiPolygon') {
        g.coordinates.forEach((poly, j) => {
          const rings = poly.map((ring) =>
            ring.map(([lng, lat]) => ({ latitude: lat, longitude: lng }))
          );
          out.push({ id: `${i}-${j}`, name, rings });
        });
      }
    });
    return out;
  }

  const handleRegionChangeComplete = (rgn) => {
    if (!bounds || !mapRef.current) return;

    const out =
      rgn.latitude < bounds.minLat ||
      rgn.latitude > bounds.maxLat ||
      rgn.longitude < bounds.minLng ||
      rgn.longitude > bounds.maxLng;

    if (out) {
      const lat = (bounds.minLat + bounds.maxLat) / 2;
      const lng = (bounds.minLng + bounds.maxLng) / 2;

      mapRef.current.animateToRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });
      Alert.alert('Restrito', 'Você não pode sair da Zona Leste.');
    }
  };

  const ensureLoggedUser = async () => {
    if (loggedUserId) return loggedUserId;

    try {
      const r = await UrlService.get('/usuario/buscar');
      const id = r?.data?.id ?? r?.data?.usuario?.id ?? null;
      if (id) setLoggedUserId(id);
      return id;
    } catch (e) {
      console.warn('Erro ao buscar usuário logado:', e);
      return null;
    }
  };

  const carregarComentarios = async (idOcorrencia) => {
    if (!idOcorrencia) {
      setComentarios([]);
      return;
    }

    setLoadingComentarios(true);

    try {

      const r = await UrlService.get(`/comentarios/${idOcorrencia}`);
      const lista = Array.isArray(r.data) ? r.data : [];
      setComentarios(lista);
    } catch (e) {
      console.warn('Erro ao carregar comentários:', e);
      setComentarios([]);
    } finally {
      setLoadingComentarios(false);
    }
  };

  const abrirModal = async (oc) => {
    setSelectedOcorrencia(oc);
    setModalVisible(true);

    const idOc = oc?.id ?? oc?._id ?? null;
    await carregarComentarios(idOc);

    ensureLoggedUser().catch(() => {});
  };

  const fecharModal = () => {
    setModalVisible(false);
    setSelectedOcorrencia(null);
    setComentarios([]);
    setMensagemComentario('');
  };

  const formatDate = (iso) => {
    try {
      if (!iso) return '';
      return new Date(iso).toLocaleString();
    } catch {
      return String(iso || '');
    }
  };

  const enviarComentario = async () => {
    const texto = (mensagemComentario || '').trim();
    if (!texto) return;

    const idOc = selectedOcorrencia?.id ?? selectedOcorrencia?._id;
    if (!idOc) return Alert.alert('Erro', 'Ocorrência inválida.');

    setSendingComentario(true);

    try {
      const idUsuario = await ensureLoggedUser();
      if (!idUsuario) {
        Alert.alert('Erro', 'Usuário não identificado.');
        setSendingComentario(false);
        return;
      }


      const payload = {
        mensagem: texto,
        data: new Date().toISOString(),
        idOcorrencia: idOc,
      };

      const res = await UrlService.post('/comentario/comentarios', payload);

      const novo = res?.data ?? null;

      if (novo && novo.id) {
        const normalized = {
          ...novo,
          data: novo.data ? novo.data : new Date().toISOString(),
        };
        setComentarios((prev) => [normalized, ...(prev || [])]);
        setMensagemComentario('');
      } else {
        await carregarComentarios(idOc);
        setMensagemComentario('');
      }
    } catch (e) {
      console.warn('Erro ao enviar comentário:', e);
      Alert.alert('Erro', 'Não foi possível enviar o comentário.');
    } finally {
      setSendingComentario(false);
    }
  };

  if (!region) return null;

  return (
    <>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        showsUserLocation
        loadingEnabled
        toolbarEnabled
        minZoomLevel={10}
        maxZoomLevel={19}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        {polygons.map((p) => (
          <Polygon
            key={p.id}
            coordinates={p.rings[0]}
            strokeColor="#0A84FF"
            fillColor="rgba(10,132,255,0.12)"
            strokeWidth={2}
          />
        ))}

        {ocorrenciasState.map((oc, i) => {
          const lat = Number(oc.latitude);
          const lng = Number(oc.longitude);

          if (!isFinite(lat) || !isFinite(lng)) return null;

          return (
            <Marker
              key={oc.id ?? i}
              coordinate={{ latitude: lat, longitude: lng }}
              onPress={() => abrirModal(oc)}
            >
              <Image source={resolveIcon(oc.tipo)} style={{ width: 40, height: 40 }} />
            </Marker>
          );
        })}
      </MapView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedOcorrencia?.tipo}</Text>
              <TouchableOpacity onPress={fecharModal}>
                <Text style={styles.modalClose}>Fechar</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 500 }}>
              <Text style={styles.modalLabel}>Descrição:</Text>
              <Text style={styles.modalText}>{selectedOcorrencia?.descricao}</Text>

              <Text style={[styles.modalLabel, { marginTop: 16 }]}>Comentários:</Text>

              {loadingComentarios ? (
                <ActivityIndicator style={{ marginVertical: 12 }} />
              ) : comentarios.length === 0 ? (
                <Text style={{ marginTop: 8, color: '#666' }}>Nenhum comentário ainda.</Text>
              ) : (
                comentarios.map((c) => (
                  <View key={c.id} style={styles.commentItem}>
                    <Text style={styles.commentAuthor}>
                      {c.usuario?.nome || c.usuario?.name || 'Usuário'}
                    </Text>
                    <Text style={styles.commentText}>{c.mensagem}</Text>
                    <Text style={styles.commentDate}>{formatDate(c.data)}</Text>
                  </View>
                ))
              )}

              <TextInput
                placeholder="Escreva um comentário..."
                value={mensagemComentario}
                onChangeText={setMensagemComentario}
                style={styles.commentInput}
                multiline
              />

              <TouchableOpacity
                onPress={enviarComentario}
                disabled={sendingComentario}
                style={[styles.btn, { opacity: sendingComentario ? 0.5 : 1, marginTop: 12 }]}
              >
                <Text style={styles.btnText}>
                  {sendingComentario ? 'Enviando...' : 'Enviar Comentário'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
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
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  modalClose: { fontSize: 16, color: '#0A84FF' },
  modalLabel: { marginTop: 12, fontWeight: 'bold' },
  modalText: { marginTop: 4 },
  btn: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '700' },
  commentItem: {
    marginTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  commentAuthor: { fontWeight: '700' },
  commentText: { marginTop: 4 },
  commentDate: { fontSize: 11, color: '#666', marginTop: 4 },
  commentInput: {
    marginTop: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    minHeight: 50,
  },
});

export default MapaZonaLesteGeojson;
