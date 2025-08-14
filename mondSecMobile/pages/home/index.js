import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, TextInput, Modal, StyleSheet } from 'react-native';
import  {notificacaoService}  from '../../services/NotificacaoService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Mapa from "../../services/MapaService";


const HomeScreen = ({ navigation }) => {
  const [visivelSolicitar, setVisivelSolicitar] = useState(true);
  const [visivelWelcome, setVisivelWelcome] = useState(false);
  let vidaUtilModal = true;

  
  useEffect(() => {
    const verificarModal = async () => {
      const response = await AsyncStorage.getItem('permissaoNot');
      if(response == 'granted') {
        setVisivelSolicitar(false);
      }


      vidaUtilModal = await AsyncStorage.getItem('vidaUtilModal');
      if(vidaUtilModal === "false") {
        setVisivelWelcome(false);
      }else{
        setVisivelWelcome(true);
      }
    };

    verificarModal();
  },[]);

  const modalPermissao = async () => {
    await notificacaoService();
    setVisivelSolicitar(false);
    if(!visivelWelcome){
      await AsyncStorage.setItem('vidaUtilModal', false);
    }

  };

  return (
    <View>
      <View>
        <TextInput />
      </View>
      <View>
        <Mapa />
      </View>
      <View>
        <Pressable onPress={() => navigation.navigate('Home')}><Text>Home</Text></Pressable>
        <Pressable onPress={() => navigation.navigate('Sobre')}><Text>Sobre</Text></Pressable>
        <Pressable onPress={() => navigation.navigate('Menu')}><Text>Perfil</Text></Pressable>
      </View>

      <Modal animationType="slide" transparent visible={visivelSolicitar}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Aviso!</Text>
            <Text style={styles.modalText}>Este app utiliza a localização do seu dispositivo. É necessário que o acesso esteja ativo.</Text>
            <Text style={styles.modalText}>Deseja permitir o acesso?</Text>
            <Pressable onPress={() => modalPermissao()}>
              <Text style={styles.modalButton}>Sim</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent visible={visivelWelcome}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Bem-vindo ao MondSec!</Text>
            <Text style={styles.modalText}>Seu app de rotas seguras!</Text>
            <Pressable onPress={() => setVisivelWelcome(false)}>
              <Text style={styles.modalButton}>Ok</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  modalText: {
    textAlign: 'center',
    marginBottom: 20
  },
  modalButton: {
    color: '#007BFF',
    marginTop: 10,
    fontWeight: 'bold'
  }
});

export default HomeScreen;
