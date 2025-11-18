import React, { useContext, useState } from "react";
import { View, Text, Pressable, Switch, Linking, StyleSheet, ScrollView} from 'react-native';
import { AuthContext } from "../../services/AuthContext";
import Slider from '@react-native-community/slider';
import CheckBox from 'expo-checkbox';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const ConfiguracaoScreen = ({ navigation, setUserToken }) => {
  const [notificacao, setNotificacao] = useState(true);
  const [oculto, setOculto] = useState(true);
  const [volumeEfeito, setVolumeEfeito] = useState(100);
  const [volumeNotificacao, setVolumeNotificacao] = useState(100);
  const [temaSelecionado, setTemaSelecionado] = useState('claro');
  const { logout } = useContext(AuthContext);

  return (
    <ScrollView contentContainerStyle={styles.container}>
         <View style={styles.cabecalho}>
        <Pressable onPress={() => navigation.navigate('Menu')} style={styles.iconeCabecalho}>
          <FontAwesome name="arrow-left" size={26} color="#12577B" />
        </Pressable>
        <Text style={styles.tituloCabecalho}>Configurações</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Volume</Text>
        <Text>Efeitos</Text>
        <Slider
          style={styles.slider}
          value={volumeEfeito}
          onValueChange={setVolumeEfeito}
          minimumValue={0}
          maximumValue={100}
        />
        <Text style={styles.sectionTitle}>Notificações</Text>
        <Slider
          style={styles.slider}
          value={volumeNotificacao}
          onValueChange={setVolumeNotificacao}
          minimumValue={0}
          maximumValue={100}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notificações</Text>
        <Switch
          value={notificacao}
          onValueChange={setNotificacao}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tema</Text>
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={temaSelecionado === 'claro'}
            onValueChange={() => setTemaSelecionado('claro')}
          />
          <Text style={styles.checkboxLabel}>Claro</Text>
        </View>
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={temaSelecionado === 'escuro'}
            onValueChange={() => setTemaSelecionado('escuro')}
          />
          <Text style={styles.checkboxLabel}>Escuro</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dados e Privacidade</Text>
        <Pressable>
          <Text>Permitir acesso à localização</Text>
        </Pressable>
        <Switch
          value={oculto}
          onValueChange={setOculto}
        />
        <Pressable onPress={() => navigation.navigate('Sobre')}>
          <Text style={styles.linkText}>Ler sobre nós </Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suporte</Text>
        <Pressable>
          <Text>Fale conosco</Text>
        </Pressable>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff', 
    paddingTop: 60,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
    paddingHorizontal: 10,
     gap:80
  },
  tituloCabecalho: {
    fontSize: 20,
    fontWeight: '600',
    color: '#12577B',
   
  },
  section: {
    marginBottom: 25
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#12577B'
  },
  slider: {
    width: '100%',
    height: 40
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  checkboxLabel: {
    marginLeft: 8
  },
  linkText: {
    color: '#12577B',
    textDecorationLine: 'underline',
    marginTop: 5
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 11, 11, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,

    elevation: 5
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center'
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  },
  modalError: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center'
  },
  modalButtonConfirm: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10
  },
  modalButtonCancel: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  }
});

export default ConfiguracaoScreen;
