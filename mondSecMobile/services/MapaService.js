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
  Pressable,
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

    const ativos = lista.filter(c => c.status !== 'inativo');

    setComentarios(ativos);

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

<Modal
  visible={modalVisible}
  transparent
  animationType="slide"
  onRequestClose={fecharModal}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalCard}>
   {/* HEADER DO MODAL PABLO  */}
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>
          {selectedOcorrencia?.tipo || 'Detalhes da Ocorrência'}
        </Text>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={fecharModal}
        >
          <Pressable onPress={() => excluirComentario()}><Text>Excluir</Text></Pressable>
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
      </View>

     {/* CORPO DO MODAL  */}
      <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informações</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Descrição:</Text>
            <Text style={styles.infoText}>
              {selectedOcorrencia?.descricao || 'Sem descrição'}
            </Text>
          </View>


          {selectedOcorrencia?.dataAcontecimento && (
            <View style={styles.infoItem}>
              <Text style={styles.infoData}>Data:</Text>
              <Text style={styles.infoText}>{selectedOcorrencia.dataAcontecimento}</Text>
            </View>
          )}
        </View>
        {/* Seção de Comentários */}
        <View style={styles.commentsSection}>
          <Text style={styles.sectionTitle}>Comentários</Text>

          {loadingComentarios ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#003366" />
              <Text style={styles.loadingText}>Carregando comentários...</Text>
            </View>
          ) : (
            <View style={styles.commentsList}>
              {comentarios.length === 0 ? (
                <Text style={styles.emptyComments}>Nenhum comentário ainda.</Text>
              ) : (
                comentarios.map((c, i) => (
                  <View key={c.id ?? i} style={styles.commentItem}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentAuthor}>
                        {c.usuario?.name || c.usuario?.nome || 'Usuário'}
                      </Text>
                      <Text style={styles.commentDate}>{c.data ?? c.created_at}</Text>
                    </View>
                    <Text style={styles.commentText}>{c.mensagem}</Text>
                  </View>
                ))
              )}
            </View>
          )}

          {/* Input de Comentário */}
          <View style={styles.commentInputContainer}>
            <TextInput
              placeholder="Escreva um comentário..."
              placeholderTextColor="#888"
              value={mensagemComentario}
              onChangeText={setMensagemComentario}
              style={styles.commentInput}
              multiline
              numberOfLines={3}
            />
            
            <TouchableOpacity
              onPress={enviarComentario}
              style={[
                styles.sendButton,
                sendingComentario && styles.sendButtonDisabled
              ]}
              disabled={sendingComentario}
            >
              {sendingComentario ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.sendButtonText}>Enviar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Footer do Modal */}
      <View style={styles.modalFooter}>
        <TouchableOpacity 
          style={styles.okButton}
          onPress={fecharModal}
        >
          <Text style={styles.okButtonText}>Fechar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
    </>
  );
});

const styles = StyleSheet.create({
  map: { 
    width, 
    height 
  },

  modalOverlay: {
    flex: 1,

    backgroundColor: 'rgba(0, 34, 68, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalCard: {
    width: '85%',
    maxWidth: 420,
    height: '85%',      
    maxHeight: 620,    
    backgroundColor: '#FFFFFF',
    borderRadius: 16, 
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#001A33',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 12,
      },
      android: { elevation: 10 },
    }),
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#012E61',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },

  modalTitle: { 
    fontSize: 19, 
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeButtonText: { 
    color: '#FFFFFF', 
    fontSize: 22,
    lineHeight: 24,
    fontWeight: 'bold',
  },

  modalBody: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16, 
    backgroundColor: '#FAFBFD',
  },

  infoSection: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E8ED',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#012E61',
    marginBottom: 10,
  },

  infoItem: { 
    marginBottom: 10,
  },

  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#012E61',
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  infoData: {
    fontSize: 13,
    fontWeight: '600',
    color: '#012E61',
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  infoText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },



  commentsSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E8ED',
  },

  commentsList: {
    marginBottom: 16,
  },

  commentItem: {
    backgroundColor: '#F3F6FA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#012E61',
  },

  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },

  commentAuthor: {
    fontSize: 13,
    fontWeight: '700',
    color: '#012E61',
  },

  commentDate: {
    fontSize: 11,
    color: '#808080',
  },

  commentText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },

  emptyComments: {
    textAlign: 'center',
    color: '#666666',
    fontStyle: 'italic',
    paddingVertical: 20,
  },

  commentInputContainer: { marginTop: 10 },

  commentInput: {
    marginTop: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#D0D7E0',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
    color: '#333333',
    minHeight: 80,
    textAlignVertical: 'top',
  },

  sendButton: {
    backgroundColor: '#012E61',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    alignSelf: 'flex-end',
    minWidth: 110,
  },

  sendButtonDisabled: {
    opacity: 0.6,
  },

  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  modalFooter: {
    padding: 18,
    borderTopWidth: 1,
    borderTopColor: '#E5E8ED',
    backgroundColor: '#F8FAFC',
  },

  okButton: {
    backgroundColor: '#012E61',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    alignItems: 'center',
  },

  okButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MapaZonaLesteGeojson;
