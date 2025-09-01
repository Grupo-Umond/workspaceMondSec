import React, {useState, useEffect} from "react";
import {Pressable, View, Button, Text, StyleSheet} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from "axios";

const OcorrenciaScreen = ({navigation}) => {
    const [ocorrencias, setOcorrencias] = useState([]);
    const [lengthNumber, setLenghtNumber] = useState('');

    useEffect(() => {

        buscarOcorrencia();

    }, []);

    
    async function buscarOcorrencia() {
        try{
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                console.log("Token não recebido.")
                return;
            }
            
            const {data} = await axios.get('http://127.0.0.1:8000/api/procurar', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!data) {
                console.log("Tem parada errada parceiro");
            }

            console.log(data);

            setOcorrencias(data);
            setLenghtNumber(data.length);
        } catch(err) {
            console.log(err);
        }
    }

    return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.cabecalho}>
        <Pressable
          onPress={() => navigation.navigate('Home')}
          style={styles.iconeCabecalho}
        >
          <FontAwesome name="arrow-left" size={24} color="#12577B" />
        </Pressable>
        <Text style={styles.tituloCabecalho}>Seu Perfil</Text>
        <Pressable
          onPress={() => navigation.navigate('Configuracao')}
          style={styles.iconeCabecalho}
        >
          <FontAwesome name="cog" size={24} color="#12577B" />
        </Pressable>
      </View>

      {/* Barra de Pesquisa */}
      <TextInput
        style={styles.searchBar}
        placeholder="Pesquisar ocorrências..."
        placeholderTextColor="#A2A2A2"
      />

      {/* Total de Ocorrências e botão adicionar */}
      <View style={styles.topSection}>
        <Text style={styles.totalOcorrencias}>
          Total de Ocorrências: {lengthNumber}
        </Text>
        <Pressable
          onPress={() => navigation.navigate('Registrar')}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      </View>

      {/* Lista de ocorrências */}
      <View>
        {ocorrencias.map((ocorrencia, index) => (
          <View
            key={index}
            style={[styles.card, styles[`card${ocorrencia.tipo}`]]} 
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{ocorrencia.titulo}</Text>
              <FontAwesome name={ocorrencia.longitude} size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.cardAddress}>{ocorrencia.latitude}</Text>
            <Text style={styles.cardDate}>
              Registrado em: {ocorrencia.data}
            </Text>
            <Pressable style={styles.detailsButton}>
              <Text style={styles.detailsButtonText}>Ver detalhes</Text>
            </Pressable>
          </View>
        ))}
      </View>
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