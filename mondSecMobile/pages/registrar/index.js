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
  Button
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
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

  useEffect(() => {
    const checarModal = async () => {
      const mostrarSalvo = await AsyncStorage.getItem('mostrarModalInicio');
      if (mostrarSalvo === 'true') {
        setVisivelInicio(false);
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
      const dados = {
        titulo,
        latitude,
        longitude,
        tipo,
        descricao,
        dataAcontecimento
      };

      const tokenUser = await AsyncStorage.getItem('userToken');
      await UrlService.post('/ocorrencia/registrar', dados, {
        headers: { Authorization: `Bearer ${tokenUser}` }
      });

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
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={tipo} onValueChange={setTipo} style={styles.picker}>
            <Picker.Item label="Selecione..." value="" />

            {/* Ocorrências criminais e de segurança */}
            <Picker.Item label="Assalto em via pública" value="Assalto em via pública" />
            <Picker.Item label="Tentativa de assalto" value="Tentativa de assalto" />
            <Picker.Item label="Roubo de veículo" value="Roubo de veículo" />
            <Picker.Item label="Furto de peças de veículo" value="Furto de peças de veículo" />
            <Picker.Item label="Agressão em via pública" value="Agressão em via pública" />
            <Picker.Item label="Briga de rua" value="Briga de rua" />
            <Picker.Item label="Troca de tiros" value="Troca de tiros" />
            <Picker.Item label="Disparo de arma de fogo" value="Disparo de arma de fogo" />
            <Picker.Item label="Ação criminosa em andamento" value="Ação criminosa em andamento" />
            <Picker.Item label="Carro suspeito parado na via" value="Carro suspeito parado na via" />
            <Picker.Item label="Sequestro relâmpago" value="Sequestro relâmpago" />
            <Picker.Item label="Latrocínio em via" value="Latrocínio em via" />
            <Picker.Item label="Vandalismo em via pública" value="Vandalismo em via pública" />
            <Picker.Item label="Furto de cabos elétricos" value="Furto de cabos elétricos" />
            <Picker.Item label="Bloqueio policial" value="Bloqueio policial" />
            <Picker.Item label="Perseguição policial" value="Perseguição policial" />
            <Picker.Item label="Área isolada por investigação" value="Área isolada por investigação" />
            <Picker.Item label="Helicóptero sobrevoando área policial" value="Helicóptero sobrevoando área policial" />

            {/* Acidentes de trânsito */}
            <Picker.Item label="Colisão entre carros" value="Colisão entre carros" />
            <Picker.Item label="Colisão entre carro e moto" value="Colisão entre carro e moto" />
            <Picker.Item label="Colisão entre carro e caminhão" value="Colisão entre carro e caminhão" />
            <Picker.Item label="Atropelamento de pedestre" value="Atropelamento de pedestre" />
            <Picker.Item label="Atropelamento de ciclista" value="Atropelamento de ciclista" />
            <Picker.Item label="Engavetamento múltiplo" value="Engavetamento múltiplo" />
            <Picker.Item label="Capotamento" value="Capotamento" />
            <Picker.Item label="Tombamento de caminhão" value="Tombamento de caminhão" />
            <Picker.Item label="Caminhão com carga espalhada na pista" value="Caminhão com carga espalhada na pista" />
            <Picker.Item label="Moto caída na pista" value="Moto caída na pista" />
            <Picker.Item label="Veículo incendiado" value="Veículo incendiado" />
            <Picker.Item label="Explosão veicular" value="Explosão veicular" />

            {/* Problemas mecânicos e obstruções */}
            <Picker.Item label="Pane elétrica no veículo parado" value="Pane elétrica no veículo parado" />
            <Picker.Item label="Pane mecânica em via" value="Pane mecânica em via" />
            <Picker.Item label="Veículo abandonado na pista" value="Veículo abandonado na pista" />
            <Picker.Item label="Pneu estourado bloqueando faixa" value="Pneu estourado bloqueando faixa" />
            <Picker.Item label="Veículo atravessado em via" value="Veículo atravessado em via" />
            <Picker.Item label="Carro na contramão" value="Carro na contramão" />
            <Picker.Item label="Comboio lento de caminhões" value="Comboio lento de caminhões" />
            <Picker.Item label="Ônibus quebrado bloqueando faixa" value="Ônibus quebrado bloqueando faixa" />
            <Picker.Item label="Cancelas travadas em ferrovia" value="Cancelas travadas em ferrovia" />
            <Picker.Item label="Trilhos bloqueando travessia" value="Trilhos bloqueando travessia" />

            {/* Condições climáticas e ambientais */}
            <Picker.Item label="Tempestade forte" value="Tempestade forte" />
            <Picker.Item label="Chuva intensa com visibilidade reduzida" value="Chuva intensa com visibilidade reduzida" />
            <Picker.Item label="Granizo na pista" value="Granizo na pista" />
            <Picker.Item label="Vendaval derrubando objetos" value="Vendaval derrubando objetos" />
            <Picker.Item label="Nevoeiro intenso" value="Nevoeiro intenso" />
            <Picker.Item label="Fumaça na pista" value="Fumaça na pista" />
            <Picker.Item label="Neve acumulada em via" value="Neve acumulada em via" />
            <Picker.Item label="Nevasca" value="Nevasca" />
            <Picker.Item label="Gelo na pista" value="Gelo na pista" />
            <Picker.Item label="Tornado atingindo estrada" value="Tornado atingindo estrada" />
            <Picker.Item label="Furacão atingindo região" value="Furacão atingindo região" />
            <Picker.Item label="Ciclone com interdição de vias" value="Ciclone com interdição de vias" />
            <Picker.Item label="Tsunami atingindo área costeira" value="Tsunami atingindo área costeira" />
            <Picker.Item label="Terremoto afetando rodovia" value="Terremoto afetando rodovia" />
            <Picker.Item label="Tremor de terra com rachaduras" value="Tremor de terra com rachaduras" />
            <Picker.Item label="Onda de calor afetando pavimento" value="Onda de calor afetando pavimento" />
            <Picker.Item label="Areia ou poeira reduzindo visibilidade" value="Areia ou poeira reduzindo visibilidade" />

            {/* Riscos urbanos e ambientais */}
            <Picker.Item label="Incêndio em via pública" value="Incêndio em via pública" />
            <Picker.Item label="Incêndio em veículo" value="Incêndio em veículo" />
            <Picker.Item label="Incêndio sob viaduto" value="Incêndio sob viaduto" />
            <Picker.Item label="Incêndio em poste elétrico" value="Incêndio em poste elétrico" />
            <Picker.Item label="Explosão de transformador" value="Explosão de transformador" />
            <Picker.Item label="Curto-circuito em fiação" value="Curto-circuito em fiação" />
            <Picker.Item label="Vazamento de gás em rua" value="Vazamento de gás em rua" />
            <Picker.Item label="Vazamento químico" value="Vazamento químico" />
            <Picker.Item label="Vazamento de óleo na pista" value="Vazamento de óleo na pista" />
            <Picker.Item label="Vazamento de água com risco de buraco" value="Vazamento de água com risco de buraco" />
            <Picker.Item label="Fios caídos na via" value="Fios caídos na via" />
            <Picker.Item label="Poste caído" value="Poste caído" />

            {/* Estrutura e infraestrutura */}
            <Picker.Item label="Buraco em via" value="Buraco em via" />
            <Picker.Item label="Afundamento de asfalto" value="Afundamento de asfalto" />
            <Picker.Item label="Erosão em calçada ou pista" value="Erosão em calçada ou pista" />
            <Picker.Item label="Deslizamento de terra em estrada" value="Deslizamento de terra em estrada" />
            <Picker.Item label="Desabamento parcial de muro em calçada" value="Desabamento parcial de muro em calçada" />
            <Picker.Item label="Desabamento de ponte ou viaduto" value="Desabamento de ponte ou viaduto" />
            <Picker.Item label="Rachadura estrutural em via" value="Rachadura estrutural em via" />
            <Picker.Item label="Cratera aberta na pista" value="Cratera aberta na pista" />
            <Picker.Item label="Trecho interditado por obras" value="Trecho interditado por obras" />
            <Picker.Item label="Bloqueio parcial por manutenção" value="Bloqueio parcial por manutenção" />
            <Picker.Item label="Sinalização danificada" value="Sinalização danificada" />
            <Picker.Item label="Semáforo apagado" value="Semáforo apagado" />
            <Picker.Item label="Semáforo piscando" value="Semáforo piscando" />
            <Picker.Item label="Falta de energia afetando cruzamento" value="Falta de energia afetando cruzamento" />
            <Picker.Item label="Falha de iluminação pública" value="Falha de iluminação pública" />
            <Picker.Item label="Via sem luz à noite" value="Via sem luz à noite" />
            <Picker.Item label="Lâmpadas queimadas em cruzamento" value="Lâmpadas queimadas em cruzamento" />
            <Picker.Item label="Região com baixa visibilidade" value="Região com baixa visibilidade" />

            {/* Obstáculos e interferências */}
            <Picker.Item label="Queda de árvore bloqueando pista" value="Queda de árvore bloqueando pista" />
            <Picker.Item label="Galho grande na pista" value="Galho grande na pista" />
            <Picker.Item label="Entulho ou lixo bloqueando faixa" value="Entulho ou lixo bloqueando faixa" />
            <Picker.Item label="Materiais de construção na via" value="Materiais de construção na via" />
            <Picker.Item label="Painel publicitário caído" value="Painel publicitário caído" />
            <Picker.Item label="Telhado ou estrutura metálica na rua" value="Telhado ou estrutura metálica na rua" />
            <Picker.Item label="Vidros espalhados na pista" value="Vidros espalhados na pista" />
            <Picker.Item label="Animal de grande porte na pista" value="Animal de grande porte na pista" />
            <Picker.Item label="Rebanho cruzando estrada" value="Rebanho cruzando estrada" />
            <Picker.Item label="Animal silvestre na via" value="Animal silvestre na via" />
            <Picker.Item label="Insetos em enxame na rodovia" value="Insetos em enxame na rodovia" />

            {/* Eventos e bloqueios programados */}
            <Picker.Item label="Protesto bloqueando via" value="Protesto bloqueando via" />
            <Picker.Item label="Manifestação com interdição parcial" value="Manifestação com interdição parcial" />
            <Picker.Item label="Tumulto em evento próximo à via" value="Tumulto em evento próximo à via" />
            <Picker.Item label="Rota bloqueada por evento esportivo" value="Rota bloqueada por evento esportivo" />
            <Picker.Item label="Fechamento de rua para show ou feira" value="Fechamento de rua para show ou feira" />
            <Picker.Item label="Marcha, carreata ou desfile bloqueando tráfego" value="Marcha, carreata ou desfile bloqueando tráfego" />
            <Picker.Item label="Trânsito desviado por evento público" value="Trânsito desviado por evento público" />
            <Picker.Item label="Fiscalização eletrônica em operação" value="Fiscalização eletrônica em operação" />
            <Picker.Item label="Blitz policial" value="Blitz policial" />
            <Picker.Item label="Controle de velocidade temporário" value="Controle de velocidade temporário" />

            {/* Ocorrências médicas e emergenciais */}
            <Picker.Item label="Pedestre desmaiado na calçada" value="Pedestre desmaiado na calçada" />
            <Picker.Item label="Pessoa caída na rua" value="Pessoa caída na rua" />
            <Picker.Item label="Crise médica em via pública" value="Crise médica em via pública" />
            <Picker.Item label="Ciclista ferido na via" value="Ciclista ferido na via" />
            <Picker.Item label="Afogamento em passagem alagada" value="Afogamento em passagem alagada" />
            <Picker.Item label="Presença de equipe de resgate" value="Presença de equipe de resgate" />
            <Picker.Item label="Ambulância parada na via" value="Ambulância parada na via" />
            <Picker.Item label="Corpo de bombeiros atendendo ocorrência" value="Corpo de bombeiros atendendo ocorrência" />
            <Picker.Item label="Polícia técnica interditando local" value="Polícia técnica interditando local" />

            {/* Falhas e panes em sistemas urbanos */}
            <Picker.Item label="Falha em radar ou câmera de trânsito" value="Falha em radar ou câmera de trânsito" />
            <Picker.Item label="Pane em semáforo inteligente" value="Pane em semáforo inteligente" />
            <Picker.Item label="Falha de energia em cruzamentos" value="Falha de energia em cruzamentos" />
            <Picker.Item label="Cancelas travadas em ferrovia" value="Cancelas travadas em ferrovia" />
            <Picker.Item label="Trilhos bloqueando travessia" value="Trilhos bloqueando travessia" />
          </Picker>
        </View>

        <Text style={styles.label}>Endereço</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o endereço..."
          value={endereco}
          onChangeText={setEndereco}
          keyboardType="default"
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
