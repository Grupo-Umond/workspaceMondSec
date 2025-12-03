import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import UrlService from '../../../../services/UrlService';
import { useTheme } from "../../../../services/themes/themecontext";

const DigiteDadosScreen = ({ navigation }) => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [emailV, setEmailV] = useState("");
  const [telefone, setTelefone] = useState("");
  const [telefoneV, setTelefoneV] = useState("");
  const [genero, setGenero] = useState("");

  const { theme, isDarkMode } = useTheme();

  const opcoesGenero = ["Masculino", "Feminino", "Prefiro não informar"];

  const [carregando, setCarregando] = useState(false);
  const [erroMessage, setErroMessage] = useState("");

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const regexTelefone = /^(\+55\s?)?(\(?[1-9]{2}\)?\s?)?(9\d{4}|\d{4})-?\d{4}$/;

  // ================================
  // BUSCAR DADOS DO USUÁRIO
  // ================================
  useEffect(() => {
    const buscarDados = async () => {
      const tokenUser = await AsyncStorage.getItem("userToken");

      try {
        const response = await UrlService.get("/usuario/buscar", {
          headers: { authorization: `Bearer ${tokenUser}` },
        });

        const usuario = response.data.usuario;

        setNome(usuario.nome ?? "");
        setEmail(usuario.email ?? "");
        setEmailV(usuario.email ?? "");
        setTelefone(usuario.telefone ?? "");
        setTelefoneV(usuario.telefone ?? "");
        setGenero(usuario.genero ?? "");

      } catch (erro) {
        console.log(erro);
      }
    };

    buscarDados();
  }, []);

  // ================================
  // VALIDAÇÕES
  // ================================
  const validarEditPerfil = () => {
    if (email && email !== emailV && !regexEmail.test(email)) {
      setErroMessage("Digite um email válido.");
      return false;
    }

    if (telefone && telefone !== telefoneV && !regexTelefone.test(telefone)) {
      setErroMessage("Digite um telefone válido.");
      return false;
    }

    setErroMessage("");
    return true;
  };

  // ================================
  // ENVIAR ALTERAÇÕES PARA O BACK-END
  // ================================
  const alterarDados = async () => {
    if (!validarEditPerfil()) return;

    setCarregando(true);

    const tokenUser = await AsyncStorage.getItem("userToken");

    try {
      const response = await UrlService.put(
        "usuario/update",
        { nome, email, telefone, genero },
        { headers: { authorization: `Bearer ${tokenUser}` } }
      );

      const mensagem = response.data.mensagem;
      navigation.navigate("Menu", { mensagem });

    } catch (erro) {
      console.log(erro);
      setErroMessage("Erro ao atualizar dados.");
    }

    setCarregando(false);
  };

  // ======================================================================================
  // UI
  // ======================================================================================

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>

      <View style={styles.container}>

        {/* FUNDO DIVIDIDO */}
        <View style={styles.containerFundo}>
          <View
            style={[
              styles.metadeFundo,
              { backgroundColor: isDarkMode ? theme.cimaDark : theme.primary }
            ]}
          />
          <View
            style={[
              styles.metadeFundo,
              { backgroundColor: isDarkMode ? theme.baixoDark : "#9db7c6ff" }
            ]}
          />
        </View>

        {/* CARD */}
        <View style={[styles.card, { backgroundColor: theme.background }]}>

          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <FontAwesome name="arrow-left" size={22} color={theme.title} />
          </Pressable>

          <Text style={[styles.title, { color: theme.title }]}>Edite Perfil</Text>

          <View style={styles.logoContainer}>
            <Image
              source={
                isDarkMode
                  ? require("../../../../assets/logobrancaof.png")
                  : require("../../../../assets/mondSecLogo.png")
              }
              style={styles.logo}
            />
          </View>

          {/* NOME */}
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Nome</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.input,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            placeholder="Digite o novo nome..."
            placeholderTextColor={theme.textSecondary}
            value={nome}
            onChangeText={setNome}
          />

          {/* EMAIL */}
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Email</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.input,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            placeholder="Digite o novo email..."
            placeholderTextColor={theme.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* TELEFONE */}
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Telefone</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.input,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            placeholder="Digite o novo telefone..."
            placeholderTextColor={theme.textSecondary}
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="numeric"
          />

          {/* GÊNERO */}
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Gênero</Text>

          <View style={styles.radioGroupContainer}>
            {opcoesGenero.map((op) => (
              <Pressable key={op} style={styles.opcao} onPress={() => setGenero(op)}>
                <View style={styles.radioContainer}>
                  <View style={[styles.radio, { borderColor: theme.primary }]}>
                    {genero === op && (
                      <View
                        style={[
                          styles.radioSelecionado,
                          { backgroundColor: theme.primary }
                        ]}
                      />
                    )}
                  </View>
                  <Text style={{ fontSize: 11, color: theme.text }}>{op}</Text>
                </View>
              </Pressable>
            ))}
          </View>

          {erroMessage !== "" && (
            <Text style={{ color: "red", marginBottom: 10, textAlign: "center" }}>
              {erroMessage}
            </Text>
          )}

          {/* BOTÃO */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.buttonColor }]}
            onPress={alterarDados}
            disabled={carregando}
          >
            <Text style={styles.buttonText}>
              {carregando ? "Salvando..." : "Alterar Dados"}
            </Text>
          </TouchableOpacity>

        </View>
      </View>



    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },

  containerFundo: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  metadeFundo: { height: "50%" },

  card: {
    marginLeft: 40,
    marginRight: 40,
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    height: 580,
    width: "85%",
  },

  backButton: { position: "absolute", top: 15, left: 15 },

  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 5,
  },

  logoContainer: { alignItems: "center", marginBottom: 5 },

  logo: { width: 100, height: 100, resizeMode: "contain" },

  sectionTitle: { fontSize: 12, fontWeight: "600", marginBottom: 5 },

  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 15,
  },

  radioGroupContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  radio: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderRadius: 10,
    marginRight: 4,
    justifyContent: "center",
  },

  radioSelecionado: {
    width: 9,
    height: 9,
    borderRadius: 5,
    alignSelf: "center",
  },

  opcao: {
    marginHorizontal: 7,
  },

  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: '10%',  
  },

  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 15 },

  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#003366',
    paddingVertical: 6,
  },

  navButtonText: { color: '#FFFFFF', fontSize: 12, marginTop: 4 },

  navButton: { alignItems: "center" },

  centralButton: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 50,
    elevation: 5,
  },
});

export default DigiteDadosScreen;
