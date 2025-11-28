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
   <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
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
      onPress={() => navigation.navigate('Home')}
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
          { color: theme.title },
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
              backgroundColor: theme.cardbackground,
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
                  { color: theme.title},
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
            </Pressable>
          </View>
        </Pressable>
      ))}
    </View>
  </ScrollView>

  <SafeAreaView
            edges={["bottom"]}
           style={[
  styles.navigationContainer,
  { 
    backgroundColor: isDarkMode ? "#01080aff" : "#003366" 
  },
]}
          >
            <Pressable
              style={({ pressed }) => [
                styles.navButton,
                { opacity: pressed ? 0.6 : 1 },
              ]}
              onPress={() => navigation.navigate("Home")}
            >
              <Icon name="home" size={26} color="#fff" />
              <Text style={styles.navButtonText}>Início</Text>
            </Pressable>


            <Pressable
              style={({ pressed }) => [
                styles.navButton,
                { opacity: pressed ? 0.6 : 1 },
              ]}
              onPress={() => navigation.navigate("Menu")}
            >
              <Icon name="person" size={28} color="#fff" />
              <Text style={styles.navButtonText}>Perfil</Text>
            </Pressable>
          </SafeAreaView>

  {/* MODAL */}
  <Modal 
    animationType="fade" 
    visible={informacao} 
    transparent
    statusBarTranslucent
  >
    {selecionada && (
      <View style={styles.fundoModal}>
        <View
          style={[
            styles.containerModal,
            { 
              backgroundColor: theme.cardbackground,
              shadowColor: theme.shadow,
            },
          ]}
        >
          {/* CABEÇALHO MODAL */}
          <View
            style={[
              styles.cabecalhoModal,
              { 
                backgroundColor: theme.navBackground,
                borderBottomColor: theme.border,
              },
            ]}
          >
            <View style={styles.containerTituloModal}>
              <FontAwesome
                name="flag"
                size={18}
                color={theme.primary}
                style={styles.iconeTituloModal}
              />
              <Text
                style={[
                  styles.tituloModal,
                  { color: theme.title },
                ]}
                numberOfLines={2}
              >
                {selecionada.titulo}
              </Text>
            </View>

            <Pressable
              onPress={() => setInformacao(false)}
              style={[
                styles.botaoFechar,
                { backgroundColor: theme.border }
              ]}
            >
              <FontAwesome name="times" size={16} color={theme.text} />
            </Pressable>
          </View>

          {/* CONTEÚDO MODAL */}
          <ScrollView 
            style={styles.conteudoModal}
            showsVerticalScrollIndicator={false}
          >
            {/* BADGE DE TIPO */}
            <View style={styles.containerBadge}>
              <View
                style={[
                  styles.badgeTipo,
                  { backgroundColor: theme.primary + '20' }
                ]}
              >
                <FontAwesome
                  name="tag"
                  size={12}
                  color={theme.primary}
                />
                <Text
                  style={[
                    styles.textoBadge,
                    { color: theme.primary }
                  ]}
                >
                  {selecionada.tipo}
                </Text>
              </View>
            </View>

            {/* INFORMAÇÕES DA LOCALIZAÇÃO */}
            <View style={styles.secaoInfo}>
              <View style={styles.linhaInfoModal}>
                <View style={styles.containerIconeInfo}>
                  <FontAwesome
                    name="map-marker"
                    size={14}
                    color={theme.primary}
                  />
                </View>
                <View style={styles.containerTextoInfo}>
                  <Text style={[styles.rotuloInfo, { color: theme.textSecondary }]}>
                    Localização
                  </Text>
                  <Text style={[styles.valorInfo, { color: theme.text }]}>
                    {selecionada.rua}, {selecionada.cidade}
                  </Text>
                </View>
              </View>

              <View style={styles.linhaInfoModal}>
                <View style={styles.containerIconeInfo}>
                  <FontAwesome
                    name="calendar"
                    size={14}
                    color={theme.primary}
                  />
                </View>
                <View style={styles.containerTextoInfo}>
                  <Text style={[styles.rotuloInfo, { color: theme.textSecondary }]}>
                    Data do Ocorrido
                  </Text>
                  <Text style={[styles.valorInfo, { color: theme.text }]}>
                    {selecionada.dataAcontecimento}
                  </Text>
                </View>
              </View>
            </View>

            {/* DESCRIÇÃO */}
            {selecionada.descricao && (
              <View style={styles.secaoDescricao}>
                <View style={styles.cabecalhoDescricao}>
                  <FontAwesome
                    name="align-left"
                    size={16}
                    color={theme.primary}
                  />
                  <Text
                    style={[
                      styles.rotuloDescricao,
                      { color: theme.title },
                    ]}
                  >
                    Descrição
                  </Text>
                </View>
                
                <View style={[
                  styles.containerTextoDescricao,
                  { backgroundColor: theme.sectionbackground }
                ]}>
                  <Text
                    style={[
                      styles.textoDescricao,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {selecionada.descricao}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* RODAPÉ MODAL */}
          <View
            style={[
              styles.acoesModal,
              { 
                borderTopColor: theme.border,
                backgroundColor: theme.cardbackground
              },
            ]}
          >
            <Pressable
              onPress={() => setInformacao(false)}
              style={[
                styles.botaoPrincipal,
                { 
                  backgroundColor: theme.buttonColor,
                  shadowColor: theme.shadow,
                },
              ]}
            >
              <FontAwesome name="check" size={16} color="#FFF" />
              <Text style={styles.textoBotaoPrincipal}>Entendido</Text>
            </Pressable>
          </View>
        </View>
      </View>
    )}
  </Modal>
</SafeAreaView>
  );
};


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
  textoBotaoDetalhes: { fontSize: 12, fontWeight: "600" },

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
  backgroundColor: "rgba(0,0,0,0.55)",
  justifyContent: "center",
  alignItems: "center",
  paddingVertical: 20,
  paddingHorizontal: 16,
},

containerModal: {
  width: "100%",
  maxWidth: 420,
  maxHeight: "85%",
  borderRadius: 18,
  overflow: "hidden",
  elevation: 15,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.25,
  shadowRadius: 10,
},

/* HEADER */
cabecalhoModal: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingVertical: 16,
  paddingHorizontal: 20,
  borderBottomWidth: 1,
},

containerTituloModal: {
  flexDirection: "row",
  alignItems: "center",
  flexShrink: 1,
},

iconeTituloModal: {
  marginRight: 10,
},

tituloModal: {
  fontSize: 20,
  fontWeight: "700",
  flexShrink: 1,
},

botaoFechar: {
  padding: 6,
  borderRadius: 10,
  justifyContent: "center",
  alignItems: "center",
},

/* CONTEÚDO BODY */
conteudoModal: {
  paddingHorizontal: 20,
  paddingVertical: 16,
},

/* BADGE */
containerBadge: {
  alignItems: "flex-start",
  marginBottom: 20,
},

badgeTipo: {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 10,
},

textoBadge: {
  marginLeft: 6,
  fontSize: 12,
  fontWeight: "700",
},

/* INFO BLOCKS */
secaoInfo: {
  marginBottom: 24,
  borderRadius: 12,
  paddingVertical: 4,
},

linhaInfoModal: {
  flexDirection: "row",
  marginBottom: 14,
},

containerIconeInfo: {
  width: 28,
  alignItems: "center",
  justifyContent: "center",
},

containerTextoInfo: {
  flex: 1,
},

rotuloInfo: {
  fontSize: 13,
  fontWeight: "600",
  marginBottom: 2,
  opacity: 0.8,
},

valorInfo: {
  fontSize: 15,
  fontWeight: "500",
  lineHeight: 20,
},

/* DESCRIÇÃO */
secaoDescricao: {
  marginBottom: 20,
},

cabecalhoDescricao: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 10,
},

rotuloDescricao: {
  fontSize: 16,
  fontWeight: "700",
  marginLeft: 6,
},

containerTextoDescricao: {
  padding: 14,
  borderRadius: 10,
  marginTop: 4,
},

textoDescricao: {
  fontSize: 14,
  lineHeight: 20,
  opacity: 0.9,
},

/* FOOTER */
acoesModal: {
  padding: 16,
  borderTopWidth: 1,
  flexDirection: "row",
  justifyContent: "center",
},

botaoPrincipal: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 12,
  borderRadius: 10,
  flex: 1,
},

textoBotaoPrincipal: {
  fontSize: 15,
  marginLeft: 8,
  fontWeight: "600",
  color: "#FFF",
},
 navigationContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 5,
      paddingHorizontal: 60,
    },

    navButtonText: {
      color: "#fff",
      fontSize: 12,
      marginTop: 4,
    },

    navButtonPerfil: {
      color: "#fff",
      fontSize: 16,
      marginTop: 4,
    },

    centralButton: {
      padding: 15,
      borderRadius: 50,
      elevation: 5,
    },

  
});

export default OcorrenciaScreen;