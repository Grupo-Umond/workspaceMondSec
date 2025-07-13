import React, { useState } from 'react';
import { View, Text, TextInput, Button, Pressable, Alert } from 'react-native';
import CheckBox from 'expo-checkbox';
import axios from 'axios';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [lembreDeMim, setLembreDeMim] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validarDados = () => {
    if (!senha || !email) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return false;
    }

    if (senha.length < 6) {
      Alert.alert('Erro', 'A senha precisa ter pelo menos 6 caracteres.');
      return false;
    }

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
      } catch (err) {
        if (err.response?.status === 401) {
          Alert.alert('Erro', 'Email ou senha incorretos.');
        } else {
          Alert.alert('Erro', 'Falha de conexão com o servidor.');
        }
      } finally {
        setCarregando(false);
      }
    };

  

  return (
    <View
      style={styles.container}
    >

        <Text style={styles.title}>Entrar</Text>
        <Text>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu email..."
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Text>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha..."
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
        <CheckBox
          value={lembreDeMim}
          onValueChange={setLembreDeMim}
          tintColors={{ true: '#4CAF50', false: '#aaa' }} 
        />
        <Text>Lembre de mim</Text>

        {errorMessage ? (
          <Text style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</Text>
        ) : null}

        <Button
          title={carregando ? 'Entrando...' : 'Entrar'}
          onPress={verificarLogin}
          color="black"
        />
        <Pressable onPress={() => navigation.navigate('#')}>
          <Text style={styles.link}>Esqueceu a senha?</Text>
        </Pressable>
        <Button
          title={carregando ? 'Entrando...' : 'G Entrar como Google'}
          color="black"
        />
        <Pressable onPress={() => navigation.navigate('Cadastro')}>
          <Text style={styles.link}>Já tem uma conta? Cadastre-se agora!</Text>
        </Pressable>
    </View>
  );
};

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  link: {
    marginTop: 24,
    color: '#1e90ff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default LoginScreen;
