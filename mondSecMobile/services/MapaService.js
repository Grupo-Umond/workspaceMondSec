import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from 'react';
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
  Animated,
} from 'react-native';
import MapView, { Polygon, Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { parseGeoJSON } from './MapaZonaLeste/geojsonParser.service';
import { calculateBounds, checkAndFixRegion } from './MapaZonaLeste/regionBounds.service';
import { buscarOcorrencias } from './MapaZonaLeste/ocorrencias.service';
import { carregarComentarios, enviarComentarioRequest } from './MapaZonaLeste/comentarios.service';
import { buscarUsuarioLogado } from './MapaZonaLeste/user.service';
import { getIconForTipo } from './IconService.js';
import UrlService from './UrlService';
import { useTheme } from './themes/themecontext';

const local = require('./GeoJson/zonaLeste_convertido.json');
const { width, height } = Dimensions.get('window');

const MapaZonaLesteGeojson = forwardRef(({ ocorrencias = [], currentUserId = null }, ref) => {
  const mapRef = useRef(null);
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');
  const [region, setRegion] = useState(null);
  const [polygons, setPolygons] = useState([]);
  const [bounds, setBounds] = useState(null);
  const [ocorrenciasState, setOcorrencias] = useState([]);

  const [rotaCoords, setRotaCoords] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOcorrencia, setSelectedOcorrencia] = useState(null);

  const [comentarios, setComentarios] = useState([]);
  const [mensagemComentario, setMensagemComentario] = useState('');
  const [loadingComentarios, setLoadingComentarios] = useState(false);
  const [sendingComentario, setSendingComentario] = useState(false);
  const [loggedUserId, setLoggedUserId] = useState(currentUserId);
  const [modalDenuncia, setModalDenuncia] = useState(false);

  const [visible, setVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const SCREEN_HEIGHT = Dimensions.get("window").height;
  const SHEET_HEIGHT = SCREEN_HEIGHT * 0.25;

  const { theme, isDarkMode } = useTheme();

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

        const b = calculateBounds(parsed);
        setBounds(b);
      } catch (e) {
        console.warn('ERRO AO CARREGAR:', e);
      }
    })();
  }, []);

  useEffect(() => {
    const puxar = async () => {
      try {
        const list = await buscarOcorrencias();
        if (!Array.isArray(list)) return;
        setOcorrencias(list);
      } catch (e) {
        console.warn('Erro ao puxar ocorrências:', e);
      }
    };
    puxar();
  }, []);

  // ---------- NOVO: Agrupamento por coordenada ----------
  // Usamos useMemo para recalcular só quando ocorrenciasState mudar.
  const ocorrenciasAgrupadas = useMemo(() => {
    return (ocorrenciasState || []).reduce((acc, oc) => {
      const lat = Number(oc.latitude);
      const lng = Number(oc.longitude);
      if (!isFinite(lat) || !isFinite(lng)) return acc;

      // arredonda para 5 casas pra agrupar pontos muito próximos
      const chave = `${lat.toFixed(5)}_${lng.toFixed(5)}`;

      if (!acc[chave]) {
        acc[chave] = {
          count: 0,
          items: [],
          latitude: lat,
          longitude: lng,
        };
      }

      acc[chave].count += 1;
      acc[chave].items.push(oc);

      return acc;
    }, {});
  }, [ocorrenciasState]);

  // Mapeia cor do badge de acordo com a densidade
  const getBadgeColor = (count) => {
    if (count >= 10) return '#E53935'; // vermelho
    if (count >= 5) return '#FB8C00'; // laranja
    if (count >= 2) return '#FDD835'; // amarelo
    return null; // 1 => sem badge
  };

  const openSheet = () => {
    setVisible(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [SHEET_HEIGHT, 0],
  });

  const handleRegionChangeComplete = (rgn) => {
    if (!bounds || !mapRef.current) return;
    const corrected = checkAndFixRegion(rgn, bounds, mapRef);
    if (corrected) {
      Alert.alert('Restrito', 'Você não pode sair da Zona Leste.');
    }
  };

  const abrirModal = async (oc) => {
    setSelectedOcorrencia(oc);
    setModalVisible(true);
    const idOc = oc?.id ?? oc?._id;
    if (!idOc) {
      setComentarios([]);
      return;
    }
    setLoadingComentarios(true);
    const coms = await carregarComentarios(idOc);
    setComentarios(coms || []);
    setLoadingComentarios(false);
    const idUser = await buscarUsuarioLogado();
    setLoggedUserId(idUser);
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

  const denunciarOcorrencia = async (id) => {
    try {
      const idc = id ?? (selectedOcorrencia?.id ?? selectedOcorrencia?._id);

      if (!idc) {
        Alert.alert('Erro', 'Ocorrência inválida para denúncia.');
        return;
      }

      await UrlService.put(`/ocorrencia/denuncia/${idc}`);

      setModalDenuncia(false);
      Alert.alert('Denúncia enviada', 'Sua denúncia foi registrada.');
    } catch (e) {
      console.warn('Erro ao denunciar:', e);
      Alert.alert('Erro', 'Não foi possível denunciar a ocorrência.');
    }
  };

  const encerrandoRota = () => {
    setRotaCoords([]);
    closeSheet();
  };

  const enviarComentario = async () => {
    const texto = (mensagemComentario || '').trim();
    if (!texto) return;
    const idOc = selectedOcorrencia?.id ?? selectedOcorrencia?._id;
    if (!idOc) return Alert.alert('Erro', 'Ocorrência inválida.');
    setSendingComentario(true);
    try {
      const idUsuario = loggedUserId || (await buscarUsuarioLogado());
      if (!idUsuario) {
        Alert.alert('Erro', 'Usuário não identificado.');
        setSendingComentario(false);
        return;
      }
      const payload = {
        mensagem: texto,
        data: new Date().toISOString(),
        idOcorrencia: idOc,
        idUsuario,
      };
      const res = await enviarComentarioRequest(payload);
      const novo = res ?? null;
      if (novo && (novo.id || novo._id)) {
        const normalized = {
          ...novo,
          data: novo.data ? novo.data : new Date().toISOString(),
        };
        setComentarios((prev) => [normalized, ...(prev || [])]);
        setMensagemComentario('');
      } else {
        const recarregado = await carregarComentarios(idOc);
        setComentarios(recarregado || []);
        setMensagemComentario('');
      }
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível enviar o comentário.');
    } finally {
      setSendingComentario(false);
    }
  };

  useImperativeHandle(ref, () => ({
    centralizarNoEndereco(lat, lon) {
      mapRef.current?.animateCamera({
        center: { latitude: lat, longitude: lon },
        zoom: 16,
      });
    },

    desenharRota(rota, inicio, fim) {
      setInicio(inicio);
      setFim(fim);
      if (!rota || !Array.isArray(rota) || rota.length === 0) {
        console.log('Rota inválida:', rota);
        return;
      }
      setRotaCoords(rota);
      mapRef.current?.fitToCoordinates(rota, {
        edgePadding: { top: 80, bottom: 80, left: 80, right: 80 },
        animated: true,
      });
      openSheet();
    },
  }));

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

        {/* ---------- RENDERIZANDO MARCADORES AGRUPADOS ---------- */}
        {Object.entries(ocorrenciasAgrupadas).map(([key, group], idx) => {
          const first = group.items[0];
          const lat = Number(group.latitude);
          const lng = Number(group.longitude);

          if (!isFinite(lat) || !isFinite(lng)) return null;

          const quantidade = group.count;
          const badgeColor = getBadgeColor(quantidade);

          return (
            <Marker
              key={key}
              coordinate={{ latitude: lat, longitude: lng }}
              onPress={() => abrirModal(first)}
            >
              <View style={styles.markerContainer}>
                <Image
                  source={getIconForTipo(first.tipo)}
                  style={styles.markerImage}
                />
                {/* mostra badge só quando houver mais de 1 ocorrência no mesmo ponto */}
                {quantidade > 1 && (
                  <View style={[styles.badge, { backgroundColor: badgeColor }]}>
                    <Text style={styles.badgeText}>{quantidade}</Text>
                  </View>
                )}
              </View>
            </Marker>
          );
        })}

        {rotaCoords.length > 0 && (
          <Polyline coordinates={rotaCoords} strokeWidth={5} strokeColor="#ff0000ff" />
        )}
      </MapView>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={fecharModal}>
        <View
          style={{
            flex: 1,
            backgroundColor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(0, 34, 68, 0.6)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: '85%',
              maxWidth: 420,
              height: '85%',
              maxHeight: 520,
              backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
              borderRadius: 16,
              overflow: 'hidden',
              ...(Platform.OS === 'ios'
                ? {
                    shadowColor: isDarkMode ? '#000' : '#001A33',
                    shadowOpacity: 0.4,
                    shadowOffset: { width: 0, height: 8 },
                    shadowRadius: 14,
                  }
                : { elevation: 10 }),
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: isDarkMode ? '#0c2946ff' : '#012E61',
                paddingHorizontal: 20,
                paddingVertical: 14,
              }}
            >
              <Text
                style={{
                  fontSize: 19,
                  fontWeight: '700',
                  color: '#FFF',
                  flex: 1,
                }}
              >
                {selectedOcorrencia?.tipo || 'Detalhes da Ocorrência'}
              </Text>

              <TouchableOpacity
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.15)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={fecharModal}
              >
                <Text style={{ color: '#FFF', fontSize: 22, fontWeight: 'bold' }}>×</Text>
              </TouchableOpacity>

              <Pressable onPress={() => setModalDenuncia(true)}>
                <Text style={{ color: '#FFF', marginLeft: 10 }}>Denunciar</Text>
              </Pressable>
            </View>

            <ScrollView
              style={{
                flex: 1,
                paddingHorizontal: 20,
                paddingVertical: 16,
                backgroundColor: isDarkMode ? '#2C2C2E' : '#FAFBFD',
              }}
              showsVerticalScrollIndicator={false}
            >
              <View
                style={{
                  marginBottom: 24,
                  backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
                  padding: 14,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: isDarkMode ? '#3A3A3C' : '#E5E8ED',
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: isDarkMode ? '#4FC3F7' : '#012E61',
                    marginBottom: 10,
                  }}
                >
                  Informações
                </Text>

                <View style={{ marginBottom: 10 }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '600',
                      color: isDarkMode ? '#4FC3F7' : '#012E61',
                    }}
                  >
                    Descrição:
                  </Text>

                  <Text
                    style={{
                      fontSize: 13,
                      color: isDarkMode ? '#E5E5E7' : '#333',
                      marginTop: 4,
                    }}
                  >
                    {selectedOcorrencia?.descricao || 'Sem descrição'}
                  </Text>
                </View>

                {selectedOcorrencia?.dataAcontecimento && (
                  <View style={{ marginBottom: 10 }}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '600',
                        color: isDarkMode ? '#4FC3F7' : '#012E61',
                      }}
                    >
                      Data:
                    </Text>

                    <Text
                      style={{
                        fontSize: 13,
                        color: isDarkMode ? '#E5E5E7' : '#333',
                        marginTop: 4,
                      }}
                    >
                      {formatDate(selectedOcorrencia.dataAcontecimento)}
                    </Text>
                  </View>
                )}
              </View>

              <View
                style={{
                  marginBottom: 24,
                  backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
                  padding: 14,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: isDarkMode ? '#3A3A3C' : '#E5E8ED',
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: isDarkMode ? '#4FC3F7' : '#012E61',
                  }}
                >
                  Comentários
                </Text>

                {loadingComentarios ? (
                  <View style={{ paddingVertical: 12 }}>
                    <ActivityIndicator size="small" color="#003366" />
                    <Text style={{ textAlign: 'center', marginTop: 8 }}>Carregando comentários...</Text>
                  </View>
                ) : (
                  <View style={{ marginTop: 10 }}>
                    {comentarios.length === 0 ? (
                      <Text style={{ color: isDarkMode ? '#AAA' : '#666', fontStyle: 'italic', textAlign: 'center' }}>
                        Nenhum comentário ainda.
                      </Text>
                    ) : (
                      comentarios.map((c, i) => (
                        <View
                          key={c.id ?? i}
                          style={{
                            backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F6FA',
                            padding: 10,
                            borderRadius: 8,
                            marginBottom: 12,
                          }}
                        >
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                            <Text style={{ fontWeight: '700', color: isDarkMode ? '#4FC3F7' : '#012E61', fontSize: 13 }}>
                              {c.usuario?.name || c.usuario?.nome || 'Usuário'}
                            </Text>
                            <Text style={{ fontSize: 11, color: isDarkMode ? '#CCC' : '#777' }}>
                              {formatDate(c.data ?? c.created_at)}
                            </Text>
                          </View>
                          <Text style={{ fontSize: 13, color: isDarkMode ? '#E5E5E7' : '#333' }}>{c.mensagem}</Text>
                        </View>
                      ))
                    )}
                  </View>
                )}

                <View style={{ marginTop: 15 }}>
                  <TextInput
                    placeholder="Escreva um comentário..."
                    placeholderTextColor="#888"
                    value={mensagemComentario}
                    onChangeText={setMensagemComentario}
                    style={{
                      borderWidth: 1,
                      borderColor: isDarkMode ? '#3A3A3C' : '#D8DDE5',
                      borderRadius: 8,
                      padding: 10,
                      backgroundColor: isDarkMode ? '#2C2C2E' : '#FFFFFF',
                      color: isDarkMode ? '#FFF' : '#333',
                      minHeight: 70,
                      textAlignVertical: 'top',
                    }}
                    multiline
                    numberOfLines={3}
                  />

                  <TouchableOpacity
                    onPress={enviarComentario}
                    style={{
                      marginTop: 10,
                      paddingVertical: 10,
                      backgroundColor: isDarkMode ? '#0c2946ff' : '#003366',
                      borderRadius: 8,
                      alignItems: 'center',
                      opacity: sendingComentario ? 0.5 : 1,
                    }}
                    disabled={sendingComentario}
                  >
                    {sendingComentario ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 14 }}>Enviar</Text>}
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.okButton} onPress={fecharModal}>
                <Text style={styles.okButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={modalDenuncia} transparent animationType="slide" onRequestClose={() => setModalDenuncia(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={{ padding: 20 }}>
              <Text style={{ marginBottom: 20 }}>Tem certeza que quer denunciar essa ocorrencia?</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Pressable onPress={() => denunciarOcorrencia(selectedOcorrencia?.id ?? selectedOcorrencia?._id)} style={{ padding: 10 }}>
                  <Text>Sim</Text>
                </Pressable>
                <Pressable onPress={() => setModalDenuncia(false)} style={{ padding: 10 }}>
                  <Text>Não</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={visible} animationType="none">
        <TouchableOpacity style={styles.overlay} onPress={closeSheet} activeOpacity={1} />
        <Animated.View
          style={[
            styles.sheet,
            { height: SHEET_HEIGHT, transform: [{ translateY }] }
          ]}
        >
          <Pressable onPress={() => encerrandoRota()}>
            <Text style={styles.sheetText}>Fechar</Text>
          </Pressable>
        </Animated.View>
      </Modal>
    </>
  );
});

const styles = StyleSheet.create({
  map: { width, height },

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
    maxHeight: 520,
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

  closeButtonText: { color: '#FFFFFF', fontSize: 22, fontWeight: 'bold' },

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

  infoItem: { marginBottom: 10 },

  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#012E61',
  },

  infoText: {
    fontSize: 13,
    color: '#333',
    marginTop: 4,
  },

  infoData: {
    fontSize: 13,
    fontWeight: '600',
    color: '#012E61',
  },

  commentsSection: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E8ED',
  },

  commentsList: { marginTop: 10 },

  emptyComments: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },

  commentItem: {
    backgroundColor: '#F2F6FA',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },

  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },

  commentAuthor: {
    fontWeight: '700',
    color: '#012E61',
    fontSize: 13,
  },

  commentDate: {
    fontSize: 11,
    color: '#777',
  },

  commentText: {
    fontSize: 13,
    color: '#333',
  },

  commentInputContainer: {
    marginTop: 15,
  },

  commentInput: {
    borderWidth: 1,
    borderColor: '#D8DDE5',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#FFFFFF',
    color: '#333',
    minHeight: 70,
    textAlignVertical: 'top',
  },

  sendButton: {
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: '#003366',
    borderRadius: 8,
    alignItems: 'center',
  },

  sendButtonDisabled: {
    opacity: 0.5,
  },

  sendButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },

  modalFooter: {
    padding: 14,
    backgroundColor: '#FAFBFD',
    borderTopWidth: 1,
    borderColor: '#E5E8ED',
  },

  okButton: {
    backgroundColor: '#003366',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  okButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  button: {
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 8
  },
  buttonText: { color: "#fff", fontSize: 16 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#fff",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 20,
  },
  sheetText: { fontSize: 18 },

  // ---------- estilos do marcador com badge ----------
  markerContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -6,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: '#fff',
  },
  badgeText: {
    fontSize: 12,
    color: '#000',
    fontWeight: '700',
  },
});

export default MapaZonaLesteGeojson;
