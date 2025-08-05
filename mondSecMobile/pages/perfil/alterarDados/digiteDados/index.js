import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, {useState} from "react";
import {TextInput, View, Text, Pressable, StyleSheet, Button} from 'react-native';

const DigiteDadosScreen = ({navigation,route}) => {
    const caminho = route.params?.porOnde;
    const[email, setEmail] = useState('');
    const[erroMessage, setErroMessage] = useState('');
    const[carregando, setCarregando] = useState(false);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    
    const validarDados = () => {
    setErroMessage(''); 

    if (!email) {
        setErroMessage('Digite o campo obrigatório: email.');
        return false;
    }

    if (!emailRegex.test(email)) {
        setErroMessage('Digite um email válido.');
        return false;
    }

    return true;
};


    const validarEnvio = async () => {
      if(!validarDados()) {return};
        setCarregando(true);
      const token = await AsyncStorage.getItem('userToken');

      try{
        await axios.post('http://127.0.0.1:8000/api/requestVerification', {
          email,
        },{
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        navigation.navigate('DigiteCodigo', {email,caminho});

        }catch(err){
          console.log(err.response.data);
          return;

        }finally{
          setCarregando(false);
        }
    }
     return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>Voltar</Text>
      </Pressable>

      <Text style={styles.title}>Digite seu e-mail:</Text>

      <TextInput
        style={styles.input}
        placeholder="exemplo@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {erroMessage ? (
        <Text style={styles.error}>{erroMessage}</Text>
      ) : null}

      <Button
        title={carregando ? 'Enviando...' : 'Enviar'}
        onPress={() => validarEnvio()}
        disabled={carregando}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    color: "#007bff",
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default DigiteDadosScreen;