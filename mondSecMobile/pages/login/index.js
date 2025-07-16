// LoginScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Pressable, Alert, StyleSheet, Platform } from 'react-native';
import CheckBox from 'expo-checkbox';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import axios from 'axios';

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
  const [lembreDeMim, setLembreDeMim] = useState(false);
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
          setLembreDeMim(true);
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
      <Text style={styles.title}>Entrar</Text>

      <Text>E‑mail</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu e‑mail..."
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text>Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha..."
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <View style={styles.checkboxContainer}>
        <CheckBox value={lembreDeMim} onValueChange={setLembreDeMim} />
        <Text style={styles.checkboxLabel}>Lembrar de mim</Text>
      </View>

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <Button
        title={carregando ? 'Entrando...' : 'Entrar'}
        onPress={verificarLogin}
        disabled={carregando}
      />

      <Pressable onPress={() => navigation.navigate('RecuperarSenha')}>
        <Text style={styles.link}>Esqueceu a senha?</Text>
      </Pressable>

      <View style={{ marginVertical: 16 }} />

      <Button
        title="Entrar com Google"
        onPress={() => promptAsync({ useProxy: true })}
        disabled={!request || carregando}
      />

      <Pressable onPress={() => navigation.navigate('Cadastro')}>
        <Text style={styles.link}>Ainda não tem conta? Cadastre‑se agora!</Text>
      </Pressable>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  checkboxLabel: { marginLeft: 8 },
  link: { marginTop: 24, color: '#1e90ff', textAlign: 'center', fontSize: 16 },
  error: { color: 'red', marginBottom: 10, textAlign: 'center' },
});
