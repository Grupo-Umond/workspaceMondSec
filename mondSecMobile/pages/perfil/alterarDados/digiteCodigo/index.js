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
import { useTheme } from "../../../../services/themes/themecontext";
import { SafeAreaView } from 'react-native-safe-area-context';
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
  const { theme, isDarkMode } = useTheme(); 

  const usuario = route.params?.usuario;
  const campo = route.params?.campo;
  const code = digitos.join("");

  useEffect(() => {
    if (campo === 'telefone') setDirecao(false);
    if (campo === 'email') setDirecao(true);

    buscarDados();
  }, []);

  const buscarDados = async () => {
    const tokenUser = await AsyncStorage.getItem("userToken");

    try {
      if (tokenUser) {
        const response = await UrlService.get('/usuario/buscar', {
          headers: { Authorization: `Bearer ${tokenUser}` },
        });

        setEmail(response.data.usuario.email || "");
        setTelefone(response.data.usuario.telefone || "");

        if (direcao && response.data.usuario.email) {
          criarCodigo(response.data.usuario.email);
        } else if (!direcao && response.data.usuario.telefone) {
          criarCodigo(response.data.usuario.telefone);
        }
      } else if (usuario) {
        if (direcao && usuario.email) {
          setEmail(usuario.email);
          criarCodigo(usuario.email);
        } else if (!direcao && usuario.telefone) {
          setTelefone(usuario.telefone);
          criarCodigo(usuario.telefone);
        }
      }
    } catch (erro) {
      Alert.alert('Erro', 'Falha ao buscar dados do usuário.');
    }
  };

  const criarCodigo = async (loginParam) => {
    const tokenUser = await AsyncStorage.getItem("userToken");

    try {
      let response;
      if (direcao) {
        if (tokenUser) {
          response = await UrlService.post('/codigo/auth/sendEmail', {}, { 
            headers: { Authorization: `Bearer ${tokenUser}` } 
          });
        } else {
          const login = loginParam || email;
          response = await UrlService.post('/codigo/sendEmail', { login });
        }
      } else {
        if (tokenUser) {
          response = await UrlService.post('/codigo/auth/sendSms', {}, { 
            headers: { Authorization: `Bearer ${tokenUser}` } 
          });
        } else {
          const tel = loginParam || telefone;
          response = await UrlService.post('/codigo/sendSms', { telefone: tel });
        }
      }

      setTempoRestante(30);
    } catch (erro) {
      if (erro.response?.status === 429) {
        setTempoRestante(erro.response.data.tempoRestante || 30);
        Alert.alert('Aguarde', `Aguarde ${erro.response.data.tempoRestante || 30}s.`);
      } else {
        Alert.alert('Erro', 'Falha ao enviar código.');
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
    if (direcao) return email || usuario?.email || "";
    return telefone || usuario?.telefone || "";
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
      setErroMessage("Digite o código com 6 números.");
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

      const response = await UrlService.post(
        '/codigo/auth/verify',
        { code, direcao, login },
        tokenUser ? { headers: { Authorization: `Bearer ${tokenUser}` } } : {}
      );

      const tokenTemp = response.data.token;
      if (!tokenTemp) {
        Alert.alert('Erro', 'Token temporário não retornado.');
        return;
      }

      await AsyncStorage.setItem("tokenTemp", tokenTemp);
      navigation.navigate("AlterarSenha", { direcao });

    } catch (err) {
      const mensagem = err.response?.data?.message || err.response?.data?.erro || err.message;
      setErroMessage(mensagem);
      Alert.alert('Erro', mensagem);
    } finally {
      setCarregando(false);
    }
  };

  const handleResendPress = async () => {
    if (tempoRestante > 0) return;

    const loginAtual = pegarLogin();
    criarCodigo(loginAtual);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>

        <View style={styles.cabecalho}>
          <Pressable
            onPress={() => navigation.navigate("Menu")}
            style={styles.iconeCabecalho}
          >
            <FontAwesome name="arrow-left" size={20} color={theme.title} />
          </Pressable>

          <Text style={[styles.tituloCabecalho, { color: theme.title }]}>
            Verificação de Conta
          </Text>
        </View>

        {/* Logo */}
        <View style={styles.avatarContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={
                isDarkMode
                  ? require("../../../../assets/logobranca.png")
                  : require("../../../../assets/mondSecLogo.png")
              }
              style={styles.logo}
            />
          </View>
        </View>

        <Text style={[styles.title, { color: theme.text }]}>
          {direcao
            ? `Digite o código enviado ao email ${email}`
            : `Digite o código enviado ao número ${telefone}`}
        </Text>

        {direcao ? (
          <Pressable
            onPress={() => {
              setDirecao(false);
              setTempoRestante(0);
            }}
          >
            <Text style={[styles.linkText, { color: theme.textSecondary }]}>
              Não tenho acesso ao email.{" "}
              <Text style={[styles.linkHighlight, { color: theme.primary }]}>
                Enviar por SMS
              </Text>
            </Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => {
              setDirecao(true);
              setTempoRestante(0);
            }}
          >
            <Text style={[styles.linkText, { color: theme.textSecondary }]}>
              Não tenho acesso ao telefone.{" "}
              <Text style={[styles.linkHighlight, { color: theme.primary }]}>
                Enviar por email
              </Text>
            </Text>
          </Pressable>
        )}

        <View style={styles.inputContainer}>
          {digitos.map((d, index) => (
            <TextInput
              key={index}
              style={[
                styles.input,
                {
                  backgroundColor: isDarkMode ? "#1a1a1a" : "#fff",
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              value={d}
              maxLength={1}
              keyboardType="numeric"
              onChangeText={(text) => handleChange(text, index)}
            />
          ))}
        </View>

        {erroMessage ? (
          <Text style={[styles.errorMessage, { color: theme.danger }]}>
            {erroMessage}
          </Text>
        ) : null}

        {/* Reenviar */}
        <TouchableOpacity
          disabled={tempoRestante > 0}
          onPress={handleResendPress}
        >
          <Text
            style={[
              styles.resendLink,
              {
                color: theme.primary,
                opacity: tempoRestante > 0 ? 0.5 : 1,
              },
            ]}
          >
            {tempoRestante > 0
              ? `Reenviar em ${tempoRestante}s`
              : "Não recebeu o código? Reenviar"}
          </Text>
        </TouchableOpacity>

        {/* Confirmar */}
        <TouchableOpacity
          style={[
            styles.confirmButton,
            { backgroundColor: theme.button },
            carregando && styles.disabledButton,
          ]}
          disabled={carregando}
          onPress={enviarCodigo}
        >
          <Text style={styles.confirmButtonText}>
            {carregando ? "Enviando..." : "Confirmar"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },

  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 10,
    gap: 55,
  },

  tituloCabecalho: {
    fontSize: 20,
    fontWeight: "600",
  },

  iconeCabecalho: { padding: 5 },

  avatarContainer: { alignItems: "center", marginBottom: 10 },

  logoContainer: { alignItems: "center" },

  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
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
    borderRadius: 8,
    elevation: 2,
  },

  errorMessage: {
    marginBottom: 10,
    textAlign: "center",
  },

  resendLink: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },

  confirmButton: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: "center",
  },

  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  disabledButton: {
    opacity: 0.5,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },

  linkText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
  },

  linkHighlight: {
    fontWeight: "bold",
  },
});

export default DigiteCodigoScreen;
