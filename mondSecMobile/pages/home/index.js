import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, Pressable, TextInput, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons as Icon } from '@expo/vector-icons';

import Mapa from "../../services/MapaService";
import { AuthContext } from '../../services/AuthContext';
import { CoordenadaService } from '../../services/CoordenadaService';
import { LocalizacaoService } from '../../services/LocalizacaoService';
import { NotificacaoService } from '../../services/NotificacaoService';
import { RotaService } from '../../services/RotaService';
import { OcorrenciaService } from '../../services/OcorrenciaService';
import { gerarMultiPoligono } from '../../services/PolygonService';

const HomeScreen = ({ navigation }) => {
  const [permissao, setPermissao] = useState(false);
  const [welcome, setWelcome] = useState(false);
  const [endereco, setEndereco] = useState('');
  const [modalRota, setModalRota] = useState(false);

  const { tokenUser } = useContext(AuthContext);

  const [enderecoInicial, setEnderecoInicial] = useState('');
  const [enderecoFinal, setEnderecoFinal] = useState('');
  const [rotaCalculada, setRotaCalculada] = useState(null);

  const mapaRef = useRef(null);

  useEffect(() => {
    const verificarModal = async () => {
      const vizu = await AsyncStorage.getItem('welcomeSeen');
      if (!vizu) setWelcome(true);

      const perm = await AsyncStorage.getItem('permissaoLocal');
      if (perm !== 'granted') setPermissao(true);
    };

    verificarModal();
  }, []);

  const pedirPermissao = async (permitiu) => {
    if (permitiu) {
      await LocalizacaoService();
      await NotificacaoService();
      await AsyncStorage.setItem('permissaoLocal', 'granted');
      setPermissao(false);
    } else {
      await AsyncStorage.setItem('permissaoLocal', 'denied');
      setPermissao(false);
    }
    setPermissao(false);
  };

  const esconderModal = async () => {
    await AsyncStorage.setItem('welcomeSeen', 'ok');
    setWelcome(false);
  };

  const buscarEndereco = async () => {
    try {
      const coords = await CoordenadaService(endereco);
      mapaRef.current?.centralizarNoEndereco(coords.lat, coords.lon);
    } catch (e) {
      alert("Endereço não encontrado!");
    }
  };

const getCoordInicio = async () => {
  const r = await CoordenadaService(enderecoInicial);

  console.log("DEBUG CoordenadaService retorno ===>", r);

  const lat = Number(r.lat || r.latitude);
  const lon = Number(r.lon || r.longitude);

  console.log("DEBUG getCoordInicio FINAL ===>", { latitude: lat, longitude: lon });

  return { latitude: lat, longitude: lon };
};


const getCoordFinal = async () => {
  const r = await CoordenadaService(enderecoFinal );

  console.log("DEBUG CoordenadaService retorno ===>", r);

  const lat = Number(r.lat || r.latitude);
  const lon = Number(r.lon || r.longitude);

  console.log("DEBUG getCoordFinal  FINAL ===>", { latitude: lat, longitude: lon });

  return { latitude: lat, longitude: lon };
};



  const enviarRota = async () => {
    try {
      const origem = await getCoordInicio();
      const destino = await getCoordFinal();
      console.log("ORIGEM ===>", origem);
      console.log("DESTINO ===>", destino);

      const ocorrencias = await OcorrenciaService();
      console.log("RETORNO OCORRENCIAS ===>", ocorrencias);

      const avoid = gerarMultiPoligono(ocorrencias.ocorrencias);
      console.log("AVOID ===>", JSON.stringify(avoid, null, 2));

      const rota = await RotaService(origem, destino, avoid);

      const geometry = rota.features[0].geometry;  

      const coordsMap = geometry.coordinates.map(c => ({
        latitude: c[1],
        longitude: c[0]
      }));

      console.log("COORDS FORMATADAS PARA O MAPA ===>", coordsMap);

      setRotaCalculada(coordsMap);

      mapaRef.current?.desenharRota(coordsMap);

      setModalRota(false);

    } catch (err) {
      console.log("Erro enviarRota:", err);
      alert("Não foi possível calcular a rota segura.");
    }

  };

  return (
    <View style={styles.container}>

      <View style={styles.navCima}>
        <View style={styles.navRota}>
          <Pressable 
            style={styles.navButton} 
            onPress={() => setModalRota(true)}
          >
            <View style={styles.buttonRota}>
              <Icon name="directions" size={28} color="#fafafa" />
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
            <Pressable style={styles.searchButton} onPress={buscarEndereco}>
              <Icon name="search" size={24} color="#003366" />
            </Pressable>
          </View>
        </View>
      </View>


      <View style={styles.mapContainer}>
        <Mapa ref={mapaRef} style={styles.mapImage} />
      </View>

      {tokenUser && (
        <Pressable 
          style={styles.ocorrenciaButton}
          onPress={() => navigation.navigate('Registrar')}
        >
          <Icon name="warning" size={28} color="#FFF" />
        </Pressable>
      )}

     
      <View style={styles.navigationContainer}>
        <Pressable style={styles.navButton} onPress={() => navigation.navigate('Home')}>
          <Icon name="home" size={26} color="#FFF" />
          <Text style={styles.navButtonText}>Início</Text>
        </Pressable>

        <Pressable style={styles.navButton} onPress={() => navigation.navigate('Sobre')}>
          <View style={styles.centralButton}>
            <Icon name="info" size={28} color="#003366" />
          </View>
        </Pressable>

        {tokenUser ? (
          <Pressable style={styles.navButton} onPress={() => navigation.navigate('Menu')}>
            <Icon name="person" size={26} color="#FFF" />
            <Text style={styles.navButtonText}>Perfil</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.navButton} onPress={() => navigation.navigate('Login')}>
            <Icon name="person" size={26} color="#FFF" />
            <Text style={styles.navButtonText}>Entrar</Text>
          </Pressable>
        )}
      </View>

      <Modal animationType="slide" transparent visible={welcome}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Bem-vindo ao MondSec!</Text>
            <Text style={styles.modalText}>Seu app de rotas seguras!</Text>
            <Pressable onPress={esconderModal}>
              <Text style={styles.modalButton}>Ok</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent visible={permissao}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Aviso!</Text>
            <Text style={styles.modalText}>Esse aplicativo precisa da sua localização.</Text>
            <Pressable onPress={() => pedirPermissao(true)}>
              <Text style={styles.modalButton}>Sim</Text>
            </Pressable>
            <Pressable onPress={() => pedirPermissao(false)}>
              <Text style={styles.modalButton}>Não</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent visible={modalRota}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Pressable onPress={() => setModalRota(false)}><Text>Fechar</Text></Pressable>
            <Text>Para onde você quer ir?</Text>

            <Text>Local de início</Text>
            <TextInput
              
              placeholder="Digite o endereço..."
              value={enderecoInicial}
              onChangeText={setEnderecoInicial}
            />

            <Text>Destino</Text>
            <TextInput
              placeholder="Digite o endereço..."
              value={enderecoFinal}
              onChangeText={setEnderecoFinal}
            />

            <Pressable onPress={enviarRota}>
              <Text style={styles.modalButton}>Calcular rota</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  navCima: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    zIndex: 10,
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: "#FFF",
    elevation: 3,
  },
  navRota: { marginRight: 10 },
  navButton: { alignItems: "center", justifyContent: "center" },
  buttonRota: { backgroundColor: "#003366", padding: 10, borderRadius: 50 },
  searchContainer: { flex: 1, marginHorizontal: 10 },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 16, color: "#333" },
  searchButton: { padding: 8 },
  mapContainer: { flex: 1 },
  ocorrenciaButton: {
    position: "absolute", bottom: 140, right: 20,
    backgroundColor: "#df4f1f",
    padding: 15, borderRadius: 50,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    backgroundColor: "#003366",
  },
  navButtonText: { color: "#FFF", fontSize: 12, marginTop: 4 },
  centralButton: { backgroundColor: "#FFF", padding: 15, borderRadius: 50 },
  modalContainer: {
    flex: 1, justifyContent: "center",
    alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)"
  },
  modalContent: {
    backgroundColor: "#FFF", padding: 20,
    borderRadius: 15, width: "80%", alignItems: "center",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  modalText: { fontSize: 16, marginBottom: 20, textAlign: "center" },
  modalButton: {
    fontSize: 16, color: "#003366",
    fontWeight: "bold", marginTop: 10
  }
});

export default HomeScreen;
