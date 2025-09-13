import React, { useState } from "react";
import { 
  View, Text, TextInput, Pressable, TouchableOpacity, Modal, ActivityIndicator, StyleSheet 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CheckBox from 'expo-checkbox';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { CoordenadaService } from '../../services/CoordenadaService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const RegistrarScreen = ({ navigation }) => {
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('');
  const [descricaoTipo, setDescricaoTipo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const [visivelInicio, setVisivelInicio] = useState(true);
  const [mostrar, setMostrar] = useState(false);
  const [visivelSucesso, setVisivelSucesso] = useState(false);

  const validarDados = () => {
    if (!titulo || !tipo || !latitude || !longitude) {
      setMensagemErro('Preencha todos os campos obrigatórios.');
      return false;
    }
    return true;
  };

  const limparCampos = () => {
      setTitulo('');
      setTipo('');
      setDescricao('');
      setDescricaoTipo('');
      setLatitude('');
      setLongitude('');
  }

  const enviarOcorrencia = async () => {
    if (!validarDados()) return;
    setCarregando(true);
    try {

      const dados = {
        titulo,
        latitude,
        longitude,
        tbTipoOcorrencia: { tipo, descricao: descricaoTipo },
        descricao,
      };

      const tokenUser = await AsyncStorage('userToken');
      const response = await axios.post('http://127.0.0.1:8000/api/...', {dados}, {
        headers: {
          Authorization: `Bearer ${tokenUser}`
        }
      })
      setVisivelSucesso(true);

    } catch (erro) {
      console.log(erro);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconeCabecalho}>
          <FontAwesome name="arrow-left" size={24} color="#12577B" />
        </Pressable>
        <Text style={styles.tituloCabecalho}>Registrar Ocorrência</Text>
        <Pressable onPress={() => navigation.navigate('Configuracao')} style={styles.iconeCabecalho}>
          <FontAwesome name="cog" size={24} color="#12577B" />
        </Pressable>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Título da Ocorrência</Text>
        <TextInput style={styles.input} placeholder="Digite o título..." value={titulo} onChangeText={setTitulo} />

        <Text style={styles.label}>Tipo de Ocorrência</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={tipo} onValueChange={(v) => setTipo(v)} style={styles.picker}>
            <Picker.Item label="Selecione..." value="" />
            <Picker.Item label="Roubo" value="Roubo" />
            <Picker.Item label="Acidente" value="Acidente" />
            <Picker.Item label="Incêndio" value="Incêndio" />
            <Picker.Item label="Outro" value="Outro" />
          </Picker>
        </View>

        <Text style={styles.label}>Descrição do Tipo</Text>
        <TextInput style={styles.input} placeholder="Ex: Assalto à mão armada..." value={descricaoTipo} onChangeText={setDescricaoTipo} />

        <Text style={styles.label}>Latitude</Text>
        <TextInput style={styles.input} placeholder="Digite a latitude..." value={latitude} onChangeText={setLatitude} keyboardType="numeric" />

        <Text style={styles.label}>Longitude</Text>
        <TextInput style={styles.input} placeholder="Digite a longitude..." value={longitude} onChangeText={setLongitude} keyboardType="numeric" />

        <Text style={styles.label}>Descrição</Text>
        <TextInput style={styles.textArea} placeholder="Descreva a ocorrência..." value={descricao} onChangeText={setDescricao} multiline maxLength={120} textAlignVertical="top" />
        <Text style={styles.contador}>{descricao.length}/120</Text>

        {mensagemErro ? <Text style={styles.erro}>{mensagemErro}</Text> : null}
      </View>

      <TouchableOpacity style={[styles.botao, carregando && styles.botaoDesabilitado]} onPress={enviarOcorrencia} disabled={carregando}>
        {carregando ? <ActivityIndicator color="#fff" /> : <Text style={styles.textoBotao}>Enviar</Text>}
      </TouchableOpacity>

      <Modal visible={visivelInicio} transparent animationType="slide" onRequestClose={() => setVisivelInicio(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Como Funciona</Text>
            <Text style={styles.modalText}>1. Escolha o tipo de ocorrência (Ex: Assalto, Alagamento)</Text>
            <Text style={styles.modalText}>2. Informe o local</Text>
            <Text style={styles.modalText}>3. Descreva o que aconteceu</Text>
            <Text style={styles.modalText}>4. Envie sua ocorrência</Text>

            <TouchableOpacity style={styles.primaryButton} onPress={() => setVisivelInicio(false)}>
              <Text style={styles.primaryButtonText}>Fazer Agora</Text>
            </TouchableOpacity>

            <View style={styles.checkboxContainer}>
              <CheckBox value={mostrar} onValueChange={setMostrar} tintColors={{ true: '#12577B', false: '#64748B' }} />
              <Text style={styles.checkboxLabel}>Não mostrar novamente</Text>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={visivelSucesso} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ocorrência enviada com sucesso!</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={() => setVisivelSucesso(false)}>
              <Text style={styles.primaryButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFFFFF' },
  cabecalho: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, paddingHorizontal: 10 },
  tituloCabecalho: { fontSize: 20, fontWeight: '600', color: '#12577B' },
  iconeCabecalho: { padding: 5 },
  form: { marginBottom: 20, backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5 },
  label: { fontSize: 14, fontWeight: '600', color: '#1D3557', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 12, marginBottom: 12, fontSize: 14, color: '#334155' },
  textArea: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 6, padding: 8, minHeight: 80, marginBottom: 4, fontSize: 14, color: '#334155' },
  contador: { fontSize: 12, color: "#94a3b8", textAlign: "right", marginBottom: 12 },
  pickerWrapper: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 12 },
  picker: { height: 50, color: '#334155' },
  botao: { backgroundColor: '#12577B', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  botaoDesabilitado: { opacity: 0.6 },
  textoBotao: { color: '#fff', fontSize: 16, fontWeight: '600' },
  erro: { color: '#E63946', fontSize: 13, marginBottom: 10 },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 20, width: '100%', maxWidth: 400, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#1E293B', marginBottom: 16 },
  modalText: { fontSize: 14, color: '#334155', textAlign: 'center', marginBottom: 12 },
  primaryButton: { backgroundColor: '#12577B', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24, alignItems: 'center', marginTop: 16 },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 16 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  checkboxLabel: { marginLeft: 8, fontSize: 14, color: '#64748B' },
});

export default RegistrarScreen;
