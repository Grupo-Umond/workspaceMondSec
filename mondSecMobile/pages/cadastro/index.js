import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Pressable, Alert, StyleSheet } from 'react-native';
import CheckBox from 'expo-checkbox';
import axios from 'axios';

const CadastroScreen = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [genero, setGenero] = useState(null);          
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [concordoTermos, setConcordoTermos] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const opcoesGenero = ['Masculino', 'Feminino', 'Prefiro não informar'];


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
        generoUsuario: genero,
        emailUsuario: email,
        senhaUsuario: senha,
      };
      const res = await axios.post('http://127.0.0.1:8000/api/usuarios', payload);

      if (res.data && res.data.email) {
        Alert.alert('Sucesso', 'Cadastro realizado! Faça login para continuar.');
        navigation.navigate('Login');
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
      <Text>Usuário</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu usuário..."
        value={nome}
        onChangeText={setNome}
      />

      <Text>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu email..."
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

      <Text style={styles.label}>Gênero</Text>
      {opcoesGenero.map((op) => (
        <Pressable key={op} style={styles.opcao} onPress={() => setGenero(op)}>
          <View style={styles.radioContainer}>
            <View style={styles.radio}>
              {genero === op && <View style={styles.radioSelecionado} />}
            </View>
            <Text style={styles.texto}>{op}</Text>
          </View>
        </Pressable>
      ))}

      <CheckBox
        value={concordoTermos}
        onValueChange={setConcordoTermos}
        tintColors={{ true: '#00ff08ff', false: '#aaa' }}
      />
      <Text>Concordo com os termos de uso</Text>

      {errorMessage ? (
        <Text style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</Text>
      ) : null}

      <Button
        title={carregando ? 'Cadastrando...' : 'Cadastrar'}
        onPress={cadastrar}
        color="black"
        disabled={carregando}
      />

      <View style={{ marginTop: 16 }} />
      <Button
        title="Entrar com Google"
        onPress={() => promptAsync({ useProxy: true })}
        disabled={!request || carregando}
        color="black"
      />

      <Pressable onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Já tem uma conta? Faça o login aqui!</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 10,
    borderRadius: 8,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 8,
  },
  opcao: {
    marginVertical: 8,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioSelecionado: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#555',
  },
  texto: {
    fontSize: 16,
  },
  link: {
    marginTop: 20,
    color: 'blue',
    textAlign: 'center',
  },
});

export default CadastroScreen;
