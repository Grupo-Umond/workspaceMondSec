import React, { useState } from "react";
import { 
  View, Text, Picker, Pressable, StyleSheet, TextInput, TouchableOpacity, 
  ActivityIndicator, Modal 
} from 'react-native';
import CheckBox from 'expo-checkbox';
import { CoordenadaService } from '../../services/CoordenadaService';
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from "axios";

const RegistrarScreen = ({ navigation }) => {
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('');
  const [descricaoTipo, setDescricaoTipo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [endereco, setEndereco] = useState('');
  const [visivelFinal, setVisivelFinal] = useState(false);
  const [visivelInicio, setVisivelInicio] = useState(true);
  const [carregando, setCarregando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const [mostrar, setMostrar] = useState(false);

  const validarDados = () => {
    if (!titulo || !tipo || !endereco) {
      setMensagemErro('Preencha todos os campos obrigatórios.');
      return false;
    }
    return true;
  };

  const buscarEndereco = async () => {
    try {
      const coords = await CoordenadaService(endereco);
      return coords;
    } catch (e) {
      alert('Endereço não encontrado');
      throw e;
    }
  };

  const enviarOcorrencia = async () => {
    if (!validarDados()) return;
    setCarregando(true);
    setMensagemErro('');

    try {
      const coords = await buscarEndereco();

      const dados = {
        titulo,
        latitude: coords.latitude,
        longitude: coords.longitude,
        tbTipoOcorrencia: {
          tipo,
          descricao: descricaoTipo
        }
      };

      console.log("Dados a enviar:", dados);

      setVisivelFinal(true);
      setTitulo('');
      setTipo('');
      setDescricao('');
      setDescricaoTipo('');
      setEndereco('');
    } catch (err) {
      console.log(err);
      setMensagemErro('Erro ao enviar ocorrência');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.cabecalho}>
        <Pressable onPress={() => navigation.navigate('Home')} style={styles.iconeCabecalho}>
          <FontAwesome name="arrow-left" size={24} color="#12577B" />
        </Pressable>
        <Text style={styles.tituloCabecalho}>Registrar Ocorrência</Text>
        <Pressable onPress={() => navigation.navigate('Configuracao')} style={styles.iconeCabecalho}>
          <FontAwesome name="cog" size={24} color="#12577B" />
        </Pressable>
      </View>

      {/* Formulário */}
      <View style={styles.form}>
        <Text style={styles.label}>Título da Ocorrência</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Digite o título..." 
          value={titulo}
          onChangeText={setTitulo} 
        />

        <Text style={styles.label}>Tipo de Ocorrência</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={tipo}
            onValueChange={(itemValue) => setTipo(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecione..." value="" />
            <Picker.Item label="Roubo" value="Roubo" />
            <Picker.Item label="Acidente" value="Acidente" />
            <Picker.Item label="Incêndio" value="Incêndio" />
            <Picker.Item label="Outro" value="Outro" />
          </Picker>
        </View>

        <Text style={styles.label}>Descrição do Tipo</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Ex: Assalto à mão armada..." 
          value={descricaoTipo}
          onChangeText={setDescricaoTipo} 
        />

        <Text style={styles.label}>Endereço</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Digite o endereço..." 
          value={endereco}
          onChangeText={setEndereco} 
        />

        <Text style={styles.label}>Descrição da Ocorrência</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Descreva a ocorrência..."
          value={descricao}
          onChangeText={setDescricao}
          multiline
          maxLength={120}
          textAlignVertical="top"
        />
        <Text style={styles.contador}>
          {descricao.length}/120
        </Text>

        {mensagemErro ? <Text style={styles.erro}>{mensagemErro}</Text> : null}
      </View>

      {/* Botão Enviar */}
      <TouchableOpacity
        style={[styles.botao, carregando && styles.botaoDesabilitado]}
        onPress={enviarOcorrencia}
        disabled={carregando}
      >
        {carregando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.textoBotao}>Enviar</Text>
        )}
      </TouchableOpacity>

      {/* Modals (sucesso e tutorial) */}
      {/* ... Mantenha os modais como você já fez ... */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFFFFF' },
  cabecalho: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, paddingHorizontal: 10 },
  tituloCabecalho: { fontSize: 20, fontWeight: '600', color: '#12577B' },
  iconeCabecalho: { padding: 5 },
  form: { marginBottom: 20, backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5 },
  label: { fontSize: 14, color: '#333', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 12 },
  textArea: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, height: 100, marginBottom: 8 },
  contador: { alignSelf: 'flex-end', fontSize: 12, color: '#999', marginBottom: 12 },
  botao: { backgroundColor: '#12577B', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  botaoDesabilitado: { backgroundColor: '#64748B' },
  textoBotao: { color: '#fff', fontSize: 16, fontWeight: '600' }
});

export default RegistrarScreen;
