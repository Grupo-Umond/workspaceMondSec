// === CÓDIGO COMPLETO COM CEP E AUTOPREENCHIMENTO ===

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
  Alert,
} from 'react-native';

import CheckBox from 'expo-checkbox';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { CoordenadaService } from '../../services/CoordenadaService';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import UrlService from '../../services/UrlService';
import { useTheme } from "../../services/themes/themecontext";

// ===============================================================
// ===================== INÍCIO DO COMPONENTE ======================
// ===============================================================

const RegistrarScreen = ({ navigation }) => {
  const { theme } = useTheme();

  // Estados atuais do seu formulário
  const [carregando, setCarregando] = useState(false);

  // Campos do endereço
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");

  // Demais campos
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");
  const [detalheErro, setDetalheErro] = useState("");
  const [erroModalVisivel, setErroModalVisivel] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const [buscaTipo, setBuscaTipo] = useState("");
  const [dropdownAberto, setDropdownAberto] = useState(false);

  // Lista de tipos
  const tiposOcorrencia = [
  // Crimes Graves
  "Homicídio",
  "Tentativa de Homicídio",
  "Latrocínio",
  "Roubo",
  "Roubo a Residência",
  "Roubo a Comércio",
  "Roubo de Veículo",
  "Roubo com Refém",
  "Sequestro",
  "Extorsão",
  "Furto",
  "Furto de Veículo",
  "Arrombamento",
  "Agressão Física",
  "Ameaça",
  "Violência Doméstica",
  "Estupro",
  "Assédio Sexual",
  "Pedofilia",
  "Tráfico de Drogas",
  "Porte Ilegal de Arma",
  "Disparo de Arma de Fogo",
  "Tentativa de Suicídio",
  "Homicídio Culposo no Trânsito",
  "Vandalismo",
  "Invasão de Propriedade",
  "Dano ao Patrimônio",
  "Estelionato",
  "Golpe / Fraude",
  "Estelionato Digital",
  "Crimes Cibernéticos",
  "Apropriação Indébita",
  "Corrupção de Menores",
  "Contrabando",
  "Receptação",
  "Crimes Ambientais",

  // Violência e Conflitos
  "Briga Generalizada",
  "Confusão em Evento",
  "Bullying",
  "Agressão Verbal",
  "Tentativa de Linchamento",
  "Violência Escolar",
  "Disputa de Trânsito",
  "Perturbação de Sossego",

  // Desastres Naturais
  "Enchente",
  "Alagamento",
  "Deslizamento de Terra",
  "Tsunami",
  "Terremoto",
  "Treme-terra",
  "Tornado",
  "Ciclone",
  "Furacão",
  "Granizo",
  "Tempestade Elétrica",
  "Seca",
  "Incêndio Florestal",
  "Erosão",
  "Vendaval",
  "Avalanche",
  "Onda de Calor",
  "Nevasca",

  // Acidentes
  "Acidente de Carro",
  "Acidente de Moto",
  "Acidente com Bicicleta",
  "Atropelamento",
  "Acidente de Ônibus",
  "Acidente de Caminhão",
  "Acidente com Animais",
  "Acidente Doméstico",
  "Queda de Altura",
  "Desabamento",
  "Incêndio Residencial",
  "Incêndio Comercial",
  "Explosão",
  "Curto-Circuito",
  "Vazamento de Gás",
  "Vazamento Químico",
  "Afogamento",
  "Acidente em Obra",
  "Acidente Industrial",

  // Saúde e Emergências
  "Mal Súbito",
  "Desmaio",
  "Crise Convulsiva",
  "Overdose",
  "Intoxicação Alimentar",
  "Intoxicação Química",
  "Reação Alérgica Grave",
  "Ataque Cardíaco",
  "Acidente Biológico",
  "Foco de Doença Infecciosa",
  "Picada de Animal Peçonhento",

  // Problemas Urbanos
  "Falta de Energia",
  "Falta de Água",
  "Interrupção de Internet",
  "Obra Irregular",
  "Fio Caído",
  "Esgoto Transbordando",
  "Buraco na Rua",
  "Semáforo Quebrado",
  "Obstrução de Via",
  "Árvore Caída",
  "Mau Cheiro na Rua",
  "Lixo Acumulado",
  "Barulho Excessivo",
  "Poluição do Ar",
  "Poluição Sonora",
  "Vazamento de Água",
  "Agente Suspeito",
  "Veículo Abandonado",
  "Pessoa Desaparecida",
  "Animal Abandonado",

  // Inconveniências
  "Perda de Objeto",
  "Carteira Perdida",
  "Celular Perdido",
  "Extravio de Encomenda",
  "Conflito entre Vizinhos",
  "Fila Exagerada",
  "Preço Abusivo",
  "Falha de Serviço Público",
  "Dano em Entrega",
  "Entrega Atrasada",
  "Produto Defeituoso",

  // Outros
  "Evento Climático Atípico",
  "Objeto Suspeito",
  "Ruído Misterioso",
  "Comportamento Suspeito",
  "Ocorrência Não Identificada",
  "Outros"
];


  const tiposFiltrados = tiposOcorrencia.filter(item =>
    item.toLowerCase().includes(buscaTipo.toLowerCase())
  );

  // ===============================================================
  // ===================== CONSULTAR VIA CEP ========================
  // ===============================================================

  const buscarCEP = async () => {
    try {
      const apenasNumeros = cep.replace(/\D/g, "");

      if (apenasNumeros.length !== 8) {
        Alert.alert("CEP inválido", "Digite um CEP com 8 números.");
        return;
      }

      setCarregando(true);

      const response = await fetch(`https://viacep.com.br/ws/${apenasNumeros}/json/`);

      const dados = await response.json();

      if (dados.erro) {
        Alert.alert("Erro", "CEP não encontrado.");
        return;
      }

      setRua(dados.logradouro || "");
      setBairro(dados.bairro || "");
      setCidade(dados.localidade || "");

    } catch (err) {
      Alert.alert("Erro", "Não foi possível buscar o CEP.");
    } finally {
      setCarregando(false);
    }
  };

  // ===============================================================
  // ======================= FORMATAR DATA ==========================
  // ===============================================================

  const formatarData = (d) => {
    if (!d) return "";
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
  };

  const onChange = (_, date) => {
    setShow(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  // ===============================================================
  // ===================== VALIDAÇÃO GERAL =========================
  // ===============================================================

  const validarCampos = () => {
    if (!titulo || !tipo || !rua || !numero || !bairro || !cidade) {
      setMensagemErro("Preencha todos os campos obrigatórios.");
      return false;
    }
    if (descricao.trim().length < 5) {
      setMensagemErro("A descrição deve ter pelo menos 5 caracteres.");
      return false;
    }
    if (!/^\d+$/.test(numero)) {
      setMensagemErro("Número deve conter apenas números.");
      return false;
    }
    return true;
  };

  // ===============================================================
  // ======================= ENVIAR OCORRÊNCIA ======================
  // ===============================================================

  const enviarOcorrencia = async () => {
    if (!validarCampos()) return;

    try {
      setCarregando(true);

      const endereco = `${rua}, ${numero}, ${bairro}, ${cidade}`;
      const coordenadas = await CoordenadaService(endereco);

      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        setMensagemErro("Usuário não autenticado.");
        return;
      }

      const payload = {
        titulo,
        tipo,
        descricao,
        dataAcontecimento: selectedDate.toISOString().split("T")[0],
        latitude: coordenadas.latitude,
        longitude: coordenadas.longitude,
      };

      await UrlService.post(
        "/ocorrencia/registrar",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Sucesso", "Ocorrência registrada!");
      navigation.navigate("Ocorrencia");

    } catch (err) {
      setMensagemErro("Não foi possível enviar sua ocorrência.");
      setDetalheErro(JSON.stringify(err, null, 2));
      setErroModalVisivel(true);
    } finally {
      setCarregando(false);
    }
  };

  // ===============================================================
  // ============================= UI ===============================
  // ===============================================================

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      <ScrollView style={{ padding: 16 }}>

        {/* =================== CEP =================== */}
        <Text style={[styles.label, { color: theme.text }]}>CEP</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TextInput
            style={[styles.input, { flex: 1, backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.border }]}
            placeholder="00000-000"
            keyboardType="numeric"
            value={cep}
            onChangeText={setCep}
          />
          <TouchableOpacity
            onPress={buscarCEP}
            style={[styles.botaoBuscar, { backgroundColor: theme.primary }]}
          >
            <Text style={{ color: "#fff" }}>Buscar</Text>
          </TouchableOpacity>
        </View>

        {/* Rua */}
        <Text style={[styles.label, { color: theme.text }]}>Rua</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.border }]}
          value={rua}
          onChangeText={setRua}
        />

        {/* Número */}
        <Text style={[styles.label, { color: theme.text }]}>Número</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.border }]}
          keyboardType="numeric"
          value={numero}
          onChangeText={setNumero}
        />

        {/* Bairro */}
        <Text style={[styles.label, { color: theme.text }]}>Bairro</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.border }]}
          value={bairro}
          onChangeText={setBairro}
        />

        {/* Cidade */}
        <Text style={[styles.label, { color: theme.text }]}>Cidade</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.border }]}
          value={cidade}
          onChangeText={setCidade}
        />

        {/* Título */}
        <Text style={[styles.label, { color: theme.text }]}>Título</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.border }]}
          value={titulo}
          onChangeText={setTitulo}
        />

        {/* Tipo com pesquisa */}
        <Text style={[styles.label, { color: theme.text }]}>Tipo</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.border }]}
          value={buscaTipo}
          placeholder="Pesquisar..."
          placeholderTextColor={theme.textSecondary}
          onChangeText={(t) => {
            setBuscaTipo(t);
            setTipo(t);
            setDropdownAberto(true);
          }}
        />

        {dropdownAberto && (
          <View style={styles.dropdown}>
            <FlatList
              data={tiposFiltrados}
              keyExtractor={(item, i) => i.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => {
                    setTipo(item);
                    setBuscaTipo(item);
                    setDropdownAberto(false);
                  }}
                >
                  <Text style={{ color: theme.text }}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Descrição */}
        <Text style={[styles.label, { color: theme.text }]}>Descrição</Text>
        <TextInput
          style={[styles.textArea, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.border }]}
          multiline
          maxLength={120}
          value={descricao}
          onChangeText={setDescricao}
        />

        {/* Data */}
        <Button title="Selecionar Data" onPress={() => setShow(true)} />
        <Text style={{ color: theme.textSecondary }}>{formatarData(selectedDate)}</Text>

        {show && (
          <DateTimePicker value={selectedDate} mode="date" display="default" onChange={onChange} />
        )}

        {/* Erros */}
        {mensagemErro !== "" && (
          <Text style={{ color: theme.danger, marginTop: 10 }}>
            {mensagemErro}
          </Text>
        )}

        {/* Enviar */}
        <TouchableOpacity
          style={[styles.botaoEnviar, { backgroundColor: theme.primary }]}
          onPress={enviarOcorrencia}
        >
          {carregando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.textoBotao}>Enviar</Text>
          )}
        </TouchableOpacity>

      </ScrollView>

      {/* Modal Detalhes Erro */}
      <Modal visible={erroModalVisivel} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalBox, { backgroundColor: theme.card }]}>
            <Text style={{ color: theme.text, fontWeight: "bold", fontSize: 18 }}>Detalhes Técnicos</Text>
            <ScrollView style={{ maxHeight: 250, marginTop: 10 }}>
              <Text style={{ color: theme.textSecondary, fontSize: 13 }}>
                {detalheErro}
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={[styles.botaoModal, { backgroundColor: theme.primary }]}
              onPress={() => setErroModalVisivel(false)}
            >
              <Text style={{ color: "#fff" }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
};

// ===============================================================
// ============================= ESTILOS ===========================
// ===============================================================

const styles = StyleSheet.create({
  container: { flex: 1 },
  label: { marginTop: 12, fontWeight: "bold" },
  input: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 6,
  },
  botaoBuscar: {
    paddingHorizontal: 12,
    justifyContent: "center",
    borderRadius: 8,
  },
  textArea: {
    height: 100,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 6,
    textAlignVertical: "top",
  },
  dropdown: {
    borderWidth: 1,
    marginTop: 6,
    borderRadius: 8,
    maxHeight: 150,
  },
  item: {
    padding: 10,
  },
  botaoEnviar: {
    marginTop: 20,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    padding: 20,
    borderRadius: 12,
    width: "85%",
  },
  botaoModal: {
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});

export default RegistrarScreen;
