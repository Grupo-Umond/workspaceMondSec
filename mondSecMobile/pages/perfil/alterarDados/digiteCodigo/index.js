import React, {useState} from "react";
import {View, Text, TextInput, Pressable, StyleSheet, Button} from 'react-native';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

const DigiteCodigoScreen = ({navigation, route}) => {
    const[code, setCode] = useState('');
    const[erroMessage, setErroMessage] = useState('')
    const[carregando, setCarregando] = useState(false);
    const email = route.params?.email;

    const validarCodigo = () => {
      setErroMessage('');
      if (!code) {
        setErroMessage('Digite o código.');
        return false;
      }

      if (!/^\d{6}$/.test(code)) {
        setErroMessage('Digite o código com exatamente 6 números.');
        return false;
      }

      return true;

    }

    const enviarCodigo = async () => {
      if(!validarCodigo()) {return};

      setCarregando(true);

      console.log('seu email',email);

        const tokenUser = await AsyncStorage.getItem('userToken');
        try{
          const response = await axios.post('http://127.0.0.1:8000/api/verifyCode', 
            {
              email,
              code,
            },{
              headers:{
                Authorization: `Bearer ${tokenUser}`,
              },
            });

          const tokenTemp = await response.data.token;
          if(!tokenTemp){
            setErroMessage('Permissão não recebida');
            return;
          }
          await AsyncStorage.setItem('tokenTemp', tokenTemp);
          navigation.navigate('TrocarSenha');
        }catch(err){
         console.log(err);
        }finally{
          setCarregando(false);
        }
      }
    
    return(
    <View style={styles.container}>
    <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
    </View>

    <Text style={styles.title}>Digite o código que enviamos para seu email</Text>

    {erroMessage ? <Text style={styles.errorMessage}>{erroMessage}</Text> : null}

    <TextInput
        style={styles.input}
        keyboardType="numeric"
        maxLength={6}
        value={code}
        onChangeText={setCode}
    />

    <Pressable style={styles.linkButton} onPress={() => reenviarCodigo()}>
        <Text style={styles.linkText}>Não recebeu o código? Reenvie aqui</Text>
    </Pressable>

    <Button 
      title={carregando ? 'Enviando...' : 'Enviar'}
      onPress={() => enviarCodigo()}
      disabled={carregando}
    />
    </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  header: {
    marginBottom: 20,
  },

  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  backButtonText: {
    color: "#007AFF",
    fontSize: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },

  errorMessage: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },

  linkButton: {
    alignItems: "center",
    marginBottom: 15,
  },

  linkText: {
    color: "#007AFF",
    fontSize: 14,
  },

  mainButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  mainButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});



export default DigiteCodigoScreen;