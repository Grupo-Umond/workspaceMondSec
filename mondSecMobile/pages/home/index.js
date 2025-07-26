import React, {useState} from 'react';
import {View, Text, Pressable, TextInput, Modal, StyleSheet} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const HomeScreen = ({ navigation }) => {
    const [visivelSolicitar, setVisivelSolicitar] = useState(true);
    const [visivelWelcome, setVisivelWelcome] = useState(false);

    return(
        <View>
            <View>
                <TextInput />
            </View>
            <View>
                <Pressable onPress={() => navigation.navigate('Home')}><Text>Home</Text></Pressable>
                <Pressable onPress={() => navigation.navigate('Sobre')}><Text>Sobre</Text></Pressable>
                <Pressable onPress={() => navigation.navigate('Menu')}><Text>Perfil</Text></Pressable>
            </View>
            <Modal
                animationType='slide'
                transparent={true}
                visible={visivelSolicitar}
                onRequestClose={() => setVisivelSolicitar(false)}
            >
                <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Aviso!</Text>
                    <Text style={styles.modalText}>Este app utiliza a localização do seu despositivo. É necessario que o acesso a sua localização esteja ativa</Text>
                    <Text style={styles.modalText}>Deseja permitir o acesso a sua localização?</Text>
                    <Pressable onPress={() => {setVisivelSolicitar(false); setVisivelWelcome(true)}}>
                    <Text style={styles.modalButton}>Sim</Text>
                    </Pressable>
                    <Pressable onPress={() => {setVisivelSolicitar(false); setVisivelWelcome(true);}}>
                    <Text style={styles.modalButton}>Não</Text>
                    </Pressable>
                </View>
                </View>
            </Modal>

            <Modal
                animationType='slide'
                transparent={true}
                visible={visivelWelcome}
                onRequestClose={() => setVisivelWelcome(false)}
            >
                <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Bem Vindo ao MondSec!</Text>
                    <Text style={styles.modalText}>Seu app de rotas segura!</Text>
                    <Pressable onPress={() => {setVisivelWelcome(false);}}>
                    <Text style={styles.modalButton}>Sim</Text>
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