import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Pressable, Alert, StyleSheet, Image, TouchableOpacity } from 'react-native';
import CheckBox from 'expo-checkbox';
import axios from 'axios';

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const CadastroScreen = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [genero, setGenero] = useState(null);          
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [concordoTermos, setConcordoTermos] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const opcoesGenero = ['Masculino', 'Feminino', 'Não informar'];


  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '911613672517-mesln0gqpi7js4toja704o8to5k43iao.apps.googleusercontent.com', 
    webClientId: '911613672517-mesln0gqpi7js4toja704o8to5k43iao.apps.googleusercontent.com', 
    scopes: ['profile', 'email'],
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      pegarDadosDoUsuario(authentication.accessToken);
    }
  }, [response]);

  const pegarDadosDoUsuario = async (accessToken) => {
  try {
    const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const userInfo = await res.json();

    
    await axios.post('http://10.0.2.2:8000/api/usuarios/google', {
      nomeUsuario: userInfo.name,
      emailUsuario: userInfo.email,
      avatar: userInfo.picture,
    });

    Alert.alert('Google', `Bem‑vindo, ${userInfo.name}!`);
    navigation.navigate('Home', { usuario: userInfo });
  } catch (e) {
    console.log('Erro ao buscar dados do Google ou salvar no backend:', e);
    Alert.alert('Erro', 'Falha ao entrar com o Google.');
  }
};


  const validarDados = () => {
    if (!nome || !genero || !email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return false;
    }
    if (senha.length < 6) {
      Alert.alert('Erro', 'A senha precisa ter pelo menos 6 caracteres.');
      return false;
    }
    if (!concordoTermos) {
      Alert.alert('Erro', 'Concorde com nossos termos de uso');
      return false;
    }
    return true;
  };

  const cadastrar = async () => {
    if (!validarDados()) return;

    setCarregando(true);
    try {
      const payload = {
        nomeUsuario: nome,
        emailUsuario: email,
        senhaUsuario: senha,
        generoUsuario: genero,
      };
      const res = await axios.post('http://127.0.0.1:8000/api/usuarios', payload);

      if (res.data && res.data.email) {
        Alert.alert('Sucesso', 'Cadastro realizado! Faça login para continuar.');
        navigation.navigate('login');
      } else {
        Alert.alert('Erro', 'Erro no cadastro. Tente novamente!');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Erro ao cadastrar. Tente novamente!');
    } finally {
      setCarregando(false);
    }
  };

  return (
<View style={styles.container}>
  {/* Cabeçalho com logo */}
  <View style={styles.containerLogo}>
    <Text style={styles.textoCabecalho}>Cadastre-se Agora</Text>
    <Image 
      source={require('../../assets/mondlogo.png')} 
      style={styles.imagemLogo} 
    />
  </View> 

  {/* Formulário */}
  <View style={styles.containerFormulario}>
    {/* Campo Usuário */}
    <View style={styles.grupoInput}>
      <Text style={styles.rotulo}>Usuário</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu usuário..."
        placeholderTextColor="#999"
        value={nome}
        onChangeText={setNome}
      />
    </View>

    {/* Campo Email */}
    <View style={styles.grupoInput}>
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

    {/* Campo Senha */}
    <View style={styles.grupoInput}>
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

    {/* Opções de Gênero */}
    <View style={styles.grupoInput}>
      <Text style={styles.rotulo}>Gênero</Text>
      <View style={styles.opcoesGenero}>
        {opcoesGenero.map((op) => (
          <Pressable 
            key={op} 
            style={styles.botaoOpcao} 
            onPress={() => setGenero(op)}
          >
            <View style={[
              styles.radioExterno,
              genero === op && styles.radioSelecionado
            ]}>
              {genero === op && <View style={styles.radioInterno} />}
            </View>
            <Text style={styles.textoOpcao}>{op}</Text>
          </Pressable>
        ))}
      </View>
    </View>

    {/* Checkbox de Termos */}
    <View style={styles.containerTermos}>
      <CheckBox
        value={concordoTermos}
        onValueChange={setConcordoTermos}
        tintColors={{ true: '#4CAF50', false: '#aaa' }}
        style={styles.checkbox}
      />
      <Text style={styles.textoTermos}>Concordo com os termos de uso</Text>
    </View>

    {/* Mensagem de Erro */}
    {errorMessage && (
      <Text style={styles.textoErro}>{errorMessage}</Text>
    )}

    {/* Botão de Cadastro */}
    <TouchableOpacity 
      style={[
        styles.botaoPrimario, 
        carregando && styles.botaoDesativado
      ]} 
      onPress={cadastrar}
      disabled={carregando}
    >
      <Text style={styles.textoBotao}>
        {carregando ? 'Cadastrando...' : 'Cadastrar'}
      </Text>
    </TouchableOpacity>

    {/* Divisor */}
    <View style={styles.divisor}>
      <View style={styles.linhaDivisor} />
      <Text style={styles.textoDivisor}>Ou</Text>
      <View style={styles.linhaDivisor} />
    </View>

    {/* Botão do Google */}
    <TouchableOpacity
      style={[
        styles.botaoGoogle, 
        (!request || carregando) && styles.botaoDesativado
      ]}
      onPress={() => promptAsync({ useProxy: true })}
      disabled={!request || carregando}
    >
      <View style={styles.conteudoBotaoGoogle}>
        <Image
          source={require('../../assets/google-icon.png')} 
          style={styles.iconeGoogle}
        />
        <Text style={styles.textoBotaoGoogle}>
          {carregando ? 'Carregando...' : 'Entrar com Google'}
        </Text>
      </View>
    </TouchableOpacity>

    {/* Link para Login */}
    <Pressable 
      style={styles.linkLogin} 
      onPress={() => navigation.navigate('Login')}
    >
      <Text style={styles.textoLinkLogin}>
        Já tem uma conta? <Text style={styles.textoLinkLoginNegrito}>Faça login</Text>
      </Text>
    </Pressable>
  </View>
</View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  containerLogo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  textoCabecalho: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 8,
  },
  imagemLogo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  containerFormulario: {
    width: '100%',
  },
  grupoInput: {
    marginBottom: 12,
  },
  rotulo: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 4,
  },
  input: {
    width: '100%',
    height: 42,
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1A202C',
  },
  opcoesGenero: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 6,
  },
  botaoOpcao: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioExterno: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#CBD5E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  radioSelecionado: {
    borderColor: '#4299E1',
  },
  radioInterno: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4299E1',
  },
  textoOpcao: {
    fontSize: 13,
    color: '#4A5568',
  },
  containerTermos: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  textoTermos: {
    fontSize: 13,
    color: '#718096',
    marginLeft: 6,
  },
  textoErro: {
    color: '#E53E3E',
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },
  botaoPrimario: {
    width: '100%',
    height: 44,
    backgroundColor: '#4299E1',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  botaoDesativado: {
    backgroundColor: '#BEE3F8',
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  divisor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  linhaDivisor: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  textoDivisor: {
    color: '#718096',
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 10,
  },
  conteudoBotaoGoogle: {
    flexDirection: 'row',    
  alignItems: 'center',   
  justifyContent: 'center', 
  padding: 10,
  backgroundColor: 'transparent', 
  }, 
  botaoGoogle: {
    width: '100%',
    height: 44,
    backgroundColor: '#12577B',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconeGoogle: {
    width: 18,
    height: 18,
    marginRight: 10,
        flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  textoBotaoGoogle: {
    color: '#ffffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  linkLogin: {
    marginTop: 12,
    marginBottom: 20,
  },
  textoLinkLogin: {
    color: '#718096',
    fontSize: 13,
    textAlign: 'center',
  },
  textoLinkLoginNegrito: {
    color: '#4299E1',
    fontWeight: '600',
  },
});
export default CadastroScreen;
