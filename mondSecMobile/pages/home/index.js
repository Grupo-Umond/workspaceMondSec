import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, TextInput, Modal, StyleSheet } from 'react-native';
import {NotificacaoService} from '../../services/NotificacaoService';
import {LocalizacaoService} from '../../services/LocalizacaoService'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import Mapa from "../../services/MapaService";

const HomeScreen = ({ navigation }) => {

  const [permissao, setPermissao] = useState(false);
  const [welcome, setWelcome] = useState(false);
  let viewModal = true;
   
  useEffect(() => {
    const verificarModal = async () => {
      viewModal = await AsyncStorage.getItem('viewModal');
      if(viewModal === false) {
        setWelcome(true);
      }else{
        setWelcome(false);
      }

      const response = await AsyncStorage.getItem('Localizacao');
      if(response === 'granted') {
        setPermissao(false);
      }else{
        await AsyncStorage.removeItem('Localizacao');
      }
    };

    verificarModal();
  },[]);

  const modalPermissao = async () => {
    await LocalizacaoService();
    setPermissao(false);
    await AsyncStorage.setItem('viewModal', true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Tela Inicial</Text>
        <Pressable style={styles.settingsButton} onPress={() => navigation.navigate('Configuracao')}>
          <Icon name="settings" size={24} color="#003366" /> 
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquise um local..."
          placeholderTextColor="#888"
        />
        <Pressable style={styles.searchButton}>
          <Icon name="search" size={24} color="#003366" /> 
        </Pressable>
      </View>

      <View style={styles.mapContainer}>
         <Mapa style={styles.mapImage} />
  

         <View style={styles.navigationContainer}>
          <Pressable 
            style={({ pressed }) => [
              styles.navButton,
              { opacity: pressed ? 0.6 : 1 }
            ]} 
            onPress={() => navigation.navigate('Home')}
          >
            <Icon name="home" size={26} color="#FFFFFF" />
            <Text style={styles.navButtonText}>Início</Text>
          </Pressable>
          
          <Pressable 
            style={({ pressed }) => [
              styles.navButton,
              { opacity: pressed ? 0.6 : 1 }
            ]} 
            onPress={() => navigation.navigate('Sobre')}
          >
            <View style={styles.centralButton}>
              <Icon name="directions" size={28} color="#003366" />
            </View>
          </Pressable>
          
          <Pressable 
            style={({ pressed }) => [
              styles.navButton,
              { opacity: pressed ? 0.6 : 1 }
            ]} 
            onPress={() => navigation.navigate('Menu')}
          >
            <Icon name="person" size={26} color="#FFFFFF" />
            <Text style={styles.navButtonText}>Perfil</Text>
          </Pressable>
        </View>
             </View>   

      
       <Modal animationType="slide" transparent visible={permissao}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Aviso!</Text>
            <Text style={styles.modalText}>
              Este app utiliza a localização do seu dispositivo. É necessário que o acesso esteja ativo.
            </Text>
              <Text style={styles.modalText}>Deseja permitir o acesso?</Text>
            <Pressable onPress={modalPermissao}>
              <Text style={styles.modalButton}>Sim</Text>
            </Pressable>
            <Pressable onPress={() => setPermissao(false)}>
              <Text style={styles.modalButton}>Cancelar</Text>
            </Pressable>

          </View>
        </View>
      </Modal> 


      <Modal animationType="slide" transparent visible={welcome}>

        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Bem-vindo ao MondSec!</Text>
            <Text style={styles.modalText}>Seu app de rotas seguras!</Text>
            <Pressable onPress={() => {setWelcome(false); setPermissao(true);}}>
              <Text style={styles.modalButton}>Ok</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F0FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
  },
  settingsButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    margin: 10,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#333',
  },
  searchButton: {
    padding: 8,
  },

mapContainer: {
  flex: 1, 
  margin: 18,
  borderRadius: 12,
  overflow: 'hidden',
  width: '90%',
  alignItems: 'center'
},
mapImage: {
  width: '100%',
  flex: 1, 
},
  navigationContainer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 51, 102, 0.9)',
    borderRadius: 28,
    paddingVertical: 8,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  centralButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
    marginTop: -30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#003366',
  },
  modalText: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  modalButton: {
    color: '#007BFF',
    marginTop: 10,
    fontWeight: 'bold',
  },
});

export default HomeScreen;