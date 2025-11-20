import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, Pressable, TextInput, Modal, StyleSheet, ScrollView, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EnderecoService } from '../../../services/EnderecoService';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import UrlService from '../../../services/UrlService';

const OcorrenciaScreen = ({ navigation }) => {
  const [ocorrencias, setOcorrencias] = useState([]);
  const [quantidade, setQuantidade] = useState(0);
  const [informacao, setInformacao] = useState(false);
  const [busca, setBusca] = useState(""); 
  const [selecionada, setSelecionada] = useState(null); 

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
    <View style={styles.container}>
      <StatusBar backgroundColor="#12577B" barStyle="light-content" />
      
      <View style={styles.cabecalho}>
        <Pressable onPress={() => navigation.navigate('Home')} style={styles.botaoCabecalho}>
          <FontAwesome name="arrow-left" size={20} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.tituloCabecalho}>Minhas Ocorrências</Text>
        <Pressable onPress={() => navigation.navigate('Configuracao')} style={styles.botaoCabecalho}>
          <FontAwesome name="cog" size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      <ScrollView style={styles.conteudo} showsVerticalScrollIndicator={false}>
       
        <View style={styles.containerPesquisa}>
          <FontAwesome name="search" size={16} color="#666" style={styles.iconePesquisa} />
          <TextInput
            style={styles.inputPesquisa}
            placeholder="Pesquisar ocorrências..."
            placeholderTextColor="#999"
            value={busca}
            onChangeText={setBusca}
          />
        </View>

        <View style={styles.secaoEstatisticas}>
          <View style={styles.cartaoEstatistica}>
            <Text style={styles.numeroEstatistica}>{quantidade}</Text>
            <Text style={styles.rotuloEstatistica}>Total de Ocorrências</Text>
          </View>
          <Pressable 
            onPress={() => navigation.navigate('Registrar')} 
            style={styles.botaoAdicionar}
          >
            <FontAwesome name="plus" size={20} color="#FFFFFF" />
            <Text style={styles.textoBotaoAdicionar}>Nova</Text>
          </Pressable>
        </View>

    
        <View style={styles.secaoLista}>
          <Text style={styles.tituloSecao}>Suas Ocorrências</Text>
          {ocorrenciasFiltradas.map((ocorrencia) => (
            <Pressable 
              key={ocorrencia.id || `${ocorrencia.latitude}-${ocorrencia.longitude}`} 
              style={[styles.cartaoOcorrencia, { borderLeftColor: getCorTipo(ocorrencia.tipo) }]}
              onPress={() => mostrarModal(ocorrencia)}
            >
              <View style={styles.cabecalhoCartao}>
                <View style={styles.containerTitulo}>
                  <FontAwesome 
                    name={getIconeTipo(ocorrencia.tipo)} 
                    size={16} 
                    color={getCorTipo(ocorrencia.tipo)} 
                    style={styles.iconeTipo}
                  />
                  <Text style={styles.tituloOcorrencia} numberOfLines={1}>
                    {ocorrencia.titulo}
                  </Text>
                </View>
                <View style={[styles.etiquetaTipo, { backgroundColor: getCorTipo(ocorrencia.tipo) }]}>
                  <Text style={styles.textoTipo}>{ocorrencia.tipo}</Text>
                </View>
              </View>
              
              <View style={styles.conteudoCartao}>
                <View style={styles.linhaInfo}>
                  <FontAwesome name="map-marker" size={12} color="#666" />
                  <Text style={styles.textoInfo}>
                    {ocorrencia.rua}, {ocorrencia.cidade}
                  </Text>
                </View>
                
                <View style={styles.linhaInfo}>
                  <FontAwesome name="calendar" size={12} color="#666" />
                  <Text style={styles.textoInfo}>
                    Ocorrido em: {ocorrencia.dataAcontecimento}
                  </Text>
                </View>
              </View>
              
              <View style={styles.rodapeCartao}>
                <Pressable 
                  onPress={() => mostrarModal(ocorrencia)} 
                  style={styles.botaoDetalhes}
                >
                  <Text style={styles.textoBotaoDetalhes}>Ver detalhes</Text>
                  <FontAwesome name="chevron-right" size={12} color="#12577B" />
                </Pressable>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>


      <Modal 
        animationType="fade" 
        visible={informacao} 
        transparent
      >
        {selecionada && (
          <View style={styles.fundoModal}>
            <View style={styles.containerModal}>
              <View style={styles.cabecalhoModal}>
                <View style={styles.containerTituloModal}>
                  <Text style={styles.tituloModal}>{selecionada.titulo}</Text>
                  <View style={[styles.etiquetaTipoModal, { backgroundColor: getCorTipo(selecionada.tipo) }]}>
                    <Text style={styles.textoTipoModal}>{selecionada.tipo}</Text>
                  </View>
                </View>
                <Pressable 
                  onPress={() => setInformacao(false)}
                  style={styles.botaoFechar}
                >
                  <FontAwesome name="times" size={20} color="#666" />
                </Pressable>
              </View>
              
              <ScrollView style={styles.conteudoModal}>
        
                {selecionada.descricao && (
                  <View style={styles.secaoDescricao}>
                    <Text style={styles.rotuloDescricao}>Descrição</Text>
                    <Text style={styles.textoDescricao}>{selecionada.descricao}</Text>
                  </View>
                )}
              
                <View style={styles.secaoInfoBasica}>
                  <View style={styles.linhaInfoBasica}>
                    <FontAwesome name="map-marker" size={14} color="#12577B" />
                    <Text style={styles.textoInfoBasica}>
                      {selecionada.rua}, {selecionada.cidade}
                    </Text>
                  </View>

                  {selecionada.dataAcontecimento && (
                    <View style={styles.linhaInfoBasica}>
                      <FontAwesome name="calendar" size={14} color="#12577B" />
                      <Text style={styles.textoInfoBasica}>
                        Ocorrido em: {selecionada.dataAcontecimento}
                      </Text>
                    </View>
                  )}
                </View>
              </ScrollView>
              
              <View style={styles.acoesModal}>
                <Pressable onPress={() => setInformacao(false)} style={styles.botaoPrincipal}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  cabecalho: {
    backgroundColor: '#12577B',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 30,
  },
  botaoCabecalho: {
    padding: 8,
    borderRadius: 8,
  },
  tituloCabecalho: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  conteudo: {
    flex: 1,
    paddingHorizontal: 20,
  },
  containerPesquisa: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  iconePesquisa: {
    marginRight: 12,
  },
  inputPesquisa: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  secaoEstatisticas: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cartaoEstatistica: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    flex: 1,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  numeroEstatistica: {
    fontSize: 28,
    fontWeight: '800',
    color: '#12577B',
    textAlign: 'center',
  },
  rotuloEstatistica: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
  },
  botaoAdicionar: {
    backgroundColor: '#12577B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  textoBotaoAdicionar: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  secaoLista: {
    marginBottom: 30,
  },
  tituloSecao: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  cartaoOcorrencia: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cabecalhoCartao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  containerTitulo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  iconeTipo: {
    marginRight: 8,
  },
  tituloOcorrencia: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  etiquetaTipo: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  textoTipo: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  conteudoCartao: {
    marginBottom: 12,
  },
  linhaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  textoInfo: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  rodapeCartao: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  botaoDetalhes: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  textoBotaoDetalhes: {
    color: '#12577B',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  fundoModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  containerModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  cabecalhoModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  containerTituloModal: {
    flex: 1,
    marginRight: 12,
  },
  tituloModal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  etiquetaTipoModal: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  textoTipoModal: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  botaoFechar: {
    padding: 4,
  },
  conteudoModal: {
    padding: 20,
  },
  secaoDescricao: {
    marginBottom: 20,
  },
  rotuloDescricao: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  textoDescricao: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
  },
  secaoInfoBasica: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 16,
  },
  linhaInfoBasica: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  textoInfoBasica: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  acoesModal: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  botaoPrincipal: {
    flex: 1,
    backgroundColor: '#12577B',
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBotaoPrincipal: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default OcorrenciaScreen;