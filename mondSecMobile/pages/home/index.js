import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, Pressable, TextInput, Modal, StyleSheet, Image, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import Mapa from "../../services/MapaService";
import { AuthContext } from '../../services/AuthContext';
import { CoordenadaService } from '../../services/CoordenadaService';
import { LocalizacaoService } from '../../services/LocalizacaoService';
import { NotificacaoService } from '../../services/NotificacaoService';
import { Dimensions } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../services/themes/themecontext";   // ⬅️ TEMA AQUI

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {

  const { theme, isDarkMode } = useTheme();   // ⬅️ PEGANDO O TEMA

  const [permissao, setPermissao] = useState(false);
  const [welcome, setWelcome] = useState(false);
  const [endereco, setEndereco] = useState('');
  const { tokenUser } = useContext(AuthContext);
  const mapaRef = useRef(null);
  const [modalSobreVisible, setModalSobreVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    { id: "1", titulo: "Introdução", texto: "Bem-vindo ao seu app de segurança!", imagem: require("../../assets/escudo.png") },
    { id: "2", titulo: "Monitoramento", texto: "Acompanhe tudo em tempo real.", imagem: require("../../assets/olho.png") },
    { id: "3", titulo: "Incidentes", texto: "Ações rápidas de emergência.", imagem: require("../../assets/Alerta.png") },
    { id: "4", titulo: "Personalização", texto: "Escolha temas, modo escuro e mais.", imagem: require("../../assets/setting.png") },
    { id: "5", titulo: "Aviso", texto: "Use o app de forma responsável.", imagem: require("../../assets/xis.png") }
  ];

  useEffect(() => {
    const verificarModal = async () => {
      const vizualizacao = await AsyncStorage.getItem('welcomeSeen');
      if (!vizualizacao) setWelcome(true);

      const response = await AsyncStorage.getItem('permissaoLocal');
      if (response !== 'granted') setPermissao(true);
    };
    verificarModal();
  }, []);

  const pedirPermissao = async (permitiu) => {
    if (permitiu) {
      await LocalizacaoService();
      await AsyncStorage.setItem('permissaoLocal', 'granted');
      await NotificacaoService();
    } else {
      await AsyncStorage.setItem('permissaoLocal', 'denied');
    }
    setPermissao(false);
  };

  const esconderModal = async () => {
    await AsyncStorage.setItem('welcomeSeen', 'ok');
    setWelcome(false);
    setPermissao(true);
  };

  const buscarEndereco = async () => {
    try {
      const coords = await CoordenadaService(endereco);
      mapaRef.current?.centralizarNoEndereco(coords.lat, coords.lng);
    } catch (e) {
      alert('Endereço não encontrado');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      {/* NAV CIMA */}
      <View
        style={[
          styles.navCima,
          { backgroundColor: theme.background, shadowColor: theme.text }
        ]}
      >
        <View style={styles.navRota}>
          <Pressable 
            style={({ pressed }) => [
              styles.navButton,
              { opacity: pressed ? 0.6 : 1 }
            ]}
            onPress={() => navigation.navigate('registrar')}
          >
            <View style={[styles.buttonRota, { backgroundColor: theme.buttonColor }]}>
              <Icon name="directions" size={28} color={theme.icon} />
            </View>
          </Pressable>
        </View>

        {/* PESQUISA */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchInputContainer, { backgroundColor: isDarkMode ? "#222" : "#F5F5F5" }]}>
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Pesquise um local..."
              placeholderTextColor={theme.textSecondary}
              value={endereco}
              onChangeText={setEndereco}
            />
            <Pressable style={styles.searchButton} onPress={buscarEndereco}>
              <Icon name="search" size={24} color={theme.primary} />
            </Pressable>
          </View>
        </View>
      </View>

      {/* MAPA */}
      <View style={styles.mapContainer}>
        <Mapa style={styles.mapImage} />
      </View>

      {/* BOTÃO OCORRÊNCIA */}
      {tokenUser && (
        <Pressable
          style={[styles.ocorrenciaButton, { backgroundColor: theme.danger }]}
          onPress={() => navigation.navigate('Registrar')}
        >
          <Icon name="warning" size={28} color="#FFF" />
        </Pressable>
      )}

      {/* NAV BOTTOM */}
      <SafeAreaView edges={['bottom']} style={[styles.navigationContainer, { backgroundColor: theme.buttonColor }]}>
        
        <Pressable onPress={() => navigation.navigate('Home')} style={styles.navButton}>
          <Icon name="home" size={26} color={theme.icon} />
          <Text style={[styles.navButtonText, { color: theme.icon }]}>Início</Text>
        </Pressable>

        <Pressable onPress={() => setModalSobreVisible(true)} style={styles.navButton}>
          <View style={[styles.centralButton, { backgroundColor: theme.secundary }]}>
            <Icon name="info" size={28} color={theme.primary} />
          </View>
        </Pressable>

        <Pressable 
          onPress={() => navigation.navigate(tokenUser ? 'Menu' : 'Login')}
          style={styles.navButton}
        >
          <Icon name="person" size={26} color={theme.icon} />
          <Text style={[styles.navButtonText, { color: theme.icon }]}>
            {tokenUser ? "Perfil" : "Entrar"}
          </Text>
        </Pressable>

      </SafeAreaView>

      {/* ---- MODAIS ESTÃO ABAIXO ---- */}


      <Modal animationType="slide" transparent visible={welcome}>
        <View style={[styles.modalContainer]}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <Text style={[styles.modalTitle, { color: theme.title }]}>Bem-vindo ao MondSec!</Text>
            <Text style={[styles.modalText, { color: theme.text }]}>Seu app de rotas seguras!</Text>
            <Pressable onPress={esconderModal}>
              <Text style={[styles.modalButton, { color: theme.primary }]}>Ok</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* PERMISSÃO */}
      <Modal animationType="slide" transparent visible={permissao}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <Text style={[styles.modalTitle, { color: theme.title }]}>Aviso!</Text>
            <Text style={[styles.modalText, { color: theme.text }]}>
              Esse aplicativo precisa da sua localização!
            </Text>

            <Pressable onPress={() => { setPermissao(false); pedirPermissao(true); }}>
              <Text style={[styles.modalButton, { color: theme.primary }]}>Sim</Text>
            </Pressable>

            <Pressable onPress={() => pedirPermissao(false)}>
              <Text style={[styles.modalButton, { color: theme.primary }]}>Não</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* CARROSSEL */}
      <Modal visible={modalSobreVisible} animationType="fade" transparent>
        <View style={styles.overlay}>
          <View style={[styles.modalCarrosselContent, { backgroundColor: theme.background }]}>
            
            <Pressable style={styles.closeButton} onPress={() => setModalSobreVisible(false)}>
              <Text style={[styles.closeButtonText, { color: theme.primary }]}>✕</Text>
            </Pressable>

            <FlatList
              data={slides}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.slide}>
                  <View style={styles.imageContainer}>
                    <View style={[styles.imageBackground, { backgroundColor: theme.background }]}>
                      <Image source={item.imagem} style={styles.slideImage} />
                    </View>
                  </View>
                  <Text style={[styles.slideTitle, { color: theme.primary }]}>{item.titulo}</Text>
                  <Text style={[styles.slideText, { color: theme.textSecondary }]}>{item.texto}</Text>
                </View>
              )}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / (width - 80));
                setCurrentIndex(index);
              }}
            />

            <View style={styles.indicatorContainer}>
              {slides.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    { backgroundColor: isDarkMode ? "#555" : "#E0E6EB" },
                    index === currentIndex && {
                      backgroundColor: theme.primary,
                      width: 26
                    }
                  ]}
                />
              ))}
            </View>

          </View>
        </View>
      </Modal>

    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  navCima: { 
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row', 
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  navRota: { 
    marginRight: 10 
  },
  navButton: { 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  buttonRota: { 
    backgroundColor: '#003366', 
    padding: 10, 
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  searchContainer: { 
    flex: 1, 
    marginHorizontal: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  searchButton: {
    padding: 8,
  },
  localizacaoButton: {
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    marginLeft: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mapContainer: { 
    flex: 1,
  },
  mapImage: {
    flex: 1,
  },
  ocorrenciaButton: {
    position: 'absolute',
    bottom: 140,
    right: 20,
    backgroundColor: '#df4f1fff',
    padding: 15,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#003366',
    paddingVertical: 5,
    paddingHorizontal: 60,
  },
  centralButton: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#003366',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  modalButton: {
    fontSize: 16,
    color: '#003366',
    fontWeight: 'bold',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalCarrosselContent: {
  backgroundColor: '#FFFFFF',
  width: '90%',
  maxWidth: 380,
  paddingVertical: 25,
  paddingHorizontal: 0,
  borderRadius: 24,
  alignItems: 'center',
  shadowColor: '#003366',
  shadowOffset: { width: 0, height: 12 },
  shadowOpacity: 0.15,
  shadowRadius: 24,
  elevation: 15,
  borderWidth: 1,
  borderColor: 'rgba(0, 51, 102, 0.08)',
  overflow: 'hidden',
},

slide: {
  width: width - 80,
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 10,
},

overlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.75)',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20,
},

closeButton: {
  alignSelf: 'flex-end',
  padding: 10,
  backgroundColor: '#F5F8FF',
  borderRadius: 20,
  width: 45,
  height: 45,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 8,
  marginBottom: 10,
  borderWidth: 1,
  borderColor: 'rgba(0, 51, 102, 0.1)',
},

closeButtonText: {
  fontSize: 16,
  color: '#003366',
  fontWeight: '700',
},

imageContainer: {
  marginBottom: 20,
},

imageBackground: {
  backgroundColor: '#FFFFFF',
  padding: 18,
  borderRadius: 20,
  shadowColor: '#003366',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.2,
  shadowRadius: 12,
  elevation: 8,
},

slideImage: {
  width: 95,
  height: 95,
  borderRadius: 18,
},

slideTitle: {
  fontSize: 22,
  fontWeight: '800',
  marginBottom: 10,
  color: '#003366',
  textAlign: 'center',
  paddingHorizontal: 10,
},

slideText: {
  fontSize: 15,
  textAlign: 'center',
  color: '#5A6C7D',
  lineHeight: 20,
  paddingHorizontal: 20,
},

indicatorContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 15,
  gap: 8,
},

indicator: {
  width: 10,
  height: 10,
  borderRadius: 5,
  backgroundColor: '#E0E6EB',
  transition: 'all 0.25s',
},

indicatorActive: {
  backgroundColor: '#003366',
  width: 26,
  height: 10,
  borderRadius: 6,
},
});

export default HomeScreen;