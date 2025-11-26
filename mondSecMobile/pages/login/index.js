import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { AuthContext } from '../../services/AuthContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from "../../services/themes/themecontext"; // THEME AQUI
import UrlService from '../../services/UrlService';

const LoginScreen = ({ navigation, route }) => {

  const [erroMessage, setErroMessage] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const regexTelefone = /^(?:\s?)?(?:\(?\d{2}\)?\s?)?(?:9?\d{4}-?\d{4})$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const { logar } = useContext(AuthContext);

  const mensagem = route.params?.mensagem;
  const [sucessMessage, setSucessMessage] = useState(mensagem);

  // TEMA
  const { theme, isDarkMode } = useTheme();

  const validarDados = () => {
    setSucessMessage('');
    if (!login || !senha) {
      setErroMessage('Por favor, preenche todos os campos.');
      return false;
    }

    if (!emailRegex.test(login) && !regexTelefone.test(login)) {
      setErroMessage('Por favor, digite um email ou número válido.');
      return false;
    }

    if (senha.length < 8) {
      setErroMessage('Por favor, digite uma senha com no mínimo 8 dígitos.');
      return false;
    }

    setErroMessage('');
    return true;
  };

  const validarLogin = async () => {
    if (!validarDados()) return;
    setCarregando(true);

    try {
      const response = await UrlService.post('/usuario/login', {
        login,
        senha,
      });

      const token = response.data.tokenUser;

      if (!token) {
        setErroMessage("Erro ao autenticar. Token não recebido.");
        return;
      }

      const mensagem = response.data.mensagem;
      await logar(token);
      navigation.navigate('Home', { mensagem });

    } catch (err) {

      if (err.response?.status === 401) {
        setErroMessage("Email ou senha incorretos.");
      } else if (err.response?.status === 403) {
        setErroMessage("Conta deletada");
      } else if (err.response?.status === 505) {
        setErroMessage("Falha no servidor.");
      }

    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      {/* Fundo */}
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

        <Text style={[styles.textoEntrar, { color: theme.title }]}>
          Entrar
        </Text>

        {/* EMAIL */}
        <View style={styles.containerInput}>
          <Text style={[styles.rotulo, { color: theme.text }]}>Email</Text>
          <TextInput
            style={[
              styles.input,
              {
                borderBottomColor: theme.border,
                color: theme.text
              }
            ]}
            placeholder="Digite seu email..."
            placeholderTextColor={theme.textSecondary}
            onChangeText={setLogin}
            autoCapitalize="none"
          />
        </View>

        {/* SENHA */}
        <View style={styles.containerInput}>
  <Text style={[styles.rotulo, { color: theme.text }]}>Senha</Text>

  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <TextInput
      style={[
        styles.input,
        {
          borderBottomColor: theme.border,
          color: theme.text,
          flex: 1
        }
      ]}
      placeholder="Digite sua senha..."
      placeholderTextColor={theme.textSecondary}
      secureTextEntry={!mostrarSenha}
      onChangeText={setSenha}
    />

    <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
      <FontAwesome
        name={mostrarSenha ? "eye-slash" : "eye"}
        size={22}
        color={theme.text}
        style={{ marginLeft: 10, marginBottom: 10 }}
      />
    </TouchableOpacity>
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

        {erroMessage ? <Text style={styles.erro}>{erroMessage}</Text> : null}
        {sucessMessage ? <Text style={styles.sucess}>{sucessMessage}</Text> : null}

        {/* Botão Login */}
        <TouchableOpacity
          style={[
            styles.botaoLogin,
            { backgroundColor: theme.buttonColor }
          ]}
          onPress={validarLogin}
          disabled={carregando}
        >
          <Text style={[styles.textoBotaoLogin, { color: "#fff" }]}>
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

    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    marginTop: 80,
    marginBottom: 80,
    zIndex: 1,
    borderRadius: 10,
    elevation: 3,
    justifyContent: 'center',
  },
  logoContainer: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 30,
    width: '80%'
  },
  imagemLogo: {
    width: '100%',
    height: 80,
    resizeMode: 'contain'
  },
  textoBoasVindas: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  textoEntrar: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  containerInput: {
    marginBottom: 5,
  },
  rotulo: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: -12,
  },
  input: {
    width: '100%',
    height: 60,
    backgroundColor: 'transparent',
    borderBottomWidth: 0.8,
    fontSize: 16,
  },
  linhaOpcoes: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  textoSenhaEsquecida: {
    fontSize: 14,
    fontWeight: '600',
  },
  erro: {
    color: '#f00',
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 15,
  },
  sucess: {
    color: '#008000',
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 15,
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
    fontSize: 16,
    fontWeight: '600',
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
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 10,
  },
  linkCadastro: {
    marginTop: 10,
  },
  textoLinkCadastro: {
    fontSize: 14,
    textAlign: 'center',
  },
  destaqueLinkCadastro: {
    fontWeight: '600',
  },
});

export default LoginScreen;
