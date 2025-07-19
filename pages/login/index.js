
import { View, Text, TextInput, Pressable, Image, TouchableOpacity } from 'react-native';
import CheckBox from 'expo-checkbox';
import { Platform } from 'react-native';
import react, { useState, useEffect } from 'react';

import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import axios from 'axios';
import styles from './styles';

WebBrowser.maybeCompleteAuthSession();


const {
  googleExpoClientId,
  googleIosClientId,
  googleAndroidClientId,
  googleWebClientId,
} = (process.env || {});

const API_BASE =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8000'
    : 'http://127.0.0.1:8000';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrar, setLembrar] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: googleExpoClientId,
    iosClientId: googleIosClientId,
    androidClientId: googleAndroidClientId,
    webClientId: '911613672517-mesln0gqpi7js4toja704o8to5k43iao.apps.googleusercontent.com',
    scopes: ['profile', 'email', 'openid'],
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
  });

  
  useEffect(() => {
    (async () => {
      try {
        const emailSalvo = await SecureStore.getItemAsync('email');
        const senhaSalva = await SecureStore.getItemAsync('senha');
        if (emailSalvo && senhaSalva) {
          setEmail(emailSalvo);
          setSenha(senhaSalva);
          setLembrar(true);
        }
      } catch (e) {
        console.log('Falha ao ler SecureStore', e);
      }
    })();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      pegarDadosDoUsuario(authentication.accessToken);
    }
  }, [response]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validarDados = () => {
    if (!email || !senha) {
      setErrorMessage('Por favor, preencha todos os campos.');
      return false;
    }
    if (!emailRegex.test(email)) {
      setErrorMessage('E‑mail em formato inválido.');
      return false;
    }
    if (senha.length < 6) {
      setErrorMessage('A senha precisa ter pelo menos 6 caracteres.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const verificarLogin = async () => {
    if (!validarDados()) return;

    setCarregando(true);
    try {
      const { data } = await axios.post('http://127.0.0.1:8000/api/login', {
        email,
        senha,
      });

      Alert.alert('Sucesso', data.mensagem);
      navigation.navigate('Home', { usuario: data.usuario });

      if (lembreDeMim) {
        await SecureStore.setItemAsync('email', email);
        await SecureStore.setItemAsync('senha', senha);
      } else {
        await SecureStore.deleteItemAsync('email');
        await SecureStore.deleteItemAsync('senha');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setErrorMessage('E‑mail ou senha incorretos.');
      } else {
        setErrorMessage('Falha de conexão com o servidor.');
        console.log(err);
      }
    } finally {
      setCarregando(false);
    }
  };

  const pegarDadosDoUsuario = async (accessToken) => {
    try {
      const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const userInfo = await res.json();

      Alert.alert('Login Google', `Bem‑vindo, ${userInfo.name}!`);
      navigation.navigate('Home', { usuario: userInfo });
    } catch (e) {
      console.log('Erro ao buscar dados do Google:', e);
    }
  };
  return (
  <View style={styles.container}>
  {/* Fundo dividido em duas cores */}
  <View style={styles.containerFundo}>
    <View style={[styles.metadeFundo, styles.metadeSuperior]} />
    <View style={[styles.metadeFundo, styles.metadeInferior]} />
  </View>

  {/* Conteúdo principal */}
  <View style={styles.containerConteudo}>
    
    <View style={styles.logoContainer}>
      <Image
        source={require('../../assets/mondlogo.png')}
        style={styles.logo}
      />
    </View>
    <Text style={styles.textoBoasVindas}>Bem-vindo à MondSec!</Text>
        <Text style={styles.textoEntrar}>Entrar</Text>


    {/* Campos do formulário */}
    <View style={styles.containerInput}>
      <Text style={styles.rotulo}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu email..."
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
    </View>

    <View style={styles.containerInput}>
      <Text style={styles.rotulo}>Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha..."
        placeholderTextColor="#999"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
    </View>

    {/* Linha com checkbox e link */}
    <View style={styles.linhaOpcoes}>
      <Pressable 
        style={styles.containerLembrar} 
        onPress={() => setLembrar(!lembrar)}
      >
        <View style={[styles.caixaSelecao, lembrar && styles.caixaSelecionada]}>
          {lembrar && <Text style={styles.marcacao}>✓</Text>}
        </View>
        <Text style={styles.textoLembrar}>Lembrar de mim</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('RecuperarSenha')}>
        <Text style={styles.textoSenhaEsquecida}>Esqueceu a senha?</Text>
      </Pressable>
    </View>

    {/* Botões e links */}
    <TouchableOpacity style={styles.botaoLogin}>
      <Text style={styles.textoBotaoLogin}>Entrar</Text>
    </TouchableOpacity>

    <View style={styles.divisor}>
      <View style={styles.linhaDivisor} />
      <Text style={styles.textoDivisor}>ou</Text>
      <View style={styles.linhaDivisor} />
    </View>

    <TouchableOpacity style={styles.botaoGoogle}>
      <Image
        source={require('../../assets/google-icon.png')}
        style={styles.iconeGoogle}
      />
      <Text style={styles.textoBotaoGoogle}>Entrar com Google</Text>
    </TouchableOpacity>

    <Pressable 
      style={styles.linkCadastro} 
      onPress={() => navigation.navigate('Cadastro')}
    >
      <Text style={styles.textoLinkCadastro}>Ainda não tem uma conta? <Text style={styles.destaqueLinkCadastro}>Cadastre-se</Text></Text>
    </Pressable>
  </View>
</View>
  );
};


