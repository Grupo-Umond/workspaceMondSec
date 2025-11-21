import React, {useContext,useEffect,useState,useCallback,} from 'react';
import {View,Text,Pressable,Image,StyleSheet,Modal,TextInput,Alert,ScrollView,} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import UrlService from '../../../services/UrlService';
import * as MediaLibrary from 'expo-media-library';
import { AuthContext } from '../../../services/AuthContext';

const MenuScreen = ({ navigation, route }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { logout } = useContext(AuthContext);

  const [erroMessage, setErroMessage] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalPermissaoDelete, setModalPermissaoDelete] = useState(false);
  const mensagem = route.params?.mensagem;

  const OptionButton = useCallback(
    ({ iconName, text, onPress, isDanger = false, targetScreen }) => {
      const handlePress = () => {
        if (onPress) {
          onPress();
        } else if (targetScreen) {
          navigation.navigate(targetScreen);
        }
      };

      return (
        <Pressable
          onPress={handlePress}
          style={({ pressed }) => [
            styles.botaoOpcao,
            isDanger ? styles.botaoDanger : {},
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <View style={styles.botaoContent}>
            <FontAwesome
              name={iconName}
              size={20}
              color={isDanger ? '#E74C3C' : '#003366'}
              style={styles.iconeOpcao}
            />

            <Text style={[styles.textoOpcao, isDanger ? styles.textoSair : {}]}>
              {text}
            </Text>
          </View>

          <FontAwesome
            name="chevron-right"
            size={16}
            color={isDanger ? '#E74C3C' : '#003366'}
          />
        </Pressable>
      );
    },
    [navigation]
  );

  useEffect(() => {
    async function puxarInfos() {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.log('Token não recebido');
        }

        const response = await UrlService.get('/usuario/buscar', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response);

        setNome(response.data.usuario.nome);
        setEmail(response.data.usuario.email);
        setImageUri(response.data.usuario.foto);
      } catch (err) {
        if (err.response?.status === 401) {
          setErroMessage('Acesso negado', 'Credenciais incorretas');
          console.log(err);
        } else {
          setErroMessage('Falha na conexão com servidor.');
          console.log('parara:', err);
        }
      }
    }

    puxarInfos();
  }, [imageUri]);

  const enviarFoto = async (uri) => {
    try {
      const token = await AsyncStorage.getItem('userToken');

      const response = await fetch(uri);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('foto', {
        uri,
        name: 'foto.jpg',
        type: blob.type || 'image/jpeg',
      });

      const uploadResponse = await fetch(
        `${UrlService.defaults.baseURL}/usuario/upload`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await uploadResponse.json();
      console.log('Upload feito com sucesso:', data);

      if (data.foto) {
        setImageUri(data.foto);
      }
    } catch (error) {
      console.log('Erro ao enviar foto:', error);
      setErroMessage('Erro ao enviar a foto.');
    }
  };

  const excluirConta = async () => {
    if (senha.length < 8) {
      setErroMessage('Digite uma senha com mais de 8 caracteres');
      return;
    }

    const tokenUser = await AsyncStorage.getItem('userToken');

    try {
      const response = await UrlService.put('/usuario/deletar', {
        senha: senha,
      });

      logout();
    } catch (erro) {
      if (erro.response?.status) {
        const codigo = erro.response.status;

        if (codigo === 401) {
          setErroMessage('Não autorizado');
          return;
        } else if (codigo === 505) {
          setErroMessage('Erro no servidor, tente novamente mais tarde');
        } else {
          setErroMessage('Erro inesperado, tente novamente mais tarde');
        }
      }

      console.log(erro);
    }
  };

  const sairConta = async () => {
    await logout();
  };

  const pedirPermissao = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permissão necessária',
        'Precisamos da permissão para acessar a câmera!'
      );
      return false;
    }

    return true;
  };

  const tirarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permissão Negada',
        'Permissão para usar a câmera é necessária para tirar uma foto de perfil.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      await enviarFoto(uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      await enviarFoto(uri);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
    <ScrollView style={styles.container} contentContainerStyle={[styles.scrollContentPadding, { paddingBottom: 80 }]}>
      <View style={styles.cabecalho}>
        <Pressable
          onPress={() => navigation.navigate('Home')}
          style={styles.iconeCabecalho}
        >
          <FontAwesome name="arrow-left" size={20} color="#12577B" />
        </Pressable>

        <Text style={styles.tituloCabecalho}>Seu Perfil</Text>
      </View>

      {mensagem ? <Text style={styles.mensagemFeedback}>{mensagem}</Text> : null}

      <View style={styles.perfilContainer}>
        <Image
          style={styles.avatar}
          source={{
            uri: imageUri || 'https://placehold.co/100x100/CCCCCC/666666?text=FP',
          }}
        />

        <Pressable onPress={pickImage} style={styles.botaoEditarFoto}>
          <Text style={styles.textoEditarFoto}>
            <FontAwesome name="camera" size={14} /> Editar Foto
          </Text>
        </Pressable>

        <Text style={styles.nomePerfil}>{nome}</Text>
        <Text style={styles.emailPerfil}>{email}</Text>
      </View>

      <View style={styles.opcoesContainer}>
        <OptionButton
          iconName="bookmark"
          text="Minhas Ocorrências"
          targetScreen="Ocorrencia"
        />
        <OptionButton
          iconName="pencil"
          text="Editar Perfil"
          targetScreen="DigiteDados"
        />
        <OptionButton
          iconName="shield"
          text="Termos e Política"
          targetScreen="Politica"
        />
        <OptionButton
          iconName="lock"
          text="Redefinir Senha"
          targetScreen="DigiteCodigo"
        />
        <OptionButton
          iconName="cog"
          text="Configurações"
          targetScreen="Configuracao"
        />

        <View style={styles.separador} />

        <OptionButton
          iconName="sign-out"
          text="Sair da Conta"
          onPress={sairConta}
          isDanger={true}
        />

        <OptionButton
          iconName="trash"
          text="Excluir Conta"
          onPress={() => setModalDelete(true)}
          isDanger={true}
        />
      </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.navigationContainer}>
        <Pressable
          style={({ pressed }) => [styles.navButton, { opacity: pressed ? 0.6 : 1 }]}
          onPress={() => navigation.navigate('Home')}
        >
          <Icon name="home" size={26} color="#FFFFFF" />
          <Text style={styles.navButtonText}>Início</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.navButton, { opacity: pressed ? 0.6 : 1 }]}
          onPress={() => navigation.navigate('Sobre')}
        >
          <View style={styles.centralButton}>
            <Icon name="info" size={28} color="#003366" />
          </View>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.navButton, { opacity: pressed ? 0.6 : 1 }]}
          onPress={() => navigation.navigate('Menu')}
        >
          <Icon name="person" size={26} color="#FFFFFF" />
          <Text style={styles.navButtonText}>Perfil</Text>
        </Pressable>
      </SafeAreaView>

      <Modal animationType="slide" transparent visible={modalPermissaoDelete}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Aviso!</Text>
            <Text style={styles.modalMessage}>
              Deseja mesmo prosseguir com essa ação?
            </Text>

            <Pressable
              style={styles.modalButtonConfirm}
              onPress={() => {
                setModalPermissaoDelete(false);
                setModalDelete(true);
              }}
            >
              <Text style={styles.modalButtonText}>Sim</Text>
            </Pressable>

            <Pressable
              style={styles.modalButtonCancel}
              onPress={() => setModalPermissaoDelete(false)}
            >
              <Text style={styles.modalButtonText}>Não</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal animationType="fade" transparent visible={modalDelete}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Digite sua senha para confirmar
            </Text>

            <TextInput
              style={styles.modalInput}
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
              placeholder="Senha"
              placeholderTextColor="#999"
            />

            {erroMessage ? (
              <Text style={styles.modalError}>{erroMessage}</Text>
            ) : null}

            <Pressable style={styles.modalButtonConfirm} onPress={excluirConta}>
              <Text style={styles.modalButtonText}>Excluir</Text>
            </Pressable>

            <Pressable
              style={styles.modalButtonCancel}
              onPress={() => setModalDelete(false)}
            >
              <Text style={styles.modalButtonText}>Voltar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 30,
  },

  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 0,
    position: 'relative',
  },

  tituloCabecalho: {
    fontSize: 20,
    fontWeight: '700',
    color: '#12577B',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },

  iconeCabecalho: {
    padding: 5,
  },

  mensagemFeedback: {
    color: 'green',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
  },

  perfilContainer: {
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0E0E0',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'black',
  },

  botaoEditarFoto: {
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },

  textoEditarFoto: {
    color: '#003366',
    fontWeight: '600',
    fontSize: 12,
  },

  nomePerfil: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 5,
  },

  emailPerfil: {
    fontSize: 14,
    color: '#666',
  },

  opcoesContainer: {
    paddingHorizontal: 5,
  },

  botaoOpcao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 18,
    backgroundColor: '#E2E8F0',
    borderRadius: 50,
    marginBottom: 10,
  },

  botaoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconeOpcao: {
    marginRight: 15,
    width: 20,
    textAlign: 'center',
  },

  textoOpcao: {
    fontSize: 13,
    color: '#003366',
    fontWeight: '500',
  },

  separador: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 15,
    marginTop: 5,
  },

  botaoDanger: {
    backgroundColor: '#FFEBEA',
    marginTop: 0,
    borderBottomWidth: 0,
  },

  textoSair: {
    color: '#E74C3C',
  },

  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#003366',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },

  centralButton: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  navButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 11, 11, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    elevation: 10,
  },

  modalTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },

  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },

  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },

  modalError: {
    color: '#E74C3C',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },

  modalButtonConfirm: {
    backgroundColor: '#E74C3C',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },

  modalButtonCancel: {
    backgroundColor: '#95A5A6',
    padding: 12,
    borderRadius: 8,
  },

  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MenuScreen;
