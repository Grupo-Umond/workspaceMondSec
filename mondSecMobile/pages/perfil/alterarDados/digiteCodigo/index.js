import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import UrlService from "../../../../services/UrlService";
import axios from "axios";

const DigiteCodigoScreen = ({ navigation, route }) => {
  const [digitos, setDigitos] = useState(["", "", "", "", "", ""]);
  const [direcao, setDirecao] = useState(true);
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erroMessage, setErroMessage] = useState("");
  const [tempoRestante, setTempoRestante] = useState(0);

  const usuario = route.params?.usuario;
  const campo = route.params?.campo;
  const code = digitos.join("");

  useEffect(() => {
    const poronde = () => {
      if(campo === 'telefone'){
        setDirecao(false);
      }


    }
    poronde();
    buscarDados();
    criarCodigo();
  }, [direcao]);

  const buscarDados = async () => {
      const tokenUser = await AsyncStorage.getItem("userToken");
      try {
        if (tokenUser) {
          const response = await UrlService.get('/usuario/buscar', {
            headers: { Authorization: `Bearer ${tokenUser}` },
          });
          setEmail(response.data.usuario.email);
          setTelefone(response.data.usuario.telefone);
        } else if (usuario) {
          return pegarLogin();
        }
      } catch (erro) {
        console.log("Erro ao buscar dados:", erro.response?.data || erro.message);
      }
    };

    const criarCodigo = async () => {
      const login = await pegarLogin();
      const tokenUser = await AsyncStorage.getItem("userToken");

      try {
        let response;
        if (direcao) {
          response = tokenUser
            ? await UrlService.post('/codigo/sendEmail', {}, { headers: { Authorization: `Bearer ${tokenUser}` } })
            : await UrlService.post('/codigo/sendEmail', { login });
        } else {
          response = tokenUser
            ? await UrlService.post('/codigo/sendSms', {}, { headers: { Authorization: `Bearer ${tokenUser}` } })
            : await UrlService.post('/codigo/sendSms', { telefone });
        }

        setTempoRestante(30); 

      } catch (erro) {
        if (erro.response?.status === 429) {
          setTempoRestante(erro.response.data.tempoRestante || 30);
        }
        console.log("Erro ao criar código:", erro.response?.data || erro.message);
      }
    };

  useEffect(() => {
    if (tempoRestante <= 0) return;
    const timer = setInterval(() => {
      setTempoRestante(prev => {
        if (prev <= 1) clearInterval(timer);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [tempoRestante]);

  const pegarLogin = () => {
    if (direcao) {
      setEmail(usuario.email);
      return usuario.email;
    } else {
      setTelefone(usuario.telefone);
      return usuario.telefone;
    }
  };

  const handleChange = (text, index) => {
    const newDigitos = [...digitos];
    newDigitos[index] = text;
    setDigitos(newDigitos);
  };

  const validarCodigo = () => {
    setErroMessage("");

    if (!code) {
      setErroMessage("Digite o código.");
      return false;
    }

    if (!/^\d{6}$/.test(code)) {
      setErroMessage("Digite o código com exatamente 6 números.");
      return false;
    }

    return true;
  };

  const enviarCodigo = async () => {
    if (!validarCodigo()) return;

    setCarregando(true);
    const tokenUser = await AsyncStorage.getItem("userToken");

    try {
      const login = await pegarLogin();

      const response = await UrlService.post(
        '/codigo/verify',
        { code, direcao, login },
        tokenUser ? { headers: { Authorization: `Bearer ${tokenUser}` } } : {}
      );

      const tokenTemp = response.data.token;
      if (!tokenTemp) {
        setErroMessage("Permissão não recebida");
        return;
      }

      await AsyncStorage.setItem("tokenTemp", tokenTemp);
      navigation.navigate("AlterarSenha", { direcao });
    } catch (err) {
      console.log("Erro ao enviar código:", err.response?.data || err.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <Pressable onPress={() => navigation.navigate('Menu')} style={styles.iconeCabecalho}>
          <FontAwesome name="arrow-left" size={24} color="#12577B" />
        </Pressable>
        <Text style={styles.tituloCabecalho}>Verificação de Conta</Text>
      </View>

      <View style={styles.avatarContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../../assets/mondSecLogo.png")}
            style={styles.logo}
          />
        </View>
      </View>

      <Text style={styles.title}>
        {direcao
          ? `Digite o código que enviamos para o email ${email}`
          : `Digite o código que enviamos para o número ${telefone}`}
      </Text>

      {direcao ? (
        <Pressable onPress={() => setDirecao(false)}>
          <Text style={styles.linkText}>
            Não tenho acesso a esse email.{" "}
            <Text style={styles.linkHighlight}>Enviar por SMS</Text>
          </Text>
        </Pressable>
      ) : (
        <Pressable onPress={() => setDirecao(true)}>
          <Text style={styles.linkText}>
            Não tenho acesso a esse telefone.{" "}
            <Text style={styles.linkHighlight}>Enviar por email</Text>
          </Text>
        </Pressable>
      )}

      <View style={styles.inputContainer}>
        {digitos.map((d, index) => (
          <TextInput
            key={index}
            style={styles.input}
            value={d}
            maxLength={1}
            keyboardType="numeric"
            onChangeText={(text) => handleChange(text, index)}
          />
        ))}
      </View>

      {erroMessage ? (
        <Text style={styles.errorMessage}>{erroMessage}</Text>
      ) : null}

      <TouchableOpacity
        onPress={() => setTempoRestante(tempoRestante > 0 ? tempoRestante : 30) || criarCodigo()}
        disabled={tempoRestante > 0}
      >
        <Text style={[styles.resendLink, tempoRestante > 0 && { opacity: 0.5 }]}>
          {tempoRestante > 0
            ? `Reenviar em ${tempoRestante}s`
            : "Não recebeu o código? Reenviar"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.confirmButton, carregando && styles.disabledButton]}
        onPress={enviarCodigo}
        disabled={carregando}
      >
        <Text style={styles.confirmButtonText}>
          {carregando ? "Enviando..." : "Confirmar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#fff", 
    paddingTop: 60,
  },
  
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
    gap:55,  
  },
  tituloCabecalho: {
    fontSize: 20,
    fontWeight: '600',
    color: '#12577B',
  },
  iconeCabecalho: {
    padding: 5,
  },
  avatarContainer: { 
    alignItems: "center", 
    marginBottom: 10 
  },
  
  logoContainer: { 
    alignItems: "center" 
  },
  
  logo: { 
    width: 200, 
    height: 200, 
    resizeMode: "contain" 
  },
  
  inputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginVertical: 20,
  },
  
  input: {
    width: 45,
    height: 55,
    fontSize: 20,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 2,
  },
  
  errorMessage: { 
    color: "red", 
    marginBottom: 10, 
    textAlign: "center" 
  },
  
  resendLink: { 
    color: "#007AFF", 
    fontSize: 14, 
    textAlign: "center", 
    marginBottom: 20 
  },
  
  confirmButton: {
    backgroundColor: "#003366",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: "center",
  },
  
  confirmButtonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  
  disabledButton: { 
    opacity: 0.5 
  },
  
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  
  linkText: { 
    fontSize: 14, 
    color: "#555", 
    textAlign: "center", 
    marginTop: 10 
  },
  
  linkHighlight: { 
    color: "#1E90FF", 
    fontWeight: "bold" 
  },
});

export default DigiteCodigoScreen;