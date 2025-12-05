import React, { useState, useEffect, useRef, useContext } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UrlService from "../../services/UrlService";
import { useTheme } from "../../services/themes/themecontext";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AuthContext } from "../../services/AuthContext";

const FotoPerfilScreen = ({ navigation, route }) => {
  // PEGAR OS DADOS DO CADASTRO ENVIADOS DA TELA ANTERIOR
  const { nome, email, telefone, senha, genero } = route.params || {};

  const [foto, setFoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erroMessage, setErroMessage] = useState("");
  const mensagem = route.params?.mensagem;
  const { theme } = useTheme();
  const { logar } = useContext(AuthContext);

  const currentImageRef = useRef(null);
  const imageVersionRef = useRef(1);

  // BUSCAR FOTO DO USUÁRIO
useEffect(() => {
  // Em tela de cadastro, não há usuário logado ainda
  // Então apenas carregamos o estado inicial
  setLoading(false);
}, []);

  // UPLOAD DE FOTO
  const enviarFoto = async (uri, tokenParam = null) => {
  try {
    setLoading(true);

    const token = tokenParam || await AsyncStorage.getItem("userToken");
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

    const uploadResponse = await UrlService.post("/usuario/uploadFoto", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (uploadResponse.data.success && uploadResponse.data.foto) {
      let fotoUrl = uploadResponse.data.foto;
      // Garante que seja URL completa
      if (!fotoUrl.startsWith('http')) {
        fotoUrl = `http://${fotoUrl}`;
      }
      const timestamp = Date.now();
      const fotoAtualizada = `${fotoUrl}?v=${timestamp}`;
      setFoto(fotoAtualizada);
      console.log("Upload OK:", uploadResponse.data);
      
      return fotoAtualizada; // Retorna a URL da foto
    }
  } catch (error) {
    console.error("Erro no upload:", error);
    setErroMessage("Erro ao enviar foto.");
  } finally {
    setLoading(false);
  }
};


  // SELECIONAR FOTO DA GALERIA
  const selecionarFoto = async () => {
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
    enviarFoto(uri); // aqui envia para a API
  }
};

// FINALIZAR CADASTRO - VERSÃO ATUALIZADA
const finalizarCadastro = async () => {
  try {
    setLoading(true);

    // 1️⃣ LOGIN
    console.log("Fazendo login com:", { email, senha });
    const loginResponse = await UrlService.post("/usuario/login", {
      login: email,
      senha: senha
    });

    const token = loginResponse.data.tokenUser;
    console.log("Token recebido:", token);

    if (!token) {
      Alert.alert("Erro", "Não foi possível obter o token.");
      return;
    }

    // Salva token no AsyncStorage
    await AsyncStorage.setItem("userToken", token);

    // 2️⃣ ENVIO DE FOTO (se houver foto local)
    if (foto && foto.startsWith('file://')) {
      console.log("Enviando foto após login...");
      await enviarFoto(foto, token);
      
      // Pequeno delay para garantir processamento
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // 3️⃣ BUSCAR DADOS ATUALIZADOS (com foto)
    const userResponse = await UrlService.get("/usuario/buscar", {
      headers: { Authorization: `Bearer ${token}` }
    });

    let fotoAtualizada = userResponse.data.usuario?.foto || null;
    
    // Formatar URL corretamente
    if (fotoAtualizada && fotoAtualizada.startsWith('/storage')) {
      fotoAtualizada = `http://10.245.156.10:8000${fotoAtualizada}`;
    }

    // 4️⃣ LOGIN NO CONTEXT
    await logar(token);

    // 5️⃣ NAVEGAÇÃO COM TIMESTAMP
    const timestamp = Date.now();
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "Menu",
          params: { 
            mensagem: "Cadastro concluído com sucesso!",
            fotoRecente: fotoAtualizada ? `${fotoAtualizada}?v=${timestamp}` : null,
            forceReload: true  // Flag para forçar recarregamento
          }
        }
      ]
    });

  } catch (err) {
    console.log("Erro inesperado no cadastro:", err.response?.data || err.message);
    
    // TRATAMENTO DO ERRO 422 (validação Laravel)
    if (err.response && err.response.status === 422) {
      const erros = err.response.data.errors || err.response.data;
      let msg = "Erro de validação:\n";

      for (const campo in erros) {
        const campoErros = Array.isArray(erros[campo]) ? erros[campo] : [erros[campo]];
        msg += `- ${campoErros.join(", ")}\n`;
      }

      Alert.alert("Erro no cadastro", msg);
    } else if (err.response && err.response.data?.mensagem) {
      // Mensagem de erro do backend
      Alert.alert("Erro", err.response.data.mensagem);
    } else if (err.response && err.response.status === 401) {
      // Credenciais inválidas
      Alert.alert("Erro", "Email ou senha incorretos.");
    } else if (err.message === "Network Error") {
      Alert.alert("Erro", "Verifique sua conexão com a internet.");
    } else {
      Alert.alert("Erro", "Não foi possível concluir o cadastro.");
    }
  } finally {
    setLoading(false);
  }
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

      <View style={[styles.dicasContainer, { backgroundColor: theme.buttonColor }]}>
        <FontAwesome name="lightbulb-o" size={18} color={theme.icon} style={styles.dicaIcone} />
        <Text style={[styles.dicaTexto, { color: theme.icon }]}>
          Para melhor qualidade, use uma foto quadrada com boa iluminação
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", paddingHorizontal: 24, paddingTop: 200, paddingBottom: 30 },
  header: { alignItems: "center", marginBottom: 40 },
  titulo: { fontSize: 24, fontWeight: "700", marginBottom: 8, textAlign: "center", lineHeight: 32 },
  subtitulo: { fontSize: 15, textAlign: "center", opacity: 0.8 },
  photoSection: { alignItems: "center", marginBottom: 30 },
  circle: { width: 150, height: 150, borderRadius: 90, borderWidth: 1, justifyContent: "center", alignItems: "center", marginBottom: 16, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5 },
  loadingCircle: { borderColor: 'transparent' },
  foto: { width: "100%", height: "100%", resizeMode: "cover" },
  placeholderContainer: { alignItems: "center", justifyContent: "center" },
  placeholderTexto: { marginTop: 12, fontSize: 15, fontWeight: "500" },
  botaoRemover: { flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, gap: 6 },
  textoRemover: { fontSize: 14, fontWeight: "500" },
  actionsContainer: { width: '100%', maxWidth: 400, gap: 12, marginBottom: 30 },
  botao: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 16, paddingHorizontal: 24, borderRadius: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  botaoDesabilitado: { opacity: 0.6 },
  botaoIcone: { marginRight: 10 },
  botaoTexto: { color: "white", fontSize: 16, fontWeight: "600" },
  botaoFinalizar: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 16, paddingHorizontal: 24, borderRadius: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  textoFinalizar: { color: "white", fontSize: 16, fontWeight: "600" },
  dicasContainer: { flexDirection: "row", alignItems: "center", paddingHorizontal: 18, paddingVertical: 14, borderRadius: 12, width: '100%', maxWidth: 400, marginTop: 'auto' },
  dicaIcone: { marginRight: 12 },
  dicaTexto: { fontSize: 13, flex: 1, lineHeight: 18 },
});

export default FotoPerfilScreen;
