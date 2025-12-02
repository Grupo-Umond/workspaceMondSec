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

const RegistrarScreen = ({ navigation }) => {
  const { theme } = useTheme();
const [cep, setCep] = useState('');
const [buscandoCep, setBuscandoCep] = useState(false);

  const [carregando, setCarregando] = useState(false);
  const [visivelInicio, setVisivelInicio] = useState(false);
  const [mostrar, setMostrar] = useState(false);
  const [visivelSucesso, setVisivelSucesso] = useState(false);

  // Form fields
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');

  const [titulo, setTitulo] = useState('');
  const [dataAcontecimento, setDataAcontecimento] = useState('');
  const [tipo, setTipo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');
  const [detalheErro, setDetalheErro] = useState(''); // Detalhes técnicos do erro
  const [erroModalVisivel, setErroModalVisivel] = useState(false);

  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [buscaTipo, setBuscaTipo] = useState('');
  const [dropdownAberto, setDropdownAberto] = useState(false);

  // Lista de tipos (mantive a sua grande lista no exemplo reduzido por legibilidade,
  // substitua pelos seus tiposOcorrencia originais conforme preferir)
  const tiposOcorrencia = [
    // coloque aqui a lista completa que você já tinha; por clareza deixei um recorte
    "Homicídio", "Tentativa de Homicídio", "Roubo", "Furto", "Agressão Física",
    "Violência Doméstica", "Estupro", "Tráfico de Drogas", "Incêndio Residencial",
    "Acidente de Carro", "Enchente", "Queda de Altura", "Perda de Objeto", "Outros"
  ];

  const tiposFiltrados = tiposOcorrencia.filter(item =>
    item.toLowerCase().includes(buscaTipo.toLowerCase())
  );

  useEffect(() => {
    const checarModal = async () => {
      try {
        const mostrarSalvo = await AsyncStorage.getItem('mostrarModalInicio');
        if (mostrarSalvo !== 'true') {
          setVisivelInicio(true);
          setMostrar(false);
        } else {
          setVisivelInicio(false);
          setMostrar(true);
        }
      } catch (err) {
        // Problema ao ler AsyncStorage: avisar o usuário (mas não bloquear)
        console.error('Erro ao acessar AsyncStorage (mostrarModalInicio):', err);
      }
    };
    checarModal();
  }, []);

  const formatDateBR = (d) => {
    if (!d) return '';
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  const onChange = (event, selectedDateValue) => {
    // DateTimePicker devolve dois tipos de events; evitamos render loop
    setShow(false);
    if (selectedDateValue) {
      setSelectedDate(selectedDateValue);
      setDataAcontecimento(formatDateBR(selectedDateValue));
    }
  };
const buscarCEP = async () => {
  const cepLimpo = cep.replace(/\D/g, '');

  if (cepLimpo.length !== 8) {
    Alert.alert("CEP inválido", "Digite um CEP válido com 8 números.");
    return;
  }

  try {
    setBuscandoCep(true);

    const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const dados = await resposta.json();

    if (dados.erro) {
      Alert.alert("CEP não encontrado", "Verifique o CEP digitado.");
      return;
    }

    // Preenche automaticamente
    setRua(dados.logradouro || '');
    setBairro(dados.bairro || '');
    setCidade(dados.localidade || '');

  } catch (erro) {
    Alert.alert("Erro", "Não foi possível buscar o CEP.");
  } finally {
    setBuscandoCep(false);
  }
};

  const toggleMostrar = async (value) => {
    try {
      setMostrar(value);
      await AsyncStorage.setItem('mostrarModalInicio', value ? 'true' : 'false');
      if (value) setVisivelInicio(false);
    } catch (err) {
      console.error('Erro ao salvar mostrarModalInicio:', err);
      // Não travar a experiência do usuário; apenas mostrar aviso técnico
      setMensagemErro('Não foi possível salvar sua preferência localmente. (storage error)');
      setDetalheErro(getErroDetalhado(err));
      setErroModalVisivel(true);
    }
  };

  const montarEnderecoCompleto = () => {
    return `${rua}, ${numero}, ${bairro}, ${cidade}`;
  };

  const validarDados = () => {
    // validações básicas com mensagens específicas
    if (!titulo || !tipo || !rua || !numero || !bairro || !cidade) {
      setMensagemErro('Preencha todos os campos obrigatórios: título, tipo e endereço completo.');
      return false;
    }

    if ((descricao || '').trim().length < 5) {
      setMensagemErro('A descrição deve ter pelo menos 5 caracteres.');
      return false;
    }

    if (!selectedDate) {
      setMensagemErro('Selecione a data do acontecimento.');
      return false;
    }

    // número deve ser numérico (opcional)
    if (numero && !/^\d+$/.test(String(numero).trim())) {
      setMensagemErro('O campo Número deve conter apenas dígitos.');
      return false;
    }

    // tudo ok
    setMensagemErro('');
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
    setMensagemErro('');
    setDetalheErro('');
  };

  // Helper para gerar texto técnico do erro (seguro)
  const getErroDetalhado = (erro) => {
    try {
      if (!erro) return 'Sem detalhes adicionais.';
      // Se for um erro de axios-like
      if (erro.response) {
        // resposta do servidor
        const status = erro.response.status;
        const data = erro.response.data;
        let body = '';
        try {
          if (typeof data === 'string') {
            body = data;
          } else {
            body = JSON.stringify(data);
          }
        } catch (e) {
          body = String(data);
        }
        return `HTTP ${status} - resposta do servidor: ${body}`;
      } else if (erro.request) {
        // requisição foi feita mas sem resposta
        return `Requisição feita mas sem resposta do servidor. Detalhe: ${erro.message || 'nenhuma mensagem'}`;
      } else {
        // erro local / programação
        return `Erro local: ${erro.message || String(erro)}`;
      }
    } catch (e) {
      return `Erro ao montar detalhes: ${e.message}`;
    }
  };

  // Converte endereço para coordenadas com tratamento de erros explícito
  const converterEndereco = async () => {
    try {
      const enderecoCompleto = montarEnderecoCompleto();

      if (!enderecoCompleto || enderecoCompleto.split(',').length < 4) {
        const err = new Error('Endereço incompleto (rua, número, bairro e cidade são obrigatórios).');
        err.code = 'ENDERECO_INCOMPLETO';
        throw err;
      }

      // Chamada ao serviço de coordenadas (pode lançar)
      const response = await CoordenadaService(enderecoCompleto);

      // Validar shape da resposta
      if (!response || (typeof response.latitude === 'undefined') || (typeof response.longitude === 'undefined')) {
        const err = new Error('Serviço de geocoding retornou dados inválidos.');
        err.code = 'GEOCODING_INVALIDO';
        throw err;
      }

      // Possível caso: serviço devolve nulls
      if (response.latitude == null || response.longitude == null) {
        const err = new Error('Coordenadas não encontradas para o endereço informado.');
        err.code = 'COORDENADAS_NAO_ENCONTRADAS';
        throw err;
      }

      return { latitude: response.latitude, longitude: response.longitude };

    } catch (erro) {
      // Log técnico
      console.error('converterEndereco erro:', erro);
      // Reempacotamos com mensagem pra exibir ao usuário e detalhes técnicos
      const display = (erro.code === 'ENDERECO_INCOMPLETO')
        ? 'Endereço incompleto. Por favor preencha rua, número, bairro e cidade.'
        : 'Não foi possível obter coordenadas do endereço. Verifique o endereço ou tente mais tarde.';

      const detalhe = getErroDetalhado(erro);
      const err = new Error(display);
      err.detalhe = detalhe;
      throw err;
    }
  };

  // Envio da ocorrência com tratamento completo de erros
  const enviarOcorrencia = async () => {
    // valida antes de tudo
    if (!validarDados()) return;

    setCarregando(true);
    setMensagemErro('');
    setDetalheErro('');
    setErroModalVisivel(false);

    try {
      // Converter endereço -> coordenadas
      const { latitude, longitude } = await converterEndereco();

      // ISO date para envio (yyyy-mm-dd)
      const dataISO = selectedDate.toISOString().split('T')[0];

      // token do usuário (pode falhar)
      let tokenUser;
      try {
        tokenUser = await AsyncStorage.getItem('userToken');
      } catch (err) {
        console.error('Erro ao ler userToken do AsyncStorage:', err);
        const e = new Error('Erro ao acessar credenciais locais. Tente efetuar login novamente.');
        e.detalhe = getErroDetalhado(err);
        throw e;
      }

      if (!tokenUser) {
        const e = new Error('Usuário não autenticado. Faça login para continuar.');
        e.detalhe = 'Token não encontrado no AsyncStorage (userToken).';
        throw e;
      }

      // Monta payload
      const payload = {
        titulo: titulo.trim(),
        latitude,
        longitude,
        tipo: tipo.trim(),
        descricao: descricao.trim(),
        dataAcontecimento: dataISO,
      };

      // Tenta enviar
      let resposta;
      try {
        resposta = await UrlService.post(
          '/ocorrencia/registrar',
          payload,
          { headers: { Authorization: `Bearer ${tokenUser}` } }
        );
      } catch (err) {
        // Se o serviço lançar, trataremos abaixo
        console.error('Erro na chamada UrlService.post:', err);
        throw err;
      }

      // Se chegou aqui, sucesso (pode validar resposta)
      setVisivelSucesso(true);
      limparCampos();

    } catch (erro) {
      // ---------- TRATAMENTO DE ERROS PARA O USUÁRIO ----------
      console.error('enviarOcorrencia catch:', erro);

      // Se o erro já tiver mensagem amigável (lançado por nós), usa-a
      if (erro.message && (erro.detalhe || erro.stack)) {
        // Mensagem amigável + detalhes técnicos
        setMensagemErro(erro.message || 'Erro ao enviar ocorrência.');
        // Prepara detalhe técnico (prioriza .detalhe se existir)
        const detalhe = erro.detalhe || getErroDetalhado(erro);
        setDetalheErro(truncarDetalhe(detalhe));
        setErroModalVisivel(true);
        setCarregando(false);
        return;
      }

      // Se for erro vindo do axios-like (erro.response)
      if (erro.response) {
        const status = erro.response.status;
        const data = erro.response.data;
        // Mensagens por status
        if (status === 400) {
          setMensagemErro('Erro de validação nos dados enviados. Verifique os campos e tente novamente.');
        } else if (status === 401 || status === 403) {
          setMensagemErro('Não autorizado. Faça login novamente.');
        } else if (status >= 500) {
          setMensagemErro('Erro no servidor. Tente novamente mais tarde.');
        } else {
          setMensagemErro(`Erro ao enviar. Código: ${status}`);
        }
        // detalhe técnico
        setDetalheErro(truncarDetalhe(`HTTP ${status} - ${JSON.stringify(data)}`));
        setErroModalVisivel(true);
        setCarregando(false);
        return;
      }

      // Se for erro de requisição sem resposta (network)
      if (erro.request) {
        setMensagemErro('Sem resposta do servidor. Verifique sua conexão e tente novamente.');
        setDetalheErro(truncarDetalhe(`Requisição feita, sem resposta. Detalhe: ${erro.message || 'nenhuma mensagem'}`));
        setErroModalVisivel(true);
        setCarregando(false);
        return;
      }

      // Caso genérico
      setMensagemErro('Falha ao enviar ocorrência, tente novamente.');
      setDetalheErro(truncarDetalhe(getErroDetalhado(erro)));
      setErroModalVisivel(true);
    } finally {
      setCarregando(false);
    }
  };

  // função utilitária para truncar detalhe técnico longo
  const truncarDetalhe = (texto) => {
    if (!texto) return 'Sem detalhes técnicos.';
    const max = 2000; // evita colapsar a UI
    if (texto.length > max) return texto.slice(0, max) + '... (texto truncado)';
    return texto;
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
          <Text style={[styles.label, { color: theme.text }]}>CEP</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              style={[
                styles.input,
                {
                  flex: 1,
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.border,
                  color: theme.text
                }
              ]}
              placeholder="Digite o CEP"
              placeholderTextColor={theme.textSecondary}
              keyboardType="numeric"
              value={cep}
              onChangeText={setCep}
              onBlur={buscarCEP} // Busca ao sair do campo
            />

              {/* /// MEXI IMPORTANTE AQUI ANDRE */}
            <TouchableOpacity
  onPress={buscarCEP}
  style={{
    marginLeft: 8,
    marginTop: 2, 
    padding: 12,
    backgroundColor: theme.buttonColor,
    borderRadius: 10,
    alignSelf: 'flex-start', 
  }}
>
  {buscandoCep ? (
    <ActivityIndicator color="#fff" size={20} />
  ) : (
    <FontAwesome name="search" size={20} color="#fff" />
  )}
</TouchableOpacity>

          </View>

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
  
       {/* /// MEXI IMPORTANTE AQUI ANDRE */}
          
          <Text style={[
  styles.textoData,
  { 
    color: dataAcontecimento ? theme.text : theme.textSecondary,
    backgroundColor: theme.inputBackground,
    borderColor: theme.border
  }
]}>
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
            <View style={{ marginTop: 8 }}>
              <Text style={[styles.erro, { color: theme.danger }]}>
                {mensagemErro}
              </Text>

              {/* botão para ver detalhes técnicos */}
              <TouchableOpacity onPress={() => setErroModalVisivel(true)} style={{ marginTop: 6 }}>
                <Text style={{ color: theme.primary, fontWeight: '600' }}>Ver detalhes técnicos</Text>
              </TouchableOpacity>
            </View>
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
                onPress={() => {
                  setVisivelSucesso(false);
                  // manter usuário na tela para outra ocorrência
                }}
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

      {/* MODAL DE DETALHES DO ERRO (TÉCNICO) */}
      <Modal visible={erroModalVisivel} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.cardbackground }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Detalhes do Erro</Text>
            <ScrollView style={{ maxHeight: 280, marginTop: 8 }}>
              <Text style={[styles.modalText, { color: theme.textSecondary, fontSize: 13 }]}>
                {detalheErro || 'Sem detalhes técnicos disponíveis.'}
              </Text>
            </ScrollView>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: theme.buttonColor, flex: 1, marginRight: 6 }]}
                onPress={() => {
                  // Copiar para clipboard seria útil; aqui apenas fecha
                  setErroModalVisivel(false);
                }}
              >
                <Text style={styles.primaryButtonText}>Fechar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.secondaryButton, { borderColor: theme.buttonColor, flex: 1, marginLeft: 6 }]}
                onPress={() => {
                  // Se quiser enviar o bug report, abrir o e-mail ou outra ação
                  Alert.alert('Ação', 'Você pode copiar os detalhes técnicos e enviar para suporte.');
                }}
              >
                <Text style={[styles.primaryButtonText, { color: theme.text }]}>Ajuda / Suporte</Text>
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
    marginTop: -20 
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

  // ESTILOS PARA O TEXTO DE DATA
  textoData: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 4,
    marginBottom: 12,
    textAlign: 'center',
  },

  // Estilos opcionais para o container da data (se necessário)
  containerData: {
    marginBottom: 12,
  },

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