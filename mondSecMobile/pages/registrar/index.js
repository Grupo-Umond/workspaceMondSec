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
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import UrlService from '../../services/UrlService';

const RegistrarScreen = ({ navigation }) => {
  const [carregando, setCarregando] = useState(false);
  const [visivelInicio, setVisivelInicio] = useState(true);
  const [mostrar, setMostrar] = useState(false);
  const [visivelSucesso, setVisivelSucesso] = useState(false);

  const [endereco, setEndereco] = useState('');
  const [titulo, setTitulo] = useState('');
  const [dataAcontecimento, setDataAcontecimento] = useState('');
  const [tipo, setTipo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');
  const [dataTemp, setDataTemp] = useState('');
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [buscaTipo, setBuscaTipo] = useState('');
  const [dropdownAberto, setDropdownAberto] = useState(false);

  const tiposOcorrencia = [
    "Assalto em via pública", "Tentativa de assalto", "Roubo de veículo", "Furto de peças de veículo",
    "Agressão em via pública", "Briga de rua", "Troca de tiros", "Disparo de arma de fogo", "Ação criminosa em andamento",
    "Carro suspeito parado na via", "Sequestro relâmpago", "Latrocínio em via", "Vandalismo em via pública",
    "Furto de cabos elétricos", "Bloqueio policial", "Perseguição policial", "Área isolada por investigação",
    "Helicóptero sobrevoando área policial", "Colisão entre carros", "Colisão entre carro e moto",
    "Colisão entre carro e caminhão", "Atropelamento de pedestre", "Atropelamento de ciclista",
    "Engavetamento múltiplo", "Capotamento", "Tombamento de caminhão", "Caminhão com carga espalhada na pista",
    "Moto caída na pista", "Veículo incendiado", "Explosão veicular", "Pane elétrica no veículo parado",
    "Pane mecânica em via", "Veículo abandonado na pista", "Pneu estourado bloqueando faixa",
    "Veículo atravessado em via", "Carro na contramão", "Comboio lento de caminhões",
    "Ônibus quebrado bloqueando faixa", "Cancelas travadas em ferrovia", "Trilhos bloqueando travessia",
    "Tempestade forte", "Chuva intensa com visibilidade reduzida", "Granizo na pista", "Vendaval derrubando objetos",
    "Nevoeiro intenso", "Fumaça na pista", "Neve acumulada em via", "Nevasca", "Gelo na pista",
    "Tornado atingindo estrada", "Furacão atingindo região", "Ciclone com interdição de vias",
    "Tsunami atingindo área costeira", "Terremoto afetando rodovia", "Tremor de terra com rachaduras",
    "Onda de calor afetando pavimento", "Areia ou poeira reduzindo visibilidade", "Incêndio em via pública",
    "Incêndio em veículo", "Incêndio sob viaduto", "Incêndio em poste elétrico", "Explosão de transformador",
    "Curto-circuito em fiação", "Vazamento de gás em rua", "Vazamento químico", "Vazamento de óleo na pista",
    "Vazamento de água com risco de buraco", "Fios caídos na via", "Poste caído", "Buraco em via",
    "Afundamento de asfalto", "Erosão em calçada ou pista", "Deslizamento de terra em estrada",
    "Desabamento parcial de muro em calçada", "Desabamento de ponte ou viaduto",
    "Rachadura estrutural em via", "Cratera aberta na pista", "Trecho interditado por obras",
    "Bloqueio parcial por manutenção", "Sinalização danificada", "Semáforo apagado", "Semáforo piscando",
    "Falta de energia afetando cruzamento", "Falha de iluminação pública", "Via sem luz à noite",
    "Lâmpadas queimadas em cruzamento", "Região com baixa visibilidade", "Queda de árvore bloqueando pista",
    "Galho grande na pista", "Entulho ou lixo bloqueando faixa", "Materiais de construção na via",
    "Painel publicitário caído", "Telhado ou estrutura metálica na rua", "Vidros espalhados na pista",
    "Animal de grande porte na pista", "Rebanho cruzando estrada", "Animal silvestre na via",
    "Insetos em enxame na rodovia", "Protesto bloqueando via", "Manifestação com interdição parcial",
    "Tumulto em evento próximo à via", "Rota bloqueada por evento esportivo",
    "Fechamento de rua para show ou feira", "Marcha, carreata ou desfile bloqueando tráfego",
    "Trânsito desviado por evento público", "Fiscalização eletrônica em operação", "Blitz policial",
    "Controle de velocidade temporário", "Pedestre desmaiado na calçada", "Pessoa caída na rua",
    "Crise médica em via pública", "Ciclista ferido na via", "Afogamento em passagem alagada",
    "Presença de equipe de resgate", "Ambulância parada na via", "Corpo de bombeiros atendendo ocorrência",
    "Polícia técnica interditando local", "Falha em radar ou câmera de trânsito",
    "Pane em semáforo inteligente", "Falha de energia em cruzamentos", "Cancelas travadas em ferrovia",
    "Trilhos bloqueando travessia"
  ];

  const tiposFiltrados = tiposOcorrencia.filter(item =>
    item.toLowerCase().includes(buscaTipo.toLowerCase())
  );

  useEffect(() => {
    const checarModal = async () => {
      const mostrarSalvo = await AsyncStorage.getItem('mostrarModalInicio');
      if (mostrarSalvo === 'true') setVisivelInicio(false);
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
  };

  const validarDados = () => {
    if (!titulo || !tipo || !endereco) {
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
    setEndereco('');
    setBuscaTipo('');
  };

  const converterEndereco = async () => {
    try {
      const response = await CoordenadaService(endereco);
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
      const dados = { titulo, latitude, longitude, tipo, descricao, dataAcontecimento };
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
        <TextInput
          style={styles.input}
          placeholder="Digite o título..."
          value={titulo}
          onChangeText={setTitulo}
        />

        <Text style={styles.label}>Tipo de Ocorrência</Text>
        <TextInput
          style={styles.input}
          placeholder="Pesquisar tipo..."
          value={buscaTipo}
          onChangeText={(texto) => {
            setBuscaTipo(texto);
            setDropdownAberto(true);
          }}
        />

        {dropdownAberto && (
          <View style={styles.dropdown}>
            <FlatList
              data={tiposFiltrados}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.item, item === tipo && styles.itemSelecionado]}
                  onPress={() => { setTipo(item); setBuscaTipo(item); setDropdownAberto(false); }}
                >
                  <Text style={[styles.itemTexto, item === tipo && styles.itemTextoSelecionado]}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        <Text style={styles.label}>Endereço</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o endereço..."
          value={endereco}
          onChangeText={setEndereco}
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Descreva a ocorrência..."
          value={descricao}
          onChangeText={setDescricao}
          multiline
          maxLength={120}
          textAlignVertical="top"
        />

        <Text>{dataAcontecimento}</Text>
        <Button onPress={() => setShow(true)} title='Selecionar Data'/>
        {show && (
          <DateTimePicker
            value={selectedDate}
            mode='date'
            display='default'
            onChange={onChange}
          />
        )}

        <Text style={styles.contador}>{descricao.length}/120</Text>
        {mensagemErro ? <Text style={styles.erro}>{mensagemErro}</Text> : null}
      </View>

      <TouchableOpacity
        style={[styles.botao, carregando && styles.botaoDesabilitado]}
        onPress={enviarOcorrencia}
        disabled={carregando}
      >
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
              <CheckBox value={mostrar} onValueChange={toggleMostrar} tintColors={{ true: '#12577B', false: '#64748B' }} />
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
              <Text style={styles.primaryButtonText}>Fazer mais uma</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton} onPress={() => {setVisivelSucesso(false); navigation.navigate('Ocorrencia');}}>
              <Text style={styles.primaryButtonText}>Ver minhas ocorrências</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>

  );
};
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#FFFFFF' 
  },
  cabecalho: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 30, 
    paddingHorizontal: 10 
  },
  tituloCabecalho: { 
    fontSize: 20, 
    fontWeight: '600', 
    color: '#12577B' 
  },
  iconeCabecalho: { 
    padding: 5 
  },
  form: { 
    marginBottom: 20, 
    backgroundColor: '#FFFFFF', 
    padding: 16, 
    borderRadius: 12, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 5 
  },
  label: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#1D3557', 
    marginBottom: 8 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 6, 
    padding: 12, 
    marginBottom: 12, 
    fontSize: 14, 
    color: '#334155' 
  },
  textArea: { 
    borderWidth: 1, 
    borderColor: '#cbd5e1', 
    borderRadius: 6, 
    padding: 8, 
    minHeight: 80, 
    marginBottom: 4, 
    fontSize: 14, 
    color: '#334155' 
  },
  contador: { 
    fontSize: 12, 
    color: "#94a3b8", 
    textAlign: "right", 
    marginBottom: 12 
  },
  pickerWrapper: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 6, 
    marginBottom: 12 
  },
  picker: { 
    height: 50, 
    color: '#334155' 
  },
  botao: { 
    backgroundColor: '#12577B', 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginBottom: 20 
  },
  botaoDesabilitado: { 
    opacity: 0.6 
  },
  textoBotao: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  erro: { 
    color: '#E63946', 
    fontSize: 13, 
    marginBottom: 10 
  },
  modalContainer: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 16 
  },
  modalContent: { 
    backgroundColor: '#FFF', 
    borderRadius: 20, 
    width: '100%', 
    maxWidth: 400, 
    padding: 24, 
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 10 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 20, 
    elevation: 10 
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#1E293B', 
    marginBottom: 16 
  },
  modalText: { 
    fontSize: 14, 
    color: '#334155', 
    textAlign: 'center', 
    marginBottom: 12 
  },
  primaryButton: { 
    backgroundColor: '#12577B', 
    borderRadius: 12, 
    paddingVertical: 12, 
    paddingHorizontal: 24, 
    alignItems: 'center', 
    marginTop: 16 
  },
  primaryButtonText: { 
    color: '#FFFFFF', 
    fontWeight: '600', 
    fontSize: 16 
  },
  checkboxContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 12 
  },
  checkboxLabel: { 
    marginLeft: 8, 
    fontSize: 14, 
    color: '#64748B' 
  }
});

export default RegistrarScreen;
