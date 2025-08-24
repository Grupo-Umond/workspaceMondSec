import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, TextInput, Modal, StyleSheet } from 'react-native';
import {NotificacaoService} from '../../services/NotificacaoService';
import {LocalizacaoService} from '../../services/LocalizacaoService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Mapa from "../../services/MapaService";


const HomeScreen = ({ navigation }) => {
  const [permissao, setPermissao] = useState(true);
  const [welcome, setWelcome] = useState(false);
  let viewModal = true;

  
  useEffect(() => {
    const verificarModal = async () => {
      const response = await AsyncStorage.getItem('Localizacao');
      if(response == 'granted') {
        setPermissao(false);
      }


      viewModal = await AsyncStorage.getItem('viewModal');
      if(viewModal === false) {
        setWelcome(false);
      }else{
        setWelcome(true);
      }
    };

    verificarModal();
  },[]);

  const modalPermissao = async () => {
    await LocalizacaoService();
    setPermissao(false);

    if(!welcome){
      const response = await AsyncStorage.getItem('viewModal');
      if(response === false){
      await AsyncStorage.setItem('viewModal', false);
      }
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

      <Modal animationType="slide" transparent visible={permissao}>
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

      <Modal animationType="slide" transparent visible={welcome}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Bem-vindo ao MondSec!</Text>
            <Text style={styles.modalText}>Seu app de rotas seguras!</Text>
            <Pressable onPress={() => setWelcome(false)}>
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
