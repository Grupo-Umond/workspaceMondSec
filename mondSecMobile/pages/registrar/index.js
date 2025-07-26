import React, { useState } from "react";
import { View, Text, Pressable, TextInput, Button, Modal, StyleSheet } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import  CheckBox  from 'expo-checkbox';
import axios from "axios";

const RegistrarScreen = ({ navigation }) => {
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [descricao, setDescricao] = useState('');
  const [visivelFinal, setVisivelFinal] = useState(false);
  const [visivelInicio, setVisivelInicio] = useState(true);
  const [carregando, setCarregando] = useState(false);
  const [mostrar, setMostrar] = useState('');
  const [menssagemErro, setMessagemErro] = useState('');

  const validarDados = () => {
    if (!tipo || !longitude || !latitude) {
      setMessagemErro('Preencha todos os campos obrigatórios.');
      return false;
    }

    if(isNaN(longitude) && longitude.trim() !== '' || isNaN(latitude) && latitude.trim() !== '') {
        setMenssagemErro('Insira apenas numeros nos campo longitude e latitude.')
        return false;
    }
    return true;
  };

  async function enviarOcorrencia() {
    if (!validarDados()) return;

    setCarregando(true);

    const dados = {
        tituloOcorrencia: titulo,
        descricaoTipo: descricao, 
        latitudeOcorrencia: latitude,
        longitudeOcorrencia: longitude,
        tbTipoOcorrencia: {
            tipoOcorrencia: tipo,
            descricaoOcorrencia: descricao
    }
}


    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post('http://127.0.0.1:8000/api/registrar', dados, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setVisivelFinal(true);
    } catch (err) {
      console.log(err);
      setMessagemErro('Erro ao enviar ocorrência');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Voltar</Text>
        </Pressable>
        <Text style={styles.title}>Preencha sua ocorrência</Text>
        <Pressable>
          <Text style={styles.link}>Configurações</Text>
        </Pressable>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Título da Ocorrência</Text>
        <TextInput style={styles.input} placeholder="Digite o título..." onChangeText={setTitulo} />

        <Text style={styles.label}>Tipo de Ocorrência</Text>
        <TextInput style={styles.input} placeholder="Ex: Roubo, Acidente..." onChangeText={setTipo} />

        <Text style={styles.label}>Longitude</Text>
        <TextInput style={styles.input} placeholder="Digite a longitude..." onChangeText={setLongitude} keyboardType="Numeric" />

        <Text style={styles.label}>Latitude</Text>
        <TextInput style={styles.input} placeholder="Digite a latitude..." keyboardType="numeric" onChangeText={setLatitude} />

        <Text style={styles.label}>Descrição</Text>
        <TextInput style={styles.input} placeholder="Descreva a ocorrência..." onChangeText={setDescricao} />

        {menssagemErro ? <Text style={styles.erro}>{menssagemErro}</Text> : null}
      </View>

      <Button
        onPress={enviarOcorrencia}
        title={carregando ? 'Enviando...' : 'Enviar'}
        disabled={carregando}
      />

      <Modal
        animationType='slide'
        transparent={true}
        visible={visivelFinal}
        onRequestClose={() => setVisivelFinal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ocorrência Enviada</Text>
            <Text style={styles.modalText}>Sua ocorrência foi registrada com sucesso.</Text>
            <Pressable onPress={() => {
              setVisivelFinal(false);
              setTitulo('');
              setTipo('');
              setDescricao('');
              setLatitude('');
              setLongitude('');
            }}>
              <Text style={styles.modalButton}>Nova Ocorrência</Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Ocorrencia')}>
              <Text style={styles.modalButton}>Ver Minhas Ocorrências</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        animationType='slide'
        transparent={true}
        visible={visivelInicio}
        onRequestClose={() => setVisivelInicio(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>1.Escolha o tipo de ocorrência</Text>
            <Text style={styles.modalText}>Ex: Assalto, Alagamento</Text>

            <Text style={styles.modalText}>2.Informe o local</Text>
            <Text style={styles.modalText}> Pode inserir o CEP ou nme da rua</Text>

            <Text style={styles.modalText}>3.Descreva o que aconteceu</Text>
            <Text style={styles.modalText}> Forneça os detalhes claros e objetivos</Text>

            <Text style={styles.modalText}>4.Adicione o periodo do ocorridoo é opcional</Text>
            <Text style={styles.modalText}> Pode ser algo recorrente de tal horario</Text>

            <Text style={styles.modalText}>5.Envie sua ocorrência</Text>
            <Text style={styles.modalText}> Acompanhe o status no menu "Minhas"</Text>

            <Pressable onPress={() => {
              setVisivelInicio(false);
            }}>
              <Text style={styles.modalButton}>Fazer Agora</Text>
            </Pressable>
            <View style={styles.checkboxContainer}>
                <CheckBox value={mostrar} onValueChange={setMostrar} />
                <Text style={styles.checkboxLabel}>Não mostrar novamente</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RegistrarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0F4F7'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  link: {
    color: '#007BFF',
    fontWeight: 'bold'
  },
  form: {
    marginBottom: 20
  },
  label: {
    fontWeight: '600',
    marginBottom: 5
  },
  input: {
    backgroundColor: '#FFF',
    borderColor: '#CCC',
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    marginBottom: 10
  },
  erro: {
    color: 'red',
    marginBottom: 10
  },
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
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16 
  },
  checkboxLabel: {
    marginLeft: 8 
  },
});
