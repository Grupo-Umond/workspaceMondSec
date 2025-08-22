import React, {useState} from 'react';
import { View, Text, TextInput, Button, Pressable, StyleSheet } from 'react-native';
import CheckBox from 'expo-checkbox';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CadastroScreen = ({navigation, setUserToken}) => {
  const [nome, setNome] = useState('');
  const [genero, setGenero] = useState(null);          
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  
  const regexTelefone = /^(\+55\s?)?(\(?[1-9]{2}\)?\s?)?(9\d{4}|\d{4})-?\d{4}$/;
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [concordoTermos, setConcordoTermos] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erroMessage, setErroMessage] = useState('');

  const opcoesGenero = ['Masculino', 'Feminino', 'Prefiro não informar'];


  const validarDados = () => {
    if (!nome || !genero || !email || !senha || !telefone) {
      setErroMessage('Por favor, preencha todos os campos obrigatórios.');
      return false;
    }
    if (senha.length < 6) {
      setErroMessage('A senha precisa ter pelo menos 6 caracteres.');
      return false;
    }

    if(!regexTelefone.test(telefone)){
      setErroMessage('Telefone invalido');
      return false;
    }

    if(!regexEmail.test(email)){
      setErroMessage('Email invalido');
      return false;
    }

    if (!concordoTermos) {
      setErroMessage('Concorde com nossos termos de uso');
      return false;
    }
    return true;
  };

  const enviarDados = async () => {
    if (!validarDados()) return;

    setCarregando(true);

    try{
      const response = await axios.post('http://127.0.0.1:8000/api/usuario/cadastrar', {
        nome,
        email,
        telefone,
        genero,
        senha,
      });

      const tokenUser = response.data.tokenUser;
      await AsyncStorage.setItem('userToken', tokenUser);
      setUserToken(tokenUser);
    } catch (erro) {
      console.log(erro);
      if(erro.status === 401) {
        setErroMessage('Cadastro não autorizado');
        return;

      }else if(erro.status === 500) {
        setErroMessage('Erro no servidor, tente mais tarde');
        return;

      }else{
        setErroMessage('Erro inesperado, tente mais tarde');
        console.log(erro);
        return;
      }
      
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

      <Text>Telefone</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu numero de telefone..."
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="numeric"
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

      {erroMessage ? (
        <Text style={{ color: 'red', marginBottom: 10 }}>{erroMessage}</Text>
      ) : null}

      <Button
        title={carregando ? 'Cadastrando...' : 'Cadastrar'}
        onPress={() => enviarDados()}
        color="black"
        disabled={carregando}
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
