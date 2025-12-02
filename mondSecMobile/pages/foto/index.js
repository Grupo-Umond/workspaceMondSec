import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UrlService from "../../services/UrlService";
import { useTheme } from "../../services/themes/themecontext";
import FontAwesome from '@expo/vector-icons/FontAwesome';

const FotoPerfilScreen = ({ navigation, route }) => {
  const [foto, setFoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erroMessage, setErroMessage] = useState("");
  const mensagem = route.params?.mensagem;
   const { theme, isDarkMode } = useTheme();
  

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
  <View style={[styles.container, { backgroundColor: theme.fotobackground }]}>
    <View style={styles.header}>
      <Text style={[styles.titulo, { color: theme.title }]}>
       Por favor, selecione uma foto de boa qualidade
      </Text>
      <Text style={[styles.subtitulo, { color: theme.textSecondary }]}>
        Escolha uma foto que te represente
      </Text>
    </View>

    <View style={styles.photoSection}>
      {loading ? (
        <View style={[styles.circle, styles.loadingCircle]}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <View style={[
          styles.circle, 
          { borderColor: theme.primary, backgroundColor: theme.inputBackground }
        ]}>
          {foto ? (
            <Image source={{ uri: foto }} style={styles.foto} />
          ) : (
            <View style={styles.placeholderContainer}>
              <FontAwesome name="user-circle" size={60} color={theme.textSecondary} />
              <Text style={[styles.placeholderTexto, { color: theme.textSecondary }]}>
                Sem foto
              </Text>
            </View>
          )}
        </View>
      )}

      {foto && (
        <TouchableOpacity 
          style={[styles.botaoRemover, { backgroundColor: theme.border }]}
          onPress={() => setFoto(null)}
        >
          <FontAwesome name="trash" size={16} color={theme.text} />
          <Text style={[styles.textoRemover, { color: theme.text }]}>Remover foto</Text>
        </TouchableOpacity>
      )}
    </View>

    <View style={styles.actionsContainer}>
      <TouchableOpacity 
        style={[
          styles.botao, 
          { backgroundColor: theme.buttonColor },
          loading && styles.botaoDesabilitado
        ]} 
        onPress={selecionarFoto}
        disabled={loading}
      >
        <FontAwesome name="camera" size={20} color="#FFF" style={styles.botaoIcone} />
        <Text style={styles.botaoTexto}>Escolher Foto</Text>
      </TouchableOpacity>

      {/* BOTÃO FINALIZAR CADASTRO — só aparece quando há foto */}
      {foto && (
        <TouchableOpacity 
          style={[
            styles.botaoFinalizar, 
            { backgroundColor: theme.success || '#28A745' }
          ]} 
          onPress={finalizarCadastro}
        >
          <FontAwesome name="check-circle" size={20} color="#FFF" style={styles.botaoIcone} />
          <Text style={styles.textoFinalizar}>Finalizar Cadastro</Text>
        </TouchableOpacity>
      )}
    </View>

    {/* Dicas */}
    <View style={[styles.dicasContainer, { backgroundColor: theme.buttonColor }]}>
      <FontAwesome name="lightbulb-o" size={18} color={theme.icon} style={styles.dicaIcone} />
      <Text style={[styles.dicaTexto, { color: theme.icon}]}>
        Para melhor qualidade, use uma foto quadrada com boa iluminação
      </Text>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 200,
    paddingBottom: 30,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
    lineHeight: 32,
  },
  subtitulo: {
    fontSize: 15,
    textAlign: "center",
    opacity: 0.8,
  },
  photoSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 90,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  loadingCircle: {
    borderColor: 'transparent',
  },
  foto: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderTexto: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: "500",
  },
  botaoRemover: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
  },
  textoRemover: {
    fontSize: 14,
    fontWeight: "500",
  },
  erroContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 24,
    gap: 10,
    width: '100%',
    maxWidth: 400,
  },
  erroMessage: {
    fontSize: 14,
    color: "#D32F2F",
    flex: 1,
  },
  actionsContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 12,
    marginBottom: 30,
  },
  botao: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  botaoIcone: {
    marginRight: 10,
  },
  botaoTexto: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  botaoFinalizar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textoFinalizar: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  dicasContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    marginTop: 'auto',
  },
  dicaIcone: {
    marginRight: 12,
  },
  dicaTexto: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
});

export default FotoPerfilScreen;
