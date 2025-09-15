import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, TextInput, Modal, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EnderecoService } from '../../../services/EnderecoService';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from 'axios';

const OcorrenciaScreen = ({ navigation }) => {
  const [ocorrencias, setOcorrencias] = useState([]);
  const [quantidade, setQuantidade] = useState(0);
  const [informacao, setInformacao] = useState(false);
  const [indice, setIndice] = useState(null);

  useEffect(() => {
    const getOcorrencias = async () => {
      try {
        const tokenUser = await AsyncStorage.getItem('userToken');
        const response = await axios.get('http://127.0.0.1:8000/api/ocorrencia/procurar', {
          headers: {
            Authorization: `Bearer ${tokenUser}`,
          },
        });

        const data = response.data;
        console.log(data);

        const comEndereco = await Promise.all(
          data.map(async (ocorrencia) => {
            try {
              const endereco = await EnderecoService(
                ocorrencia.latitude,
                ocorrencia.longitude
              );
              console.log(endereco);
              return {
                ...ocorrencia,
                rua: endereco.road || 'Rua não encontrada',
                cidade: endereco.city || 'Cidade não encontrada',
              };
            } catch (erro) {
              console.log(erro);
              return {
                ...ocorrencia,
                rua: 'Rua não encontrada',
                cidade: 'Cidade não encontrada',
              };
            }
          })
        );

        setOcorrencias(comEndereco);
        setQuantidade(comEndereco.length);
      } catch (erro) {
        console.log('Erro interno: ', erro);
      }
    };

    getOcorrencias();
  }, []);

  const mostrarModal = (index) => {
    setIndice(index);
    setInformacao(true);
  };

  const desaparecer = async () => {
    setInformacao(false);
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <Pressable onPress={() => navigation.navigate('Home')} style={styles.iconeCabecalho}>
          <FontAwesome name="arrow-left" size={24} color="#12577B" />
        </Pressable>
        <Text style={styles.tituloCabecalho}>Seu Perfil</Text>
        <Pressable onPress={() => navigation.navigate('Configuracao')} style={styles.iconeCabecalho}>
          <FontAwesome name="cog" size={24} color="#12577B" />
        </Pressable>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="Pesquisar ocorrências..."
        placeholderTextColor="#A2A2A2"
      />

      <View style={styles.topSection}>
        <Text style={styles.totalOcorrencias}>Total de Ocorrências: {quantidade}</Text>
        <Pressable onPress={() => navigation.navigate('Registrar')} style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      </View>

      <View>
        {ocorrencias.map((ocorrencia, index) => (
          <View key={index} style={[styles.card, styles[`card${ocorrencia.tipo}`]]}>
            <View style={styles.cardHeader}>
              <Text>{ocorrencia.titulo}</Text>
            </View>
            <Text>Cidade: {ocorrencia.cidade}</Text>
            <Text>Rua: {ocorrencia.rua}</Text>
            <Text>Registrado em: {ocorrencia.data}</Text>
            <Pressable onPress={() => mostrarModal(index)} style={styles.detailsButton}>
              <Text style={styles.detailsButtonText}>Ver detalhes</Text>
            </Pressable>
          </View>
        ))}
      </View>

      <Modal animationType="slide" visible={informacao} transparent>
        {indice != null && ocorrencias[indice] && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Detalhes</Text>
              <Text style={styles.modalText}>{ocorrencias[indice].titulo}</Text>
              <Text style={styles.modalText}>{ocorrencias[indice].rua}</Text>
              <Text style={styles.modalText}>{ocorrencias[indice].cidade}</Text>
              <Text style={styles.modalText}>{ocorrencias[indice].data}</Text>
              <Text style={styles.modalText}>{ocorrencias[indice].descricao}</Text>

              <Pressable onPress={desaparecer}>
                <Text style={styles.modalButton}>Ver no Mapa</Text>
              </Pressable>
              <Pressable onPress={() => setInformacao(false)}>
                <Text style={styles.modalButton}>Favoritar</Text>
              </Pressable>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  tituloCabecalho: {
    fontSize: 20,
    fontWeight: '600',
    color: '#12577B',
  },
  iconeCabecalho: {
    padding: 5,
  },
  searchBar: {
    height: 40,
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 14,
    color: '#333333',
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalOcorrencias: {
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#12577B',
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    lineHeight: 24,
  },
  card: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cardAddress: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  cardDate: {
    fontSize: 12,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  detailsButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  detailsButtonText: {
    color: '#12577B',
    fontSize: 14,
    fontWeight: '600',
  },
  cardAlagamento: {
    backgroundColor: '#B3E5FC',
  },
  cardAssalto: {
    backgroundColor: '#FF8A80',
  },
  cardHomicidio: {
    backgroundColor: '#E57373',
  },
});

export default OcorrenciaScreen;
