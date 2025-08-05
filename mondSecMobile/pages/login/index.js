import React, { useState, useEffect} from "react";
import { View, Text, TextInput, Button, Pressable, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import  CheckBox  from 'expo-checkbox';
import  axios  from 'axios';

const LoginScreen = ({navigation}) => {
  const[erroMessage, setErroMessage] = useState('');
  const[carregando, setCarregando] = useState(false);
  const[email, setEmail] = useState('');
  const[senha, setSenha] = useState('');
  const[lembreDeMim, setLembreDeMim] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    const verificarLembra = async () => {
      const response = await AsyncStorage.getItem('lembraMim');
      const token = await AsyncStorage.getItem('userToken');
      if(response && token) {
        navigation.navigate('Home');
      }
    }

    verificarLembra();
  },[]);
  const validarDados = () => {
    if(!email || !senha) {
      setErroMessage('Por favor, preenche todos os campos.');
      return false;
    }

    if(!emailRegex.test(email)) {
      setErroMessage('Por favor, digite um email valido.');
      return false;
    }

    if(senha.length < 6) {
      setErroMessage('Por favor, digite uma senha com mais de 6 digitos.');
      return false;
    }
    
    setErroMessage('')
    return true;
  }

  const validarLogin = async () => {
    if(!validarDados()) return;

    setCarregando(true);

    try {

      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email,
        senha,
      });

      const token = response.data.access_token;
    
      if(!token) {
        setErroMessage("Erro ao autenticar. Token não recebido.");
        return;
      }

      await AsyncStorage.setItem('userToken', token);

      if(lembreDeMim === true) {
        await AsyncStorage.setItem('lembraMim', true)
      }

      navigation.navigate('Home');




    } catch (err) {

        if(err.response?.status === 401) {
          setErroMessage("Email ou senha incorretos.");
        } else {

          console.log(err);
          setErroMessage("Falha no servidor.");

        }
      }finally{
        setCarregando(false);
      }
  }

  return (
  <View style={styles.container}>
    <Text style={styles.title}>Entrar</Text>

    <View>
      <Text>Email</Text>
      <TextInput
        placeholder="Digite seu email..."
        keyboardType="email-address"
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
      />

      <Text>Senha</Text>
      <TextInput
        placeholder="Digite sua senha..."
        keyboardType="default"
        onChangeText={setSenha}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
      />

      <Pressable style={styles.link} onPress={() => navigation.navigate('TrocarSenha')}>
          <Text>Esqueceu a senha?</Text>
      </Pressable>

      {erroMessage ? <Text style={styles.error}>{erroMessage}</Text> : null}

      <View style={styles.checkboxContainer}>
        <CheckBox value={lembreDeMim} onValueChange={setLembreDeMim} />
        <Text style={styles.checkboxLabel}>Lembrar de mim</Text>
      </View>

      <Button
        title={carregando ? 'Entrando...' : 'Entrar'}
        onPress={validarLogin}
        disabled={carregando}
      />


      <Pressable style={styles.link} onPress={() => navigation.navigate('Cadastro')}>
      <Text style={styles.link}>Ja tem uma conta? Cadastre agora</Text>
      </Pressable>
      </View>


  </View>
  );
};


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

export default LoginScreen;
