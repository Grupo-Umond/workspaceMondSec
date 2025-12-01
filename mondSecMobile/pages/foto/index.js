import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UrlService from "../../services/UrlService";

const FotoPerfilScreen = ({ navigation, route }) => {
  const [foto, setFoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erroMessage, setErroMessage] = useState("");
  const mensagem = route.params?.mensagem;

  const currentImageRef = useRef(null);
  const imageVersionRef = useRef(1);

  // BUSCAR FOTO DO USUÁRIO
  useEffect(() => {
    async function puxarInfos() {
      try {
        const token = await AsyncStorage.getItem("userToken");

        if (!token) {
          setErroMessage("Token não encontrado.");
          setLoading(false);
          return;
        }

        const response = await UrlService.get("/usuario/buscar");

        const usuario = response.data.usuario;

        if (usuario?.foto) {
          let fotoUrl = usuario.foto;
          if (!fotoUrl.startsWith("http")) {
            fotoUrl = `http://${fotoUrl}`;
          }

          const timestamp = Date.now() + Math.random();
          const finalUrl = `${fotoUrl}?v=${timestamp}`;

          currentImageRef.current = finalUrl;
          setFoto(finalUrl);
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setErroMessage("Erro ao carregar dados.");
      } finally {
        setLoading(false);
      }
    }

    puxarInfos();
  }, []);

  // UPLOAD DE FOTO
  const enviarFoto = async (uri) => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setErroMessage("Token não encontrado.");
        return;
      }

      const formData = new FormData();
      formData.append("foto", {
        uri,
        type: "image/jpeg",
        name: "foto.jpg",
      });

      const uploadResponse = await UrlService.post("/usuario/upload", formData);

      if (uploadResponse.data.success && uploadResponse.data.foto) {
        let fotoUrl = uploadResponse.data.foto;
        imageVersionRef.current += 1;

        const timestamp = Date.now() + imageVersionRef.current;
        const finalUrl = `${fotoUrl}?v=${timestamp}`;

        currentImageRef.current = finalUrl;
        setFoto(finalUrl);
      }
    } catch (error) {
      console.error("Erro no upload:", error);
      setErroMessage("Erro ao enviar foto.");

      const timestamp = Date.now();
      setFoto(`${uri}?v=${timestamp}`);
    } finally {
      setLoading(false);
    }
  };

  // SELECIONAR FOTO GALERIA
  const selecionarFoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        setErroMessage("Você precisa permitir o acesso às fotos!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
        aspect: [1, 1],
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setFoto(uri);
        enviarFoto(uri);
      }
    } catch (err) {
      console.error(err);
      setErroMessage("Erro ao selecionar foto.");
    }
  };

  // FINALIZAR CADASTRO
  const finalizarCadastro = () => {
    navigation.navigate("Login", { mensagem });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Coloque uma foto bem bonita sua 😁</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#3B59F3" style={{ marginBottom: 30 }} />
      ) : (
        <View style={styles.circle}>
          {foto ? (
            <Image source={{ uri: foto }} style={styles.foto} />
          ) : (
            <Text style={styles.placeholderTexto}>Sem foto</Text>
          )}
        </View>
      )}

      {erroMessage ? <Text style={{ color: "red", marginBottom: 15 }}>{erroMessage}</Text> : null}

      <TouchableOpacity style={styles.botao} onPress={selecionarFoto}>
        <Text style={styles.botaoTexto}>Adicionar Foto</Text>
      </TouchableOpacity>

      {/* BOTÃO FINALIZAR CADASTRO — só aparece quando há foto */}
      {foto && (
        <TouchableOpacity style={styles.botaoFinalizar} onPress={finalizarCadastro}>
          <Text style={styles.textoFinalizar}>Finalizar Cadastro</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0F24",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    color: "white",
    marginBottom: 30,
    textAlign: "center",
    fontWeight: "600",
  },
  circle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#1A2238",
    borderWidth: 3,
    borderColor: "#3B59F3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    overflow: "hidden",
  },
  foto: {
    width: "100%",
    height: "100%",
  },
  placeholderTexto: {
    color: "#8A93B0",
  },
  botao: {
    backgroundColor: "#3B59F3",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginBottom: 15,
  },
  botaoTexto: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },

  botaoFinalizar: {
    backgroundColor: "#28A745",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 10,
  },
  textoFinalizar: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default FotoPerfilScreen;
