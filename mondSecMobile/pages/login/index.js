import React, { useState, useEffect, useContext } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  Modal 
} from 'react-native';

import { AuthContext } from '../../services/AuthContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from "../../services/themes/themecontext";
import UrlService from '../../services/UrlService';
import Feather from '@expo/vector-icons/Feather';
import { MaterialIcons } from "@expo/vector-icons";

const LoginScreen = ({ navigation, route }) => {

  const [erroMessage, setErroMessage] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [viewPass, setViewPass] = useState(true);

  const regexTelefone = /^(?:\s?)?(?:\(?\d{2}\)?\s?)?(?:9?\d{4}-?\d{4})$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const mensagem = route.params?.mensagem;
  const [sucessMessage, setSucessMessage] = useState(mensagem);

  const { logar } = useContext(AuthContext);
  const { theme, isDarkMode } = useTheme();

  // -----------------------------
  // 🔔 ESTADOS DO MODAL
  // -----------------------------
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTipo, setModalTipo] = useState("sucesso");
  const [modalTexto, setModalTexto] = useState("");

  const abrirModal = (tipo, texto) => {
    setModalTipo(tipo);
    setModalTexto(texto);
    setModalVisible(true);

    setTimeout(() => {
      setModalVisible(false);
    }, 2500);
  };

  const validarDados = () => {
    setSucessMessage('');

    if (!login || !senha) {
      abrirModal("erro", "Preencha todos os campos.");
      return false;
    }

    if (!emailRegex.test(login) && !regexTelefone.test(login)) {
      abrirModal("erro", "Digite um email ou número válido.");
      return false;
    }

    if (senha.length < 8) {
      abrirModal("erro", "A senha deve ter pelo menos 8 dígitos.");
      return false;
    }

    return true;
  };

  const validarLogin = async () => {
    if (!validarDados()) return;

    setCarregando(true);

    try {
      const response = await UrlService.post('/usuario/login', { login, senha });

      const token = response.data.tokenUser;

      if (!token) {
        abrirModal("erro", "Erro ao autenticar!");
        return;
      }

      abrirModal("sucesso", "Login realizado!");

      const mensagem = response.data.mensagem;

      await logar(token);

      setTimeout(() => {
        navigation.navigate('Home', { mensagem });
      }, 800);

    } catch (err) {
      if (err.response?.status === 401) {
        abrirModal("erro", "Email ou senha incorretos.");
      } else if (err.response?.status === 403) {
        abrirModal("erro", "Conta deletada.");
      } else if (err.response?.status === 505) {
        abrirModal("erro", "Erro no servidor.");
      } else {
        abrirModal("erro", "Falha de conexão.");
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      {/* FUNDO */}
      <View style={styles.containerFundo}>
        <View style={[
          styles.metadeFundo,
          { backgroundColor: isDarkMode ? theme.cimaDark : "#12577B" }
        ]} />

        <View style={[
          styles.metadeFundo,
          { backgroundColor: isDarkMode ? theme.baixoDark : "#a9cfe5" }
        ]} />
      </View>

      {/* CARD */}
      <View style={[
        styles.containerConteudo,
        { backgroundColor: isDarkMode ? "#1a1a1a" : "whitesmoke" }
      ]}>

        <Pressable
          onPress={() => navigation.navigate('Home')}
          style={styles.iconeCabecalho}
        >
          <FontAwesome name="arrow-left" size={20} color={theme.title} />
        </Pressable>

        <View style={styles.logoContainer}>
          <Image
            source={
              isDarkMode
                ? require("../../assets/logobranca.png")
                : require("../../assets/mondSecLogo.png")
            }
            style={styles.imagemLogo}
          />
        </View>

        <Text style={[styles.textoBoasVindas, { color: theme.title }]}>
          Bem-vindo à MondSec!
        </Text>

        <Text style={[styles.textoEntrar, { color: theme.title }]}>Entrar</Text>

        {/* EMAIL */}
        <View style={styles.containerInput} marginBottom={20}>
          <Text style={[styles.rotulo, { color: theme.text }]}>Email</Text>

          <TextInput
            style={[
              styles.input,
              { borderBottomColor: theme.border, color: theme.text }
            ]}
            placeholder="Digite seu email..."
            placeholderTextColor={theme.textSecondary}
            onChangeText={setLogin}
            autoCapitalize="none"
          />
        </View>

        {/* SENHA */}
        <View style={styles.containerInput} marginBottom={2}>
          <Text style={[styles.rotulo, { color: theme.text }]}>Senha</Text>

          <View style={styles.campoSenha}>
            <View style={styles.campoInput}>
              <TextInput
                style={[
                  styles.input,
                  { borderBottomColor: theme.border, color: theme.text }
                ]}
                placeholder="Digite sua senha..."
                placeholderTextColor={theme.textSecondary}
                secureTextEntry={viewPass}
                onChangeText={setSenha}
              />
            </View>

            <Pressable onPress={() => setViewPass(!viewPass)}>
              {viewPass ? (
                <Feather name="eye" size={24} color="black" />
              ) : (
                <Feather name="eye-off" size={24} color="black" />
              )}
            </Pressable>
          </View>
        </View>

        {/* Recuperação */}
        <View style={styles.linhaOpcoes}>
          <Pressable onPress={() => navigation.navigate('DigiteCampo')}>
            <Text style={[styles.textoSenhaEsquecida, { color: theme.primary }]}>
              Esqueceu a senha?
            </Text>
          </Pressable>
        </View>

        {/* Botão Login */}
        <TouchableOpacity
          style={[styles.botaoLogin, { backgroundColor: theme.buttonColor }]}
          onPress={validarLogin}
          disabled={carregando}
        >
          <Text style={styles.textoBotaoLogin}>
            {carregando ? "Entrando..." : "Entrar"}
          </Text>
        </TouchableOpacity>

        {/* Divisor */}
        <View style={styles.divisor}>
          <View style={[styles.linhaDivisor, { backgroundColor: theme.border }]} />
          <Text style={[styles.textoDivisor, { color: theme.textSecondary }]}>ou</Text>
          <View style={[styles.linhaDivisor, { backgroundColor: theme.border }]} />
        </View>

        {/* Cadastro */}
        <Pressable
          style={styles.linkCadastro}
          onPress={() => navigation.navigate('Cadastro')}
        >
          <Text style={[styles.textoLinkCadastro, { color: theme.textSecondary }]}>
            Ainda não tem uma conta?
            <Text style={[styles.destaqueLinkCadastro, { color: theme.primary }]}>
              {" "}Cadastre-se
            </Text>
          </Text>
        </Pressable>

      </View>

      {/* -------------------------------- */}
      {/* 🔔 MODAL DE SUCESSO / ERRO */}
      {/* -------------------------------- */}
      <Modal transparent animationType="fade" visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={[
            styles.modalBox,
            { backgroundColor: modalTipo === "sucesso" ? "#2ecc71" : "#e74c3c" }
          ]}>
            <MaterialIcons
              name={modalTipo === "sucesso" ? "check-circle" : "error"}
              size={55}
              color="#fff"
            />
            <Text style={styles.modalTexto}>{modalTexto}</Text>
          </View>
        </View>
      </Modal>

    </View>
  );
};


// --------------------------------
// ESTILOS
// --------------------------------
const styles = StyleSheet.create({
  container: { flex: 1 },

  containerFundo: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
  },

  metadeFundo: {
    height: '50%',
  },

  containerConteudo: {
    flex: 1,
    paddingHorizontal: 20,
    marginHorizontal: 25,
    paddingTop: 25,
    marginTop: 115,
    marginBottom: 115,
    borderRadius: 10,
    zIndex: 1,
  },

  logoContainer: {
    alignSelf: 'center',
    width: '100%',
  },

  imagemLogo: {
    width: '100%',
    height: 100,
    resizeMode: 'contain'
  },

  textoBoasVindas: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },

  textoEntrar: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },

  rotulo: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: -12,
  },

  input: {
    width: '100%',
    height: 60,
    backgroundColor: 'transparent',
    borderBottomWidth: 0.8,
    fontSize: 18,
  },

  campoSenha: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  campoInput: {
    width: '90%',
  },

  linhaOpcoes: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  textoSenhaEsquecida: {
    fontSize: 16,
    fontWeight: '600',
  },

  botaoLogin: {
    width: '70%',
    height: 45,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    alignSelf: 'center',
  },

  textoBotaoLogin: {
    fontSize: 20,
    fontWeight: '600',
    color: "#fff",
  },

  divisor: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  linhaDivisor: {
    flex: 1,
    height: 1,
  },

  textoDivisor: {
    fontSize: 16,
    fontWeight: '600',
  },

  linkCadastro: {
    marginTop: 10,
  },

  textoLinkCadastro: {
    fontSize: 16,
    textAlign: 'center',
  },

  destaqueLinkCadastro: {
    fontWeight: '600',
  },

  // ------------------
  // 🔔 ESTILOS DO MODAL
  // ------------------
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "75%",
    padding: 25,
    borderRadius: 15,
    alignItems: "center",
    elevation: 5,
  },

  modalTexto: {
    color: "#fff",
    marginTop: 12,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default LoginScreen;