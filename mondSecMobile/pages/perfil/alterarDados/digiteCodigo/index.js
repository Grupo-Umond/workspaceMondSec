import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import UrlService from "../../../../services/UrlService";
import axios from "axios";

const DigiteCodigoScreen = ({ navigation, route }) => {
  const [digitos, setDigitos] = useState(["", "", "", "", "", ""]);
  const [direcao, setDirecao] = useState(true); // true => email, false => telefone
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erroMessage, setErroMessage] = useState("");
  const [tempoRestante, setTempoRestante] = useState(0);

  const usuario = route.params?.usuario;
  const campo = route.params?.campo;
  const code = digitos.join("");

  useEffect(() => {
    // define direcao inicial com base no campo passado
    if (campo === 'telefone') {
      setDirecao(false);
    } else if (campo === 'email') {
      setDirecao(true);
    }
    console.log('[DigiteCodigoScreen] route.params', route.params);
    buscarDados();
  }, []);

  // Busca dados do usuário logado (se houver) ou pega os dados do "usuario" prop
  const buscarDados = async () => {
    console.log('[DigiteCodigoScreen] buscarDados iniciado');
    const tokenUser = await AsyncStorage.getItem("userToken");
    try {
      if (tokenUser) {
        console.log('[DigiteCodigoScreen] tokenUser encontrado, buscando /usuario/buscar');
        const response = await UrlService.get('/usuario/buscar', {
          headers: { Authorization: `Bearer ${tokenUser}` },
        });
        console.log('[DigiteCodigoScreen] response /usuario/buscar', response.data);
        setEmail(response.data.usuario.email || "");
        setTelefone(response.data.usuario.telefone || "");

        // depois de popular, automaticamente criar codigo
        if (direcao && response.data.usuario.email) {
          criarCodigo(response.data.usuario.email);
        } else if (!direcao && response.data.usuario.telefone) {
          criarCodigo(response.data.usuario.telefone);
        }
      } else if (usuario) {
        console.log('[DigiteCodigoScreen] sem token, usando usuario passado por param', usuario);
        if (direcao && usuario.email) {
          setEmail(usuario.email);
          criarCodigo(usuario.email);
        } else if (!direcao && usuario.telefone) {
          setTelefone(usuario.telefone);
          criarCodigo(usuario.telefone);
        } else {
          console.log('[DigiteCodigoScreen] usuario param não possui o campo necessário', { usuario, direcao });
        }
      } else {
        console.log('[DigiteCodigoScreen] nem token nem usuario param disponíveis');
      }
    } catch (erro) {
      console.log('[DigiteCodigoScreen] erro ao buscarDados:', erro.response?.data || erro.message);
      Alert.alert('Erro', 'Falha ao buscar dados do usuário: ' + (erro.response?.data?.mensagem || erro.message));
    }
  };

  const criarCodigo = async (loginParam) => {
    console.log('[DigiteCodigoScreen] criarCodigo chamado', { direcao, loginParam });
    const tokenUser = await AsyncStorage.getItem("userToken");
    try {
      let response;
      if (direcao) {
        if (tokenUser) {
          console.log('[DigiteCodigoScreen] POST /codigo/auth/sendEmail via UrlService');
          response = await UrlService.post('/codigo/auth/sendEmail', {}, { headers: { Authorization: `Bearer ${tokenUser}` } });
        } else {
          const login = loginParam || email;
          console.log('[DigiteCodigoScreen] POST /codigo/sendEmail via axios, login:', login);
          response = await axios.post('http://10.248.176.10:8000/api/codigo/sendEmail', { login });
        }
      } else {
        if (tokenUser) {
          console.log('[DigiteCodigoScreen] POST /codigo/auth/sendSms via UrlService');
          response = await UrlService.post('/codigo/auth/sendSms', {}, { headers: { Authorization: `Bearer ${tokenUser}` } });
        } else {
          const tel = loginParam || usuario?.telefone || telefone;
          console.log('[DigiteCodigoScreen] POST /codigo/sendSms via axios, telefone:', tel);
          response = await axios.post('http://10.248.176.10:8000/api/codigo/sendSms', { telefone: tel });
        }
      }

      console.log('[DigiteCodigoScreen] criarCodigo response', response?.data);
      setTempoRestante(30);
    } catch (erro) {
      console.log('[DigiteCodigoScreen] erro ao criar codigo', erro.response?.data || erro.message);
      if (erro.response?.status === 429) {
        setTempoRestante(erro.response.data.tempoRestante || 30);
        Alert.alert('Aguarde', `Por favor, aguarde ${erro.response.data.tempoRestante || 30}s antes de tentar novamente.`);
      } else {
        Alert.alert('Erro', 'Falha ao criar código: ' + (erro.response?.data?.erro || erro.message));
      }
    }
  };

  useEffect(() => {
    if (tempoRestante <= 0) return;
    const timer = setInterval(() => {
      setTempoRestante(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [tempoRestante]);

  const pegarLogin = () => {
    if (direcao) {
      console.log('[DigiteCodigoScreen] pegarLogin -> email', email || usuario?.email);
      setEmail(email || usuario?.email || "");
      return email || usuario?.email || "";
    } else {
      console.log('[DigiteCodigoScreen] pegarLogin -> telefone', telefone || usuario?.telefone);
      setTelefone(telefone || usuario?.telefone || "");
      return telefone || usuario?.telefone || "";
    }
  };

  const handleChange = (text, index) => {
    const newDigitos = [...digitos];
    newDigitos[index] = text.replace(/[^0-9]/g, '');
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
      const login = pegarLogin();
      console.log('[DigiteCodigoScreen] enviarCodigo enviando verify', { code, direcao, login, hasToken: !!tokenUser });

      const response = await UrlService.post(
        '/codigo/auth/verify',
        { code, direcao, login },
        tokenUser ? { headers: { Authorization: `Bearer ${tokenUser}` } } : {}
      );

      console.log('[DigiteCodigoScreen] enviarCodigo response', response.data);

      const tokenTemp = response.data.token;
      if (!tokenTemp) {
        setErroMessage("Permissão não recebida");
        Alert.alert('Erro', 'Permissão não recebida do servidor.');
        return;
      }

      await AsyncStorage.setItem("tokenTemp", tokenTemp);
      Alert.alert('Sucesso', 'Código validado. Redirecionando...');
      navigation.navigate("AlterarSenha", { direcao });
    } catch (err) {
      console.log('[DigiteCodigoScreen] erro ao enviar codigo', err.response?.data || err.message);
      const mensagem = err.response?.data?.message || err.response?.data?.erro || err.message;
      setErroMessage(mensagem);
      Alert.alert('Erro', mensagem);
    } finally {
      setCarregando(false);
    }
  };

  const handleResendPress = async () => {
    if (tempoRestante > 0) {
      console.log('[DigiteCodigoScreen] tentativa de reenviar bloqueado', tempoRestante);
      return;
    }
    setTempoRestante(30);
    await criarCodigo();
  };

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <Pressable onPress={() => navigation.navigate('Menu')} style={styles.iconeCabecalho}>
          <FontAwesome name="arrow-left" size={20} color="#12577B" />
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
        <Pressable onPress={() => { setDirecao(false); setTempoRestante(0); }}>
          <Text style={styles.linkText}>
            Não tenho acesso a esse email.{" "}
            <Text style={styles.linkHighlight}>Enviar por SMS</Text>
          </Text>
        </Pressable>
      ) : (
        <Pressable onPress={() => { setDirecao(true); setTempoRestante(0); }}>
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
        onPress={handleResendPress}
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

// ... estilos (mantive os mesmos do seu original) ...
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
