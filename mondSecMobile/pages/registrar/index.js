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
} from 'react-native';
import CheckBox from 'expo-checkbox';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { CoordenadaService } from '../../services/CoordenadaService';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import UrlService from '../../services/UrlService';
import { ScrollView } from "react-native-gesture-handler";
import { useTheme } from "../../services/themes/themecontext"; // THEME AQUI

const RegistrarScreen = ({ navigation }) => {
  const { theme } = useTheme(); // 👈 USA O TEMA

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

  const onChange = (event, selectedDateValue) => {
    setShow(false);
    if (selectedDateValue) {
      setSelectedDate(selectedDateValue);
      setDataAcontecimento(selectedDateValue.toISOString().split('T')[0]);
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
      const dados = { 
        titulo, 
        latitude, 
        longitude, 
        tipo, 
        descricao, 
        dataAcontecimento 
      };
      const tokenUser = await AsyncStorage.getItem('userToken');
      await UrlService.post('/ocorrencia/registrar', dados, { headers: { Authorization: `Bearer ${tokenUser}` } });
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

      <View style={styles.cabecalho}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconeCabecalho}>
          <FontAwesome name="arrow-left" size={20} color={theme.title} />
        </Pressable>
        <Text style={[styles.tituloCabecalho, { color: theme.title}]}>
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

          <Text style={{ color: theme.textSecondary }}>{dataAcontecimento}</Text>

          <Button onPress={() => setShow(true)} title='Selecionar Data'/>

          {show && (
            <DateTimePicker
              value={selectedDate}
              mode='date'
              display='default'
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
            { backgroundColor: theme.button },
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

      {/* ================= MODAL INICIAL ================ */}

      {visivelInicio && (
        <Modal visible={visivelInicio} transparent animationType="slide" onRequestClose={() => setVisivelInicio(false)}>
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Como Funciona</Text>

              <Text style={[styles.modalText, { color: theme.textSecondary }]}>1. Escolha o tipo de ocorrência</Text>
              <Text style={[styles.modalText, { color: theme.textSecondary }]}>2. Informe o local</Text>
              <Text style={[styles.modalText, { color: theme.textSecondary }]}>3. Descreva o que aconteceu</Text>
              <Text style={[styles.modalText, { color: theme.textSecondary }]}>4. Envie sua ocorrência</Text>

              <TouchableOpacity style={[styles.primaryButton, { backgroundColor: theme.primary }]} onPress={() => setVisivelInicio(false)}>
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

      <Modal visible={visivelSucesso} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Ocorrência enviada com sucesso!
            </Text>

            <TouchableOpacity style={[styles.primaryButton, { backgroundColor: theme.primary }]} onPress={() => setVisivelSucesso(false)}>
              <Text style={styles.primaryButtonText}>Fazer mais uma</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: theme.primary }]}
              onPress={() => {
                setVisivelSucesso(false);
                navigation.navigate('Ocorrencia');
              }}
            >
              <Text style={styles.primaryButtonText}>Ver minhas ocorrências</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  cabecalho: { flexDirection: 'row', alignItems: 'center', position: 'relative', marginBottom: 30, paddingHorizontal: 10 },
  tituloCabecalho: { fontSize: 20, fontWeight: '600', position: 'absolute', left: 0, right: 0, textAlign: 'center' },
  iconeCabecalho: { padding: 5 },
  form: { marginBottom: 20, padding: 16, borderRadius: 12 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 6, padding: 12, marginBottom: 12, fontSize: 14 },
  textArea: { borderWidth: 1, borderRadius: 6, padding: 8, minHeight: 80, marginBottom: 4, fontSize: 14 },
  contador: { fontSize: 12, textAlign: "right", marginBottom: 12 },
  botao: { padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  botaoDesabilitado: { opacity: 0.6 },
  textoBotao: { color: '#fff', fontSize: 16, fontWeight: '600' },
  erro: { fontSize: 13, marginBottom: 10 },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalContent: { borderRadius: 20, width: '100%', maxWidth: 400, padding: 24, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  modalText: { fontSize: 14, textAlign: 'center', marginBottom: 12 },
  primaryButton: { borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24, alignItems: 'center', marginTop: 16 },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 16 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  checkboxLabel: { fontSize: 14, marginLeft: 8 },
  dropdown: { borderWidth: 1, borderRadius: 6, maxHeight: 150, marginBottom: 12 },
  item: { padding: 10 },
  itemTexto: { fontSize: 14 },
});

export default RegistrarScreen;
