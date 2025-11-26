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
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import UrlService from '../../services/UrlService';

import { useTheme } from "../../services/themes/themecontext"; // THEME AQUI

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

  const tiposOcorrencia = [
    "Tentativa de assalto",
    "Roubo de veículo",
    "Furto de peças de veículo",
    "Briga de rua",
    "Troca de tiros",
    "Disparo de arma de fogo",
    "Furto de cabos elétricos",
    "Bloqueio policial",
    "Perseguição policial",
    "Helicóptero sobrevoando área policial",
    "Colisão entre carros",
    "Atropelamento de pedestre",
    "Capotamento",
    "Caminhão com carga espalhada na pista",
    "Veículo incendiado",
    "Explosão veicular",
    "Veículo abandonado na pista",
    "Ônibus quebrado bloqueando faixa",
    "Tempestade forte",
    "Vendaval derrubando objetos",
    "Nevoeiro intenso",
    "Fumaça na pista",
    "Nevasca",
    "Furacão atingindo região",
    "Ciclone com interdição de vias",
    "Tremor de terra com rachaduras",
    "Onda de calor afetando pavimento",
    "Areia ou poeira reduzindo visibilidade",
    "Explosão de transformador",
    "Curto-circuito em fiação",
    "Vazamento de gás em rua",
    "Vazamento químico",
    "Vazamento de óleo na pista",
    "Vazamento de água com risco de buraco",
    "Fios caídos na via",
    "Poste caído",
    "Buraco em via",
    "Afundamento de asfalto",
    "Erosão em calçada ou pista",
    "Deslizamento de terra em estrada",
    "Desabamento parcial de muro em calçada",
    "Desabamento de ponte ou viaduto",
    "Rachadura estrutural em via",
    "Cratera aberta na pista",
    "Trecho interditado por obras",
    "Bloqueio parcial por manutenção",
    "Sinalização danificada",
    "Semáforo apagado",
    "Semáforo piscando",
    "Falta de energia afetando cruzamento",
    "Falha de iluminação pública",
    "Via sem luz à noite",
    "Lâmpadas queimadas em cruzamento",
    "Queda de árvore bloqueando pista",
    "Galho grande na pista",
    "Entulho ou lixo bloqueando faixa",
    "Materiais de construção na via",
    "Painel publicitário caído",
    "Telhado ou estrutura metálica na rua",
    "Vidros espalhados na pista",
    "Animal de grande porte na pista",
    "Animal silvestre na via",
    "Insetos em enxame na rodovia",
    "Protesto bloqueando via",
    "Manifestação com interdição parcial",
    "Tumulto em evento próximo à via",
    "Rota bloqueada por evento esportivo",
    "Fechamento de rua para show ou feira",
    "Marcha, carreata ou desfile bloqueando tráfego",
    "Trânsito desviado por evento público",
    "Fiscalização eletrônica em operação",
    "Blitz policial",
    "Pedestre desmaiado na calçada",
    "Afogamento em passagem alagada",
    "Polícia técnica interditando local",
    "Falha em radar ou câmera de trânsito",
    "Pane em semáforo inteligente",
    "Falha de energia em cruzamentos",
    "Trilhos bloqueando travessia"
  ];

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
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const onChange = (event, selectedDateValue) => {
    // on iOS the event may be 'dismissed' or a date; on Android selectedDateValue might be undefined when cancelled
    setShow(false);
    if (selectedDateValue) {
      setSelectedDate(selectedDateValue);
      // exibir em pt-BR (DD/MM/YYYY)
      try {
        // preferimos formatDateBR para consistência em todos os dispositivos
        setDataAcontecimento(formatDateBR(selectedDateValue));
      } catch (err) {
        setDataAcontecimento(selectedDateValue.toLocaleDateString('pt-BR'));
      }
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
      console.log("➡️ [DEBUG] Endereço montado:", enderecoCompleto);

      const response = await CoordenadaService(enderecoCompleto);

      console.log("✔️ [DEBUG] Coordenadas retornadas:", response);

      return { latitude: response.latitude, longitude: response.longitude };

    } catch (erro) {
      console.log("❌ [ERRO] converterEndereco:", erro.message || erro);
      throw new Error('Não foi possível obter coordenadas do endereço');
    }
  };

  const enviarOcorrencia = async () => {
    console.log("🚀 [DEBUG] Iniciando envio de ocorrência...");

    if (!validarDados()) {
      console.log("⚠️ [VALIDAÇÃO] Falhou: campos obrigatórios ausentes");
      return;
    }

    setCarregando(true);

    try {
      console.log("🔎 [DEBUG] Buscando coordenadas do endereço...");
      const { latitude, longitude } = await converterEndereco();

      // prepara data em ISO para enviar à API (YYYY-MM-DD)
      const dataISO = selectedDate ? selectedDate.toISOString().split('T')[0] : null;

      console.log("📌 [DEBUG] Dados finais antes de enviar:", {
        titulo, latitude, longitude, tipo, descricao, dataISO
      });

      const tokenUser = await AsyncStorage.getItem('userToken');

      console.log("🔐 [DEBUG] Token encontrado:", tokenUser);

      if (!tokenUser) {
        console.log("❌ [ERRO] Token do usuário está vazio!");
        throw new Error("Token inválido");
      }

      const response = await UrlService.post(
        '/ocorrencia/registrar',
        { titulo, latitude, longitude, tipo, descricao, dataAcontecimento: dataISO },
        { headers: { Authorization: `Bearer ${tokenUser}` } }
      );

      console.log("📥 [DEBUG] Resposta do backend:", response.data);

      limparCampos();
      setVisivelSucesso(true);
      setMensagemErro('');

    } catch (erro) {
      // mostra mensagem mais útil se existir resposta do backend
      console.log("❌ [ERRO] enviarOcorrencia:", erro.response?.data || erro.message || erro);
      setMensagemErro('Falha ao enviar ocorrência, tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={{ backgroundColor: theme.navBackground }} />

      <View style={styles.cabecalho}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconeCabecalho}>
          <FontAwesome name="arrow-left" size={20} color={theme.title} />
        </Pressable>
        <Text style={[styles.tituloCabecalho, { color: theme.title }]}>
          Registrar Ocorrência
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.form, { backgroundColor: theme.card }]}>
          <Text style={[styles.label, { color: theme.text }]}>Título da Ocorrência</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.border }]}
            placeholder="Digite o título..."
            placeholderTextColor={theme.textSecondary}
            value={titulo}
            onChangeText={setTitulo}
          />

          <Text style={[styles.label, { color: theme.text }]}>Tipo de Ocorrência</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.border }]}
            placeholder="Pesquisar tipo..."
            placeholderTextColor={theme.textSecondary}
            value={buscaTipo}
            onChangeText={(texto) => {
              setBuscaTipo(texto);
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
                    onPress={() => { setTipo(item); setBuscaTipo(item); setDropdownAberto(false); }}
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

          <Text style={[styles.label, { color: theme.text }]}>Bairro / Distrito</Text>
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

          <Text style={{ color: theme.textSecondary }}>{dataAcontecimento ? dataAcontecimento : 'Nenhuma data selecionada'}</Text>

          <Button onPress={() => setShow(true)} title='Selecionar Data' />

          {show && (
            <DateTimePicker
              value={selectedDate}
              mode='date'
              display='default'
              locale='pt-BR'     // tenta forçar português onde suportado
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

        <TouchableOpacity
          style={[
            styles.botao,
            { backgroundColor: theme.buttonColor
             },
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

      {visivelInicio && (
        <Modal visible={visivelInicio} transparent animationType="slide" onRequestClose={() => setVisivelInicio(false)}>
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { backgroundColor: theme.cardbackground }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Como Funciona</Text>

              <Text style={[styles.modalText, { color: theme.textSecondary }]}>1. Escolha o tipo de ocorrência</Text>
              <Text style={[styles.modalText, { color: theme.textSecondary }]}>2. Informe o local</Text>
              <Text style={[styles.modalText, { color: theme.textSecondary }]}>3. Descreva o que aconteceu</Text>
              <Text style={[styles.modalText, { color: theme.textSecondary }]}>4. Envie sua ocorrência</Text>

              <TouchableOpacity style={[styles.primaryButton, { backgroundColor: theme.buttonColor }]} onPress={() => setVisivelInicio(false)}>
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
      )}

      {/* ================= MODAL DE SUCESSO ================ */}

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
  container: {
    flex: 1,
    paddingTop: 0,
    padding: 20,
  },

  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 30,
    paddingHorizontal: 10,
  },

  iconeCabecalho: {
    padding: 5,
  },

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

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },

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

  erro: {
    fontSize: 13,
    marginBottom: 10,
  },

  botao: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },

  botaoDesabilitado: {
    opacity: 0.6,
  },

  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  dropdown: {
    borderWidth: 1,
    borderRadius: 6,
    maxHeight: 150,
    marginBottom: 12,
  },

  item: {
    padding: 10,
  },

  itemTexto: {
    fontSize: 14,
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },

  checkboxLabel: {
    fontSize: 14,
    marginLeft: 8,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  modalContent: {
    width: '100%',
    maxWidth: 380,
    paddingVertical: 30,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 26,
  },

  buttonGroup: {
    width: '100%',
    marginTop: 10,
  },

  primaryButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },

  secondaryButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 2,
  },

  secondaryButtonText: {
    fontWeight: '700',
    fontSize: 16,
  },

});

export default RegistrarScreen;
