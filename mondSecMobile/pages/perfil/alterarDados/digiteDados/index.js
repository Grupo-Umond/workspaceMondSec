import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";
import UrlService from '../../../../services/UrlService';


const DigiteDadosScreen = ({ navigation }) => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [emailV, setEmailV] = useState("");
  const [telefone, setTelefone] = useState("");
  const [telefoneV, setTelefoneV] = useState("");
  const [genero, setGenero] = useState("");

  const opcoesGenero = ["Masculino", "Feminino", "Prefiro não informar"];

  const [carregando, setCarregando] = useState(false);
  const [erroMessage, setErroMessage] = useState("");

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const regexTelefone =
    /^(\+55\s?)?(\(?[1-9]{2}\)?\s?)?(9\d{4}|\d{4})-?\d{4}$/;

  useEffect(() => {
    const buscarDados = async () => {
      const tokenUser = await AsyncStorage.getItem("userToken");
      try {
        const response = await UrlService.get("/usuario/buscar",
          {
            headers: {
              authorization: `Bearer ${tokenUser}`,
            },
          }
        );

        const usuario = response.data.usuario;
        console.log(usuario);
        setNome(usuario.nome ?? "");
        setEmailV(usuario.email ?? "");
        setEmail(usuario.email ?? "");
        setTelefoneV(usuario.telefone ?? "");
        setTelefone(usuario.telefone ?? "");
        setGenero(usuario.genero ?? "");
      } catch (erro) {
        console.log(erro);
      }
    };
    buscarDados();
  }, []);

  const validarEditPerfil = () => {
    if (email) {
      if (emailV !== email) {
        if (!regexEmail.test(email)) {
          setErroMessage("Digite um email valido");
          return false;
        }
      }
      if (telefoneV !== telefone) {
        if (!regexTelefone.test(telefone)) {
          setErroMessage("Digite um telefone valido");
          return false;
        }
      }
    }
    return true;
  };

  const alterarDados = async () => {
    if (!validarEditPerfil()) return;

    const tokenUser = await AsyncStorage.getItem("userToken");

    const response = await UrlService.put("usuario/update",
      {
        nome,
        email,
        telefone,
        genero,
      },
      {
        headers: {
          authorization: `Bearer ${tokenUser}`,
        },
      }
    );
    const mensagem = response.data.mensagem;
    navigation.navigate("Menu", {mensagem});
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerFundo}>
        <View style={[styles.metadeFundo, styles.metadeSuperior]} />
        <View style={[styles.metadeFundo, styles.metadeInferior]} />
      </View>

      <View style={styles.card}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#12577B" />
        </Pressable>

        <Text style={styles.title}>Edite Perfil</Text>

        <View style={styles.logoContainer}>
          <Image
            source={require("../../../../assets/mondSecLogo.png")}
            style={styles.logo}
          />
        </View>

        <Text style={styles.sectionTitle}>Nome</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o novo nome..."
          placeholderTextColor="#999"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.sectionTitle}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o novo email..."
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.sectionTitle}>Telefone</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o novo telefone..."
          placeholderTextColor="#999"
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="numeric"
          autoCapitalize="none"
        />

        <Text style={styles.sectionTitle}>Gênero</Text>
        <View style={styles.radioGroupContainer}>
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
        </View>

        {erroMessage ? <Text style={styles.error}>{erroMessage}</Text> : null}

        <TouchableOpacity
          style={styles.button}
          onPress={alterarDados}
          disabled={carregando}
        >
          <Text style={styles.buttonText}>Alterar Dados</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  containerFundo: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 0,
  },
  metadeFundo: {
    height: "50%",
  },
  metadeSuperior: {
    backgroundColor: "#12577B",
  },
  metadeInferior: {
    backgroundColor: "#a9cfe5",
    borderRadius: 10,
  },
  card: {
    backgroundColor: "#f7f7f7",
    marginLeft: 40,
    marginRight: 40,
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    height: 530,
    width: "85%",
  },
  backButton: {
    position: "absolute",
    top: 15,
    left: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginLeft: 15,
    marginBottom: 5,
    color: "#000",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 5,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#000",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  opcao: {
    marginHorizontal: 7,
  },
  button: {
    backgroundColor: "#12577B",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
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
    width: 15,
    height: 15,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    marginRight: 4,
    marginLeft: -5,
    marginTop: 3,
    justifyContent: "center",
  },
  radioSelecionado: {
    width: 9,
    height: 9,
    backgroundColor: "#000",
    borderRadius: 5,
    alignSelf: "center",
  },
  texto: {
    fontSize: 11,
  },
});

export default DigiteDadosScreen;
