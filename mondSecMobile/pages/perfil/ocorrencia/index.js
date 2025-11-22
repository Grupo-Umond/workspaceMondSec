import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, Pressable, TextInput, Modal, StyleSheet, ScrollView, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EnderecoService } from '../../../services/EnderecoService';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import UrlService from '../../../services/UrlService';
import { useTheme } from "../../../services/themes/themecontext";

const OcorrenciaScreen = ({ navigation }) => {
  const [ocorrencias, setOcorrencias] = useState([]);
  const [quantidade, setQuantidade] = useState(0);
  const [informacao, setInformacao] = useState(false);
  const [busca, setBusca] = useState(""); 
  const [selecionada, setSelecionada] = useState(null); 
  const { theme, isDarkMode } = useTheme(); // <--- PEGAR O TEMA

useEffect(() => {
  const getOcorrencias = async () => {
    try {
      const tokenUser = await AsyncStorage.getItem('userToken');
      const response = await UrlService.get('/ocorrencia/listar', {
        headers: { Authorization: `Bearer ${tokenUser}` },
      });

      let data = response.data.ocorrencias;

      data = data.filter(o => o.status !== 'inativo');

      const comEndereco = await Promise.all(
        data.map(async (ocorrencia) => {
          try {
            const endereco = await EnderecoService(ocorrencia.latitude, ocorrencia.longitude);
            return {
              ...ocorrencia,
              rua: endereco.road || 'Rua não encontrada',
              cidade: endereco.city || 'Cidade não encontrada',
            };
          } catch (erro) {
            return {
              ...ocorrencia,
              rua: 'Rua não encontrada',
              cidade: 'Cidade não encontrada',
            };
          }
        })
      );

      setOcorrencias(comEndereco);
      setQuantidade(comEndereco.length);
    } catch (erro) {
      console.log('Erro interno: ', erro);
    }
  };

  getOcorrencias();
}, []);


  const ocorrenciasFiltradas = useMemo(() => {
    return ocorrencias.filter((ocorrencia) => {
      const textoBusca = busca.toLowerCase();
      const titulo = (ocorrencia.titulo ?? '').toLowerCase();
      const cidade = (ocorrencia.cidade ?? '').toLowerCase();
      const rua = (ocorrencia.rua ?? '').toLowerCase();
      return titulo.includes(textoBusca) || cidade.includes(textoBusca) || rua.includes(textoBusca);
    });
  }, [busca, ocorrencias]);

  const mostrarModal = (ocorrencia) => {
    setSelecionada(ocorrencia);
    setInformacao(true);
  };

  const getIconeTipo = (tipo) => {
    switch(tipo) {
      case 'Roubo':
        return 'tint';
      case 'Acidente':
        return 'shield';
      case 'Incêndio':
        return 'exclamation-triangle';
      default:
        return 'map-marker';
    }
  };

  const getCorTipo = (tipo) => {
    switch(tipo) {
      case 'Roubo':
        return '#12577B';
      case 'Acidente':
        return '#FF9800';
      case 'Incêndio':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        backgroundColor={theme.navBackground}
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />

      {/* CABEÇALHO */}
      <View
        style={[
          styles.cabecalho,
          {
            backgroundColor: theme.navBackground,
            borderBottomColor: theme.navBorder,
          },
        ]}
      >
       <Pressable
  onPress={() => navigation.goBack()}
  style={styles.botaoCabecalho}
>
  <FontAwesome
    name="arrow-left"
    size={20}
    color={theme.title}
  />
</Pressable>
        <Text style={[styles.tituloCabecalho, { color: theme.title }]}>
          Minhas Ocorrências
        </Text>
      </View>

      <ScrollView style={styles.conteudo} showsVerticalScrollIndicator={false}>
        {/* PESQUISA */}
        <View
          style={[
            styles.containerPesquisa,
            {
              backgroundColor: theme.border,
              shadowColor: theme.shadow,
            },
          ]}
        >
          <FontAwesome
            name="search"
            size={16}
            color={theme.textSecondary}
            style={styles.iconePesquisa}
          />
          <TextInput
            style={[styles.inputPesquisa, { color: theme.text }]}
            placeholder="Pesquisar ocorrências..."
            placeholderTextColor={theme.textSecondary}
            value={busca}
            onChangeText={setBusca}
          />
        </View>

        {/* ESTATÍSTICAS */}
        <View style={styles.secaoEstatisticas}>
          <View
            style={[
              styles.cartaoEstatistica,
              { backgroundColor: theme.border },
            ]}
          >
            <Text
              style={[
                styles.numeroEstatistica,
                { color: theme.primary },
              ]}
            >
              {quantidade}
            </Text>
            <Text
              style={[
                styles.rotuloEstatistica,
                { color: theme.textSecondary },
              ]}
            >
              Total de Ocorrências
            </Text>
          </View>

          {/* BOTÃO NOVA */}
          <Pressable
            onPress={() => navigation.navigate("Registrar")}
            style={[
              styles.botaoAdicionar,
              { backgroundColor: theme.primary },
            ]}
          >
            <FontAwesome name="plus" size={20} color="#FFF" />
            <Text style={styles.textoBotaoAdicionar}>Nova</Text>
          </Pressable>
        </View>

        {/* LISTAGEM */}
        <View style={styles.secaoLista}>
          <Text
            style={[
              styles.tituloSecao,
              { color: theme.text },
            ]}
          >
            Suas Ocorrências
          </Text>

          {ocorrenciasFiltradas.map((ocorrencia) => (
            <Pressable
              key={ocorrencia.id}
              style={[
                styles.cartaoOcorrencia,
                {
                  backgroundColor: theme.cardBackground,
                  borderLeftColor: "#3498db",
                  shadowColor: theme.shadow,
                },
              ]}
              onPress={() => mostrarModal(ocorrencia)}
            >
              <View style={styles.cabecalhoCartao}>
                <View style={styles.containerTitulo}>
                  <FontAwesome
                    name="flag"
                    size={16}
                    color="#3498db"
                    style={styles.iconeTipo}
                  />
                  <Text
                    style={[
                      styles.tituloOcorrencia,
                      { color: theme.text },
                    ]}
                    numberOfLines={1}
                  >
                    {ocorrencia.titulo}
                  </Text>
                </View>

                <View
                  style={[
                    styles.etiquetaTipo,
                    { backgroundColor: "#3498db" },
                  ]}
                >
                  <Text style={styles.textoTipo}>{ocorrencia.tipo}</Text>
                </View>
              </View>

              {/* INFO */}
              <View style={styles.conteudoCartao}>
                <View style={styles.linhaInfo}>
                  <FontAwesome
                    name="map-marker"
                    size={12}
                    color={theme.textSecondary}
                  />
                  <Text
                    style={[
                      styles.textoInfo,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {ocorrencia.rua}, {ocorrencia.cidade}
                  </Text>
                </View>

                <View style={styles.linhaInfo}>
                  <FontAwesome
                    name="calendar"
                    size={12}
                    color={theme.textSecondary}
                  />
                  <Text
                    style={[
                      styles.textoInfo,
                      { color: theme.textSecondary },
                    ]}
                  >
                    Ocorrido em: {ocorrencia.dataAcontecimento}
                  </Text>
                </View>
              </View>

              {/* RODAPÉ */}
              <View style={styles.rodapeCartao}>
                <Pressable style={styles.botaoDetalhes}>
                  <Text
                    style={[
                      styles.textoBotaoDetalhes,
                      { color: theme.primary },
                    ]}
                  >
                    Ver detalhes
                  </Text>
                  <FontAwesome
                    name="chevron-right"
                    size={12}
                    color={theme.primary}
                  />
                </Pressable>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>



      {/* MODAL */}
      <Modal animationType="fade" visible={informacao} transparent>
        {selecionada && (
          <View style={styles.fundoModal}>
            <View
              style={[
                styles.containerModal,
                { backgroundColor: theme.cardBackground },
              ]}
            >
              <View
                style={[
                  styles.cabecalhoModal,
                  { borderBottomColor: theme.border },
                ]}
              >
                <Text
                  style={[
                    styles.tituloModal,
                    { color: theme.text },
                  ]}
                >
                  {selecionada.titulo}
                </Text>

                <Pressable
                  onPress={() => setInformacao(false)}
                  style={styles.botaoFechar}
                >
                  <FontAwesome name="times" size={20} color={theme.text} />
                </Pressable>
              </View>

              <ScrollView style={styles.conteudoModal}>
                {selecionada.descricao && (
                  <View style={styles.secaoDescricao}>
                    <Text
                      style={[
                        styles.rotuloDescricao,
                        { color: theme.text },
                      ]}
                    >
                      Descrição
                    </Text>

                    <Text
                      style={[
                        styles.textoDescricao,
                        {
                          color: theme.textSecondary,
                          backgroundColor: theme.sectionBackground,
                        },
                      ]}
                    >
                      {selecionada.descricao}
                    </Text>
                  </View>
                )}
              </ScrollView>

              <View
                style={[
                  styles.acoesModal,
                  { borderTopColor: theme.border },
                ]}
              >
                <Pressable
                  onPress={() => setInformacao(false)}
                  style={[
                    styles.botaoPrincipal,
                    { backgroundColor: theme.primary },
                  ]}
                >
                  <Text style={styles.textoBotaoPrincipal}>Fechar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
};

// mantém os mesmos styles e usa theme por override

const styles = StyleSheet.create({
  container: { flex: 1 },
  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    position: "relative",
    paddingTop: 30,
  },
  botaoCabecalho: { padding: 5 },
  tituloCabecalho: {
    fontSize: 18,
    fontWeight: "700",
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    paddingTop: 20,
  },
  conteudo: { flex: 1, paddingHorizontal: 20 },
  containerPesquisa: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginVertical: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  iconePesquisa: { marginRight: 12 },
  inputPesquisa: { flex: 1, height: 50, fontSize: 16 },

  secaoEstatisticas: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  cartaoEstatistica: {
    padding: 20,
    borderRadius: 12,
    flex: 1,
    marginRight: 12,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  numeroEstatistica: { fontSize: 28, fontWeight: "800" },
  rotuloEstatistica: { fontSize: 12, fontWeight: "600" },
  botaoAdicionar: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  textoBotaoAdicionar: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },

  secaoLista: { marginBottom: 30 },
  tituloSecao: { fontSize: 18, fontWeight: "700", marginBottom: 16 },

  cartaoOcorrencia: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  cabecalhoCartao: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  containerTitulo: { flexDirection: "row", alignItems: "center", flex: 1 },
  iconeTipo: { marginRight: 8 },
  tituloOcorrencia: { fontSize: 16, fontWeight: "700" },

  etiquetaTipo: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  textoTipo: { fontSize: 10, fontWeight: "700", color: "#fff" },

  conteudoCartao: { marginBottom: 12 },
  linhaInfo: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  textoInfo: { fontSize: 14, marginLeft: 8 },

  rodapeCartao: { flexDirection: "row", justifyContent: "flex-end" },
  textoBotaoDetalhes: { fontSize: 14, fontWeight: "600" },

  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },

  navButton: { alignItems: "center" },
  navButtonText: { fontSize: 12, marginTop: 4 },

  centralButton: {
    padding: 15,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },

  fundoModal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  containerModal: {
    borderRadius: 12,
    width: "90%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },

  cabecalhoModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
  },
  tituloModal: { fontSize: 18, fontWeight: "700" },

  botaoFechar: { padding: 4 },
  conteudoModal: { padding: 20 },

  rotuloDescricao: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  textoDescricao: {
    fontSize: 14,
    lineHeight: 20,
    padding: 12,
    borderRadius: 8,
  },

  acoesModal: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
  },

  botaoPrincipal: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  textoBotaoPrincipal: { color: "#fff", fontWeight: "600" },
});

export default OcorrenciaScreen;