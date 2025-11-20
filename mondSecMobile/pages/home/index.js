import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, Pressable, TextInput, Modal, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import Mapa from "../../services/MapaService";
import { AuthContext } from '../../services/AuthContext';
import { CoordenadaService } from '../../services/CoordenadaService';
import { LocalizacaoService } from '../../services/LocalizacaoService';
import { NotificacaoService } from '../../services/NotificacaoService';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const [permissao, setPermissao] = useState(false);
  const [welcome, setWelcome] = useState(false);
  const [endereco, setEndereco] = useState('');
  const { tokenUser } = useContext(AuthContext);
  const mapaRef = useRef(null);
  const insets = useSafeAreaInsets(); // Pega os insets do SafeArea

  useEffect(() => {
    const verificarModal = async () => {
      const vizualizacao = await AsyncStorage.getItem('welcomeSeen');
      if (!vizualizacao) {
        setWelcome(true);
      }

      const response = await AsyncStorage.getItem('permissaoLocal');
      if (response !== 'granted') {
        setPermissao(true);
      }
    };
    verificarModal();
  }, []);

  useEffect(() => {
  if (Platform.OS === 'android') {
    NavigationBar.setBackgroundColorAsync('#003366'); // fundo branco
    NavigationBar.setButtonStyleAsync('dark'); // botões escuros
    NavigationBar.setVisibilityAsync('visible'); // garante que esteja visível
    NavigationBar.setPositionAsync('absolute'); // às vezes necessário
  }
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={styles.container}>
        <View style={styles.navCima}>
          <View style={styles.navRota}>
            <Pressable
              style={({ pressed }) => [styles.navButton, { opacity: pressed ? 0.6 : 1 }]}
              onPress={() => navigation.navigate('registrar')}
            >
              <View style={styles.buttonRota}>
                <Icon name="directions" size={28} color="#fafafaff" />
              </View>
            </Pressable>
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Pesquise um local..."
                placeholderTextColor="#888"
                value={endereco}
                onChangeText={setEndereco}
              />
              <Pressable style={styles.searchButton} onPress={() => buscarEndereco()}>
                <Icon name="search" size={24} color="#003366" />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.mapContainer}>
          <Mapa style={styles.mapImage} />
        </View>

        {tokenUser && (
          <Pressable
            style={({ pressed }) => [styles.ocorrenciaButton, { opacity: pressed ? 0.6 : 1 }]}
            onPress={() => navigation.navigate('Registrar')}
          >
            <Icon name="warning" size={28} color="#FFFFFF" />
          </Pressable>
        )}

        {/* Barra de navegação inferior */}
        <View style={[styles.navigationContainer]}>
          <Pressable
            style={({ pressed }) => [styles.navButton, { opacity: pressed ? 0.6 : 1 }]}
            onPress={() => navigation.navigate('Home')}
          >
            <Icon name="home" size={26} color="#FFFFFF" />
            <Text style={styles.navButtonText}>Início</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.navButton, { opacity: pressed ? 0.6 : 1 }]}
            onPress={() => navigation.navigate('Sobre')}
          >
            <View style={styles.centralButton}>
              <Icon name="info" size={28} color="#003366" />
            </View>
          </Pressable>

          {tokenUser ? (
            <Pressable
              style={({ pressed }) => [styles.navButton, { opacity: pressed ? 0.6 : 1 }]}
              onPress={() => navigation.navigate('Menu')}
            >
              <Icon name="person" size={26} color="#FFFFFF" />
              <Text style={styles.navButtonText}>Perfil</Text>
            </Pressable>
          ) : (
            <Pressable
              style={({ pressed }) => [styles.navButton, { opacity: pressed ? 0.6 : 1 }]}
              onPress={() => navigation.navigate('Login')}
            >
              <Icon name="person" size={26} color="#FFFFFF" />
              <Text style={styles.navButtonText}>Entrar</Text>
            </Pressable>
          )}
        </View>

        {/* Modais */}
        <Modal animationType="slide" transparent visible={welcome}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Bem-vindo ao MondSec!</Text>
              <Text style={styles.modalText}>Seu app de rotas seguras!</Text>
              <Pressable onPress={() => esconderModal()}>
                <Text style={styles.modalButton}>Ok</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <Modal animationType="slide" transparent visible={permissao}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Aviso!</Text>
              <Text style={styles.modalText}>
                Esse aplicativo precisa da sua localização!
              </Text>
              <Pressable
                onPress={() => {
                  setPermissao(false);
                  pedirPermissao(true);
                }}
              >
                <Text style={styles.modalButton}>Sim</Text>
              </Pressable>
              <Pressable onPress={() => pedirPermissao(false)}>
                <Text style={styles.modalButton}>Não</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
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
    paddingTop: 10,
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
    bottom: 80,
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
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#003366',
    paddingVertical: 5,
    paddingHorizontal: 10,
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
});

export default HomeScreen;