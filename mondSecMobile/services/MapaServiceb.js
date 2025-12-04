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
  FlatList,
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
import OccurrenceCarousel from './MapaZonaLeste/OccurrenceCarousel.js';
import { parseGeoJSON } from './MapaZonaLeste/geojsonParser.service';
import { calculateBounds, checkAndFixRegion } from './MapaZonaLeste/regionBounds.service';
import { buscarOcorrencias } from './MapaZonaLeste/ocorrencias.service';
import { carregarComentarios, enviarComentarioRequest } from './MapaZonaLeste/comentarios.service';
import { buscarUsuarioLogado } from './MapaZonaLeste/user.service';
import { EnderecoService } from './EnderecoService.js';
import { getIconForTipoWithCount} from './IconService.js';
import UrlService from './UrlService';
import { useTheme } from './themes/themecontext';
import DetalheOcorrencia from './DetalheOcorrencia.js';
import FontAwesome from '@expo/vector-icons/FontAwesome';
const enderecoService = new EnderecoService();

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
  const [amenity, setAmenity] = useState('');

  const [rotaCoords, setRotaCoords] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOcorrencia, setSelectedOcorrencia] = useState(null);
const [endereco, setEndereco] = useState(null);

  const [comentarios, setComentarios] = useState([]);
  const [mensagemComentario, setMensagemComentario] = useState('');
  const [loadingComentarios, setLoadingComentarios] = useState(false);
  const [sendingComentario, setSendingComentario] = useState(false);
  const [loggedUserId, setLoggedUserId] = useState(currentUserId);
  const [modalDenuncia, setModalDenuncia] = useState(false);
  const [showComentarios, setShowComentarios] = useState(false);
  const [visible, setVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [ocorrenciasNoEndereco, setOcorrenciasNoEndereco] = useState([]);
  const [modalIndex, setModalIndex] = useState(0);
  const flatListRef = useRef(null);
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

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

  const ocorrenciasAgrupadas = useMemo(() => {
    return (ocorrenciasState || []).reduce((acc, oc) => {
      const lat = Number(oc.latitude);
      const lng = Number(oc.longitude);
      if (!isFinite(lat) || !isFinite(lng)) return acc;
      const chave = `${lat.toFixed(5)}_${lng.toFixed(5)}`;
      if (!acc[chave]) acc[chave] = { items: [], count: 0, latitude: lat, longitude: lng };
      acc[chave].items.push(oc);
      acc[chave].count += 1;
      return acc;
    }, {});
  }, [ocorrenciasState]);

  const getBadgeColor = (count) => {
    if (count >= 10) return '#E53935';
    if (count >= 5) return '#FB8C00';
    if (count >= 2) return '#FDD835'; 
    return null; 
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
    try {
      const lat = Number(oc?.latitude);
      const lng = Number(oc?.longitude);
      const chave = isFinite(lat) && isFinite(lng) ? `${lat.toFixed(5)}_${lng.toFixed(5)}` : null;

      let items = [];
      if (chave && ocorrenciasAgrupadas && ocorrenciasAgrupadas[chave]) {
        items = ocorrenciasAgrupadas[chave].items || [];
      }

      if ((!items || items.length === 0) && oc?.endereco) {
        items = (ocorrenciasState || []).filter(o => {
          try { return String(o.endereco).trim() === String(oc.endereco).trim(); } catch { return false; }
        });
      }

      if (!items || items.length === 0) items = [oc];

      setOcorrenciasNoEndereco(items);

      const idx = Math.max(0, items.findIndex(i => (i.id ?? i._id) === (oc.id ?? oc._id)));
      setModalIndex(idx);
      setSelectedOcorrencia(items[idx] || items[0]);
      setModalVisible(true);

      setTimeout(() => {
        try { flatListRef.current?.scrollToIndex({ index: idx, animated: true }); } catch (e) {}
      }, 40);

      setLoadingComentarios(true);
      const idInicial = items[idx]?.id ?? items[idx]?._id;
      if (idInicial) {
        const coms = await carregarComentarios(idInicial).catch(()=>[]);
        setComentarios(coms || []);
      } else setComentarios([]);
      setLoadingComentarios(false);
    } catch (e) {
      console.warn('abrirModal erro', e);
      setOcorrenciasNoEndereco([oc]);
      setSelectedOcorrencia(oc);
      setModalVisible(true);
    }
  };

  const fecharModal = () => {
    setModalVisible(false);
    setSelectedOcorrencia(null);
    setComentarios([]);
    setMensagemComentario('');
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Data não informada';
      console.log('📅 Data recebida para formatação:', dateString); 
      let date;
      if (dateString instanceof Date) {
        date = dateString;
      }
      else if (typeof dateString === 'string') {
        const cleanString = dateString.trim();
        date = new Date(cleanString);

        if (isNaN(date.getTime())) {
          date = new Date(cleanString.replace(' ', 'T'));
        }

        if (isNaN(date.getTime()) && cleanString.includes('/')) {
          const [day, month, year] = cleanString.split('/');
          date = new Date(`${year}-${month}-${day}`);
        }
      }

      if (!date || isNaN(date.getTime())) {
        console.log('❌ Data inválida após tentativas:', dateString);
        return 'Data não informada';
      }

      const formatted = date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      console.log('✅ Data formatada:', formatted);
      return formatted;

    } catch (error) {
      console.log('❌ Erro ao formatar data:', dateString, error);
      return 'Data não informada';
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
    setInicio('');
    setFim('');
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
        setShowComentarios(false);
      } else {
        const recarregado = await carregarComentarios(idOc);
        setComentarios(recarregado || []);
        setMensagemComentario('');
        setShowComentarios(false);
      }
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível enviar o comentário.');
    } finally {
      setSendingComentario(false);
    }
  };

  useImperativeHandle(ref, () => ({
    centralizarNoEndereco(lat, lon, detalhesEndereco = {}) {
        setInicio(detalhesEndereco.inicio || '');
        setFim(detalhesEndereco.fim || '');
        setAmenity(detalhesEndereco.amenity || '');

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
                  source={getIconForTipoWithCount(first.tipo, quantidade)}
                  style={styles.markerImage}
                />
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
          <Polyline coordinates={rotaCoords} strokeWidth={5} strokeColor="#2bff00b9" />
        )}
      </MapView>

      {/* MODAL 1*/}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={fecharModal}>
        <View style={{ flex: 1, backgroundColor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(0, 34, 68, 0.6)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '85%', maxWidth: 420, height: '85%', maxHeight: 520, backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF', borderRadius: 16, overflow: 'hidden' }}>
            
           
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: isDarkMode ? '#0c2946ff' : '#012E61', paddingHorizontal: 20, paddingVertical: 14 }}>
              <Text style={{ fontSize: 19, fontWeight: '700', color: '#FFF', flex: 1 }}>
                Ocorrència 
              </Text>
              
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                {/* BOTÃO DENUNCIAR */}
                <TouchableOpacity 
                  onPress={() => setModalDenuncia(true)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    backgroundColor: 'rgba(255,0,0,0.2)',
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.3)',
                  }}
                >
                  <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '600' }}>Denunciar</Text>
                </TouchableOpacity>

                {/* BOTÃO FECHAR */}
                <TouchableOpacity style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' }} onPress={fecharModal}>
                  <Text style={{ color: '#FFF', fontSize: 22, fontWeight: 'bold' }}>×</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <OccurrenceCarousel
                items={ocorrenciasNoEndereco && ocorrenciasNoEndereco.length ? ocorrenciasNoEndereco : (selectedOcorrencia ? [selectedOcorrencia] : [])}
                initialIndex={modalIndex || 0}
                carregarComentarios={carregarComentarios}
                onIndexChange={(index) => {
              
                  const currentItem = ocorrenciasNoEndereco && ocorrenciasNoEndereco.length 
                    ? ocorrenciasNoEndereco[index] 
                    : (selectedOcorrencia ? [selectedOcorrencia][index] : null);
                  
                  if (currentItem) {
                  
                    setSelectedOcorrencia(currentItem);
                    
                
                    if (carregarComentarios) {
                      carregarComentarios(currentItem.id ?? currentItem._id);
                    }
                  }
                }}
                renderDetail={(item, ctx) => {
                  return (
                

                    <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 16 }} showsVerticalScrollIndicator={false}>
                      
                      {/* INFORMAÇÕES DA OCORRÊNCIA PABLO  */}
                      <View style={{ marginBottom: 24, backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: isDarkMode ? '#3A3A3C' : '#E5E8ED' }}>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: isDarkMode ? '#4FC3F7' : '#012E61', marginBottom: 10 }}>Informações</Text>
                        
                        {/* CARROSSEL PARA TIPOS DE OCORRÊNCIA PABLO*/}
                        <View style={{ marginBottom: 16 }}>
                          <Text style={{ fontSize: 13, fontWeight: '600', color: isDarkMode ? '#4FC3F7' : '#012E61', marginBottom: 8 }}>Tipo:</Text>
                          <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false}
                            style={{ flexDirection: 'row' }}
                          >
                            <View style={{
                              backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F6FA',
                              paddingHorizontal: 16,
                              paddingVertical: 8,
                              borderRadius: 20,
                              marginRight: 8,
                              borderWidth: 1,
                              borderColor: isDarkMode ? '#4FC3F7' : '#012E61',
                            }}>
                              <Text style={{ 
                                fontSize: 13, 
                                fontWeight: '600',
                                color: isDarkMode ? '#4FC3F7' : '#012E61',
                              }}>
                                {item?.tipo || '—'}
                              </Text>
                            </View>
                            
                      
                            {ocorrenciasNoEndereco?.filter(oc => oc.tipo !== item?.tipo).slice(0, 3).map((oc, index) => (
                              <View 
                                key={index}
                                style={{
                                  backgroundColor: isDarkMode ? '#2C2C2E' : '#F8F9FA',
                                  paddingHorizontal: 12,
                                  paddingVertical: 6,
                                  borderRadius: 16,
                                  marginRight: 6,
                                  borderWidth: 1,
                                  borderColor: isDarkMode ? '#555' : '#DDD',
                                }}
                              >
                                <Text style={{ 
                                  fontSize: 12, 
                                  color: isDarkMode ? '#AAA' : '#666',
                                }}>
                                  {oc.tipo}
                                </Text>
                              </View>
                            ))}
                          </ScrollView>
                        </View>
                        
                        <View style={{ marginBottom: 10 }}>
                          <Text style={{ fontSize: 13, fontWeight: '600', color: isDarkMode ? '#4FC3F7' : '#012E61' }}>Descrição:</Text>
                          <Text style={{ fontSize: 13, color: isDarkMode ? '#E5E5E7' : '#333', marginTop: 4 }}>{item?.descricao || item?.descricao_curta || item?.texto || '—'}</Text>
                        </View>
                        
                        {/* /// MEXI IMPORTANTE AQUI ANDRE */}
                
                        <View style={{ marginBottom: 10 }}>
                          <Text style={{ fontSize: 13, fontWeight: '600', color: isDarkMode ? '#4FC3F7' : '#012E61' }}>Data:</Text>
                          <Text style={{ fontSize: 13, color: isDarkMode ? '#E5E5E7' : '#333', marginTop: 4 }}>{formatDate(item?.dataAcontecimento)}</Text>
                        </View>
                      </View>

                      {/* ÚLTIMOS 2 COMENTÁRIOS DO LOCAL PABLO */}
                      <View style={{ marginBottom: 24, backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: isDarkMode ? '#3A3A3C' : '#E5E8ED' }}>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: isDarkMode ? '#4FC3F7' : '#012E61', marginBottom: 10 }}>
                          Comentários do Local ({comentarios.length})
                        </Text>

                        {loadingComentarios ? (
                          <View style={{ paddingVertical: 10, alignItems: 'center' }}>
                            <ActivityIndicator size="small" color={isDarkMode ? '#4FC3F7' : '#003366'} />
                            <Text style={{ color: isDarkMode ? '#E5E5E7' : '#333', marginTop: 8, fontSize: 12 }}>
                              Carregando comentários...
                            </Text>
                          </View>
                        ) : comentarios.length === 0 ? (
                          <Text style={{ color: isDarkMode ? '#AAA' : '#666', fontStyle: 'italic', textAlign: 'center', fontSize: 13 }}>
                            Nenhum comentário ainda.
                          </Text>
                        ) : (
                          <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false}>
                            {comentarios.slice(0, 2).map((c, i) => (
                              <View
                                key={c.id ?? i}
                                style={{
                                  backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F6FA',
                                  padding: 10,
                                  borderRadius: 8,
                                  marginBottom: 8,
                                }}
                              >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                  <Text style={{ fontWeight: '700', color: isDarkMode ? '#4FC3F7' : '#012E61', fontSize: 12 }}>
                                    {c.usuario?.name || c.usuario?.nome || 'Usuário'}
                                  </Text>
                                  <Text style={{ fontSize: 10, color: isDarkMode ? '#CCC' : '#777' }}>
                                    {formatDate(c.data ?? c.created_at)}
                                  </Text>
                                </View>
                                <Text style={{ fontSize: 12, color: isDarkMode ? '#E5E5E7' : '#333', lineHeight: 16 }}>
                                  {c.mensagem}
                                </Text>
                              </View>
                            ))}
                            
                            {comentarios.length > 2 && (
                              <Text style={{ color: isDarkMode ? '#4FC3F7' : '#012E61', fontSize: 12, textAlign: 'center', marginTop: 8, fontStyle: 'italic' }}>
                                +{comentarios.length - 2} comentários
                              </Text>
                            )}
                          </ScrollView>
                        )}
                      </View>
                    </ScrollView>
                  );
                }}
              />

              {/* BOTÃO VER COMENTÁRIOS AQUI PABLO */}
              <View
                style={{
                  padding: 16,
                  backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
                  borderTopWidth: 1,
                  borderColor: isDarkMode ? '#3A3A3C' : '#E5E8ED',
                }}
              >
                <TouchableOpacity
                  onPress={() => setShowComentarios(true)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isDarkMode ? '#0c2946ff' : '#003366',
                    paddingVertical: 12,
                    borderRadius: 10,
                    gap: 8,
                  }}
                >
                  <FontAwesome 
                    name="comment-o" 
                    size={18} 
                    color="#FFF" 
                  />
                  <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 15 }}>
                    Ver Comentários ({comentarios.length})
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 2 - o de DENÚNCIA */}
      <Modal visible={modalDenuncia} transparent animationType="slide" onRequestClose={() => setModalDenuncia(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { 
            backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
            paddingVertical: 24 
          }]}>
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ 
                fontSize: 18, 
                fontWeight: '700', 
                marginBottom: 16,
                color: isDarkMode ? '#FFF' : '#000',
                textAlign: 'center'
              }}>
                Denunciar Ocorrência
              </Text>
              
              <Text style={{ 
                marginBottom: 20, 
                textAlign: 'center',
                color: isDarkMode ? '#E5E5E7' : '#333',
                lineHeight: 20
              }}>
                Tem certeza que quer denunciar esta ocorrência?
              </Text>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', gap: 12 }}>
                <Pressable 
                  onPress={() => setModalDenuncia(false)} 
                  style={{ 
                    flex: 1, 
                    padding: 12, 
                    backgroundColor: isDarkMode ? '#2C2C2E' : '#F0F0F0',
                    borderRadius: 8,
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ color: isDarkMode ? '#FFF' : '#333', fontWeight: '600' }}>Cancelar</Text>
                </Pressable>
                
                <Pressable 
                  onPress={() => {
                    denunciarOcorrencia(selectedOcorrencia?.id ?? selectedOcorrencia?._id);
                    setModalDenuncia(false);
                  }} 
                  style={{ 
                    flex: 1, 
                    padding: 12, 
                    backgroundColor: '#FF3B30',
                    borderRadius: 8,
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ color: '#FFF', fontWeight: '600' }}>Denunciar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 3 - COMENTÁRIOS COMPLETOS */}
      {showComentarios && (
        <Modal
          visible={showComentarios}
          transparent
          animationType="slide"
          onRequestClose={() => setShowComentarios(false)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(0, 34, 68, 0.8)',
              justifyContent: 'flex-end',
            }}
          >
            <View
              style={{
                height: '70%',
                backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                overflow: 'hidden',
              }}
            >
              
              {/* HEADER */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: isDarkMode ? '#0c2946ff' : '#012E61',
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '700',
                    color: '#FFF',
                  }}
                >
                  Comentários ({comentarios.length})
                </Text>

                <TouchableOpacity
                  onPress={() => setShowComentarios(false)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#FFF', fontSize: 20, fontWeight: 'bold' }}>×</Text>
                </TouchableOpacity>
              </View>

              {/* /// RETIREI UM BGLH IMPORTANTE no CSS AQUI ANDRE */}

             
            
              {/* LISTA DE COMENTÁRIOS */}
              <ScrollView
                style={{
                  flex: 1,
                  paddingHorizontal: 20,
                  paddingVertical: 16,
                }}
                showsVerticalScrollIndicator={false}
              >
                {loadingComentarios ? (
                  <View style={{ paddingVertical: 20 }}>
                    <ActivityIndicator size="small" color={isDarkMode ? '#4FC3F7' : '#003366'} />
                    <Text
                      style={{
                        textAlign: 'center',
                        marginTop: 12,
                        color: isDarkMode ? '#E5E5E7' : '#333',
                      }}
                    >
                      Carregando comentários...
                    </Text>
                  </View>
                ) : comentarios.length === 0 ? (
                  <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                    <FontAwesome name="comments-o" size={48} color={isDarkMode ? '#555' : '#CCC'} />
                    <Text
                      style={{
                        color: isDarkMode ? '#AAA' : '#666',
                        fontStyle: 'italic',
                        textAlign: 'center',
                        marginTop: 12,
                      }}
                    >
                      Nenhum comentário ainda.
                    </Text>
                    <Text
                      style={{
                        color: isDarkMode ? '#777' : '#999',
                        fontSize: 12,
                        textAlign: 'center',
                        marginTop: 8,
                      }}
                    >
                      Seja o primeiro a comentar!
                    </Text>
                  </View>
                ) : (
                  comentarios.map((c, i) => (
                    <View
                      key={c.id ?? i}
                      style={{
                        backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F6FA',
                        padding: 12,
                        borderRadius: 10,
                        marginBottom: 12,
                      }}
                    >
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                        <Text style={{ fontWeight: '700', color: isDarkMode ? '#4FC3F7' : '#012E61', fontSize: 14 }}>
                          {c.usuario?.name || c.usuario?.nome || 'Usuário'}
                        </Text>

                        <Text style={{ fontSize: 11, color: isDarkMode ? '#CCC' : '#777' }}>
                          {formatDate(c.data ?? c.created_at)}
                        </Text>
                      </View>

                      <Text style={{ fontSize: 14, color: isDarkMode ? '#E5E5E7' : '#333', lineHeight: 18 }}>
                        {c.mensagem}
                      </Text>
                    </View>
                  ))
                )}
              </ScrollView>

              {/* ENVIAR COMENTÁRIO */}
              <View
                style={{
                  padding: 16,
                  backgroundColor: isDarkMode ? '#2C2C2E' : '#F8F9FA',
                  borderTopWidth: 1,
                  borderColor: isDarkMode ? '#3A3A3C' : '#E5E8ED',
                }}
              >
                <TextInput
                  placeholder="Escreva um comentário..."
                  placeholderTextColor={isDarkMode ? '#777' : '#888'}
                  value={mensagemComentario}
                  onChangeText={setMensagemComentario}
                  style={{
                    borderWidth: 1,
                    borderColor: isDarkMode ? '#3A3A3C' : '#D8DDE5',
                    borderRadius: 10,
                    padding: 12,
                    backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
                    color: isDarkMode ? '#FFF' : '#333',
                    minHeight: 80,
                    textAlignVertical: 'top',
                    fontSize: 14,
                  }}
                  multiline
                  numberOfLines={3}
                />

                <TouchableOpacity
                  onPress={enviarComentario}
                  style={{
                    marginTop: 12,
                    paddingVertical: 12,
                    backgroundColor: isDarkMode ? '#0c2946ff' : '#003366',
                    borderRadius: 10,
                    alignItems: 'center',
                    opacity: sendingComentario ? 0.5 : 1,
                  }}
                  disabled={sendingComentario || !mensagemComentario.trim()}
                >
                  {sendingComentario ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 15 }}>
                      Enviar Comentário
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      
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

  modalCard: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    paddingVertical: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },

  modalIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  modalContent: {
    width: '100%',
    paddingHorizontal: 24,
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },

  modalMessage: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },

  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButton: {
    borderWidth: 2,
    backgroundColor: 'transparent',
  },

  confirmButton: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },

  confirmButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
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