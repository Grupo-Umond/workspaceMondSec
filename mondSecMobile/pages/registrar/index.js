import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Button,
  FlatList,
  ScrollView,
} from 'react-native';

import CheckBox from 'expo-checkbox';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { CoordenadaService } from '../../services/CoordenadaService';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import UrlService from '../../services/UrlService';
import { useTheme } from "../../services/themes/themecontext";

const RegistrarScreen = ({ navigation }) => {
  const { theme } = useTheme();

  const [carregando, setCarregando] = useState(false);
  const [visivelInicio, setVisivelInicio] = useState(false);
  const [mostrar, setMostrar] = useState(false);
  const [visivelSucesso, setVisivelSucesso] = useState(false);

  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');

  const [titulo, setTitulo] = useState('');
  const [dataAcontecimento, setDataAcontecimento] = useState('');
  const [tipo, setTipo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [buscaTipo, setBuscaTipo] = useState('');
  const [dropdownAberto, setDropdownAberto] = useState(false);

  const tiposOcorrencia = [ /* ... SUA LISTA ENORME AQUI ... */ ];

  const tiposFiltrados = tiposOcorrencia.filter(item =>
    item.toLowerCase().includes(buscaTipo.toLowerCase())
  );

  useEffect(() => {
    const checarModal = async () => {
      const mostrarSalvo = await AsyncStorage.getItem('mostrarModalInicio');
      if (mostrarSalvo !== 'true') {
        setVisivelInicio(true);
        setMostrar(false);
      } else {
        setVisivelInicio(false);
        setMostrar(true);
      }
    };
    checarModal();
  }, []);

  const formatDateBR = (d) => {
    if (!d) return '';
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  const onChange = (event, selectedDateValue) => {
    setShow(false);
    if (selectedDateValue) {
      setSelectedDate(selectedDateValue);
      setDataAcontecimento(formatDateBR(selectedDateValue));
    }
  };

  const toggleMostrar = async (value) => {
    setMostrar(value);
    await AsyncStorage.setItem('mostrarModalInicio', value ? 'true' : 'false');
    if (value) setVisivelInicio(false);
  };

  const montarEnderecoCompleto = () => {
    return `${rua}, ${numero}, ${bairro}, ${cidade}`;
  };

  const validarDados = () => {
    if (!titulo || !tipo || !rua || !numero || !bairro || !cidade) {
      setMensagemErro('Preencha todos os campos obrigatórios.');
      return false;
    }
    return true;
  };

  const limparCampos = () => {
    setTitulo('');
    setTipo('');
    setDataAcontecimento('');
    setDescricao('');
    setRua('');
    setNumero('');
    setBairro('');
    setCidade('');
    setBuscaTipo('');
    setSelectedDate(new Date());
  };

  const converterEndereco = async () => {
    try {
      const enderecoCompleto = montarEnderecoCompleto();
      const response = await CoordenadaService(enderecoCompleto);
      return { latitude: response.latitude, longitude: response.longitude };
    } catch (erro) {
      throw new Error('Não foi possível obter coordenadas do endereço');
    }
  };

  const enviarOcorrencia = async () => {
    if (!validarDados()) return;

    setCarregando(true);

    try {
      const { latitude, longitude } = await converterEndereco();
      const dataISO = selectedDate.toISOString().split('T')[0];

      const tokenUser = await AsyncStorage.getItem('userToken');

      if (!tokenUser) throw new Error("Token inválido");

      await UrlService.post(
        '/ocorrencia/registrar',
        { titulo, latitude, longitude, tipo, descricao, dataAcontecimento: dataISO },
        { headers: { Authorization: `Bearer ${tokenUser}` } }
      );

      limparCampos();
      setVisivelSucesso(true);
      setMensagemErro('');

    } catch (erro) {
      setMensagemErro('Falha ao enviar ocorrência, tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={{ backgroundColor: theme.navBackground }} />

      {/* Cabeçalho */}
      <View style={styles.cabecalho}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconeCabecalho}>
          <FontAwesome name="arrow-left" size={20} color={theme.title} />
        </Pressable>
        <Text style={[styles.tituloCabecalho, { color: theme.title }]}>
          Registrar Ocorrência
        </Text>
      </View>

      {/* Formulário */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.form, { backgroundColor: theme.card }]}>

          {/* Título */}
          <Text style={[styles.label, { color: theme.text }]}>Título</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.border }]}
            placeholder="Digite o título..."
            placeholderTextColor={theme.textSecondary}
            value={titulo}
            onChangeText={setTitulo}
          />

          {/* Tipo de ocorrência */}
          <Text style={[styles.label, { color: theme.text }]}>Tipo</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.border }]}
            placeholder="Pesquisar tipo..."
            placeholderTextColor={theme.textSecondary}
            value={buscaTipo}
            onChangeText={texto => {
              setBuscaTipo(texto);
              setTipo(texto);
              setDropdownAberto(true);
            }}
          />

          {dropdownAberto && (
            <View style={[styles.dropdown, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <FlatList
                data={tiposFiltrados}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.item,
                      item === tipo && { backgroundColor: theme.primary }
                    ]}
                    onPress={() => {
                      setTipo(item);
                      setBuscaTipo(item);
                      setDropdownAberto(false);
                    }}
                  >
                    <Text style={[
                      styles.itemTexto,
                      { color: item === tipo ? '#fff' : theme.text }
                    ]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {/* ENDEREÇO */}
          <Text style={[styles.label, { color: theme.text }]}>Rua</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.border, color: theme.text }]}
            placeholder="Ex: Avenida Nordestina"
            placeholderTextColor={theme.textSecondary}
            value={rua}
            onChangeText={setRua}
          />

          <Text style={[styles.label, { color: theme.text }]}>Número</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.border, color: theme.text }]}
            placeholder="Ex: 320"
            placeholderTextColor={theme.textSecondary}
            keyboardType="numeric"
            value={numero}
            onChangeText={setNumero}
          />

          <Text style={[styles.label, { color: theme.text }]}>Bairro</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.border, color: theme.text }]}
            placeholder="Ex: Guaianases"
            placeholderTextColor={theme.textSecondary}
            value={bairro}
            onChangeText={setBairro}
          />

          <Text style={[styles.label, { color: theme.text }]}>Cidade</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBackground, borderColor: theme.border, color: theme.text }]}
            placeholder="Ex: São Paulo"
            placeholderTextColor={theme.textSecondary}
            value={cidade}
            onChangeText={setCidade}
          />

          {/* Descrição */}
          <Text style={[styles.label, { color: theme.text }]}>Descrição</Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: theme.inputBackground, borderColor: theme.border, color: theme.text }]}
            placeholder="Descreva a ocorrência..."
            placeholderTextColor={theme.textSecondary}
            value={descricao}
            onChangeText={setDescricao}
            multiline
            maxLength={120}
            textAlignVertical="top"
          />

          <Text style={{ color: theme.textSecondary }}>
            {dataAcontecimento || 'Nenhuma data selecionada'}
          </Text>

          <Button onPress={() => setShow(true)} title='Selecionar Data' />

          {show && (
            <DateTimePicker
              value={selectedDate}
              mode='date'
              display='default'
              locale='pt-BR'
              onChange={onChange}
            />
          )}

          <Text style={[styles.contador, { color: theme.textSecondary }]}>
            {descricao.length}/120
          </Text>

          {mensagemErro ? (
            <Text style={[styles.erro, { color: theme.danger }]}>
              {mensagemErro}
            </Text>
          ) : null}

        </View>

        {/* BOTÃO ENVIAR */}
        <TouchableOpacity
          style={[
            styles.botao,
            { backgroundColor: theme.buttonColor },
            carregando && styles.botaoDesabilitado
          ]}
          onPress={enviarOcorrencia}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.textoBotao}>Enviar</Text>
          )}
        </TouchableOpacity>

      </ScrollView>

      {/* MODAL - PRIMEIRO USO */}
      <Modal visible={visivelInicio} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.cardbackground }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Como Funciona</Text>

            <Text style={[styles.modalText, { color: theme.textSecondary }]}>1. Escolha o tipo de ocorrência</Text>
            <Text style={[styles.modalText, { color: theme.textSecondary }]}>2. Informe o local</Text>
            <Text style={[styles.modalText, { color: theme.textSecondary }]}>3. Descreva o que aconteceu</Text>
            <Text style={[styles.modalText, { color: theme.textSecondary }]}>4. Envie sua ocorrência</Text>

            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: theme.buttonColor }]}
              onPress={() => setVisivelInicio(false)}
            >
              <Text style={styles.primaryButtonText}>Fazer Agora</Text>
            </TouchableOpacity>

            <View style={styles.checkboxContainer}>
              <CheckBox
                value={mostrar}
                onValueChange={toggleMostrar}
                tintColors={{ true: theme.primary, false: theme.textSecondary }}
              />
              <Text style={[styles.checkboxLabel, { color: theme.text }]}>
                Não mostrar novamente
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL SUCESSO */}
      <Modal visible={visivelSucesso} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.cardbackground }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Ocorrência enviada com sucesso!
            </Text>

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: theme.buttonColor }]}
                onPress={() => setVisivelSucesso(false)}
              >
                <Text style={styles.primaryButtonText}>Fazer mais uma</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.secondaryButton, { borderColor: theme.buttonColor, backgroundColor: theme.buttonColor }]}
                onPress={() => {
                  setVisivelSucesso(false);
                  navigation.navigate('Ocorrencia');
                }}
              >
                <Text style={styles.primaryButtonText}>
                  Ver minhas ocorrências
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },

  iconeCabecalho: { padding: 5 },

  tituloCabecalho: {
    fontSize: 20,
    fontWeight: '600',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },

  form: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
  },

  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },

  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
  },

  textArea: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    minHeight: 80,
    marginBottom: 4,
    fontSize: 14,
  },

  contador: {
    fontSize: 12,
    textAlign: "right",
    marginBottom: 12,
  },

  erro: { fontSize: 13, marginBottom: 10 },

  botao: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },

  botaoDesabilitado: { opacity: 0.6 },

  textoBotao: { color: '#fff', fontSize: 16, fontWeight: '600' },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  modalContent: {
    width: '100%',
    maxWidth: 350,
    padding: 20,
    borderRadius: 12,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },

  modalText: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'center',
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    justifyContent: 'center',
  },

  checkboxLabel: { marginLeft: 8 },

  primaryButton: {
    padding: 14,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },

  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },

  secondaryButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    marginTop: 10,
  },

  buttonGroup: {
    marginTop: 20,
  },

  dropdown: {
    maxHeight: 180,
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 12,
  },

  item: {
    padding: 12,
    borderBottomWidth: 0.5,
  },

  itemTexto: {
    fontSize: 14,
  },
});

export default RegistrarScreen;
