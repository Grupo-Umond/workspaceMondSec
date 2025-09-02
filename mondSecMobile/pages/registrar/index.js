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
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
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

      // Aqui você pode enviar 'dados' para a sua API
      console.log("Dados a enviar:", dados);

      // Resetando formulário e mostrando modal de sucesso
      setVisivelFinal(true);
      setTitulo('');
      setTipo('');
      setDescricao('');
      setDescricaoTipo('');
      setEndereco('');
      setLatitude('');
      setLongitude('');
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

      {/* Modal Sucesso */}
      <Modal
        animationType='slide'
        transparent={true}
        visible={visivelFinal}
        onRequestClose={() => setVisivelFinal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ocorrência Enviada</Text>
            <Text style={styles.stepDescription}>Sua ocorrência foi registrada com sucesso.</Text>
            <Pressable onPress={() => {
              setVisivelFinal(false);
            }}>
              <Text style={styles.modalButton}>Nova Ocorrência</Text>
            </Pressable>
            <Pressable onPress={() => {
              setVisivelFinal(false);
              navigation.navigate('Ocorrencia');
            }}>
              <Text style={styles.modalButton}>Ver Minhas Ocorrências</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal Tutorial */}
      <Modal
        animationType='slide'
        transparent={true}
        visible={visivelInicio}
        onRequestClose={() => setVisivelInicio(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.modalTitle}>Como Funciona</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setVisivelInicio(false)}
              >
                <Text style={styles.closeIcon}>×</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.stepsContainer}>
              {/* Passos explicativos */}
              {['Escolha o tipo de ocorrência', 'Informe o local', 'Descreva o que aconteceu', 'Envie sua ocorrência'].map((step, index) => (
                <View key={index}>
                  <View style={styles.step}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <View style={styles.stepContent}>
                      <Text style={styles.stepTitle}>{step}</Text>
                    </View>
                  </View>
                  {index < 3 && <View style={styles.stepDivider} />}
                </View>
              ))}
            </View>

            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => setVisivelInicio(false)}
            >
              <Text style={styles.primaryButtonText}>Fazer Agora</Text>
            </TouchableOpacity>
            
            <View style={styles.checkboxContainer}>
              <CheckBox 
                value={mostrar} 
                onValueChange={setMostrar}
                tintColors={{ true: '#12577B', false: '#64748B' }}
              />
              <Text style={styles.checkboxLabel}>Não mostrar novamente</Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles (mantive os seus, apenas ajustei o modalButton que não existia)
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFFFFF' },
  cabecalho: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, paddingHorizontal: 10 },
  tituloCabecalho: { fontSize: 20, fontWeight: '600', color: '#12577B' },
  iconeCabecalho: { padding: 5 },
  form: { marginBottom: 20, backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5 },
  label: { font
