import React, {
  useContext,
  useEffect,
  useState,
  useMemo,
  useRef,
} from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import UrlService from "../../../services/UrlService";
import { AuthContext } from "../../../services/AuthContext";
import { useTheme } from "../../../services/themes/themecontext";

const MenuScreen = ({ navigation, route }) => {
  const { logout } = useContext(AuthContext);
  const mensagem = route.params?.mensagem;

  const { theme, isDarkMode } = useTheme();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erroMessage, setErroMessage] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [modalDelete, setModalDelete] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  
  const currentImageRef = useRef(null);
  const imageVersionRef = useRef(0);

  // 🔧 Função para carregar dados do usuário
  const carregarDadosUsuario = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.log("Token não encontrado");
        return;
      }

      // Buscar dados do usuário
      const response = await UrlService.get("/usuario/buscar", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const usuario = response.data.usuario;
      setNome(usuario.nome || "");
      setEmail(usuario.email || "");

      // Tratar foto do backend
      if (usuario.foto) {
        let fotoUrl = usuario.foto;
        console.log("Foto do backend:", fotoUrl);
        
        // Converter caminho relativo para URL completa
        if (fotoUrl.startsWith('/storage')) {
          fotoUrl = `http://10.245.156.10:8000${fotoUrl}`;
        } else if (!fotoUrl.startsWith('http')) {
          fotoUrl = `http://10.245.156.10:8000/storage/${fotoUrl}`;
        }
        
        // Adicionar timestamp ÚNICO e FORTE
        const timestamp = Date.now() + Math.random();
        const fotoComCacheBuster = `${fotoUrl}?v=${timestamp}`;
        
        console.log("URL final com cache buster:", fotoComCacheBuster);
        setImageUri(fotoComCacheBuster);
        currentImageRef.current = fotoComCacheBuster;
      } else {
        // Se não tem foto no backend, limpa
        setImageUri(null);
        currentImageRef.current = null;
      }

    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setErroMessage("Erro ao carregar dados.");
    }
  };

  // 🔧 Carregar dados ao montar componente
  useEffect(() => {
    carregarDadosUsuario();
  }, []);

  // 🔧 Recarregar dados quando a tela receber foco
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log("Tela de perfil em foco - recarregando dados...");
      carregarDadosUsuario();
    });

    return unsubscribe;
  }, [navigation]);

  // 🔧 Atualizar foto se vier do cadastro
  useEffect(() => {
    if (route.params?.fotoRecente) {
      let fotoUrl = route.params.fotoRecente;
      
      // Se for uma URI local (file://), já é a foto temporária
      if (fotoUrl.startsWith('file://')) {
        const timestamp = Date.now();
        const novaFoto = `${fotoUrl}?v=${timestamp}`;
        setImageUri(novaFoto);
        currentImageRef.current = novaFoto;
      } 
      // Se for uma URL do servidor, formatar corretamente
      else if (fotoUrl.startsWith('http')) {
        const timestamp = Date.now() + Math.random();
        const novaFoto = `${fotoUrl}?v=${timestamp}`;
        setImageUri(novaFoto);
        currentImageRef.current = novaFoto;
      }
      
      // Limpar o parâmetro após usar
      navigation.setParams({ fotoRecente: undefined });
    }
  }, [route.params?.fotoRecente]);

  // 🔧 Função para recarregar apenas a foto
  const recarregarFoto = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await UrlService.get("/usuario/buscar", {
        headers: { Authorization: `Bearer ${token}` },
        params: { _t: Date.now() } // Evitar cache
      });

      const usuario = response.data.usuario;
      if (usuario.foto) {
        let fotoUrl = usuario.foto;
        
        // Converter caminho
        if (fotoUrl.startsWith('/storage')) {
          fotoUrl = `http://10.245.156.10:8000${fotoUrl}`;
        }
        
        // Cache buster ÚNICO
        const uniqueTimestamp = Date.now() + Math.random();
        const novaFoto = `${fotoUrl}?_t=${uniqueTimestamp}`;
        
        setImageUri(novaFoto);
        currentImageRef.current = novaFoto;
        console.log("✅ Foto recarregada do servidor:", novaFoto);
      }
    } catch (error) {
      console.error('Erro ao recarregar foto:', error);
    }
  };

  // 🔧 Upload de foto
  const enviarFoto = async (uri) => {
    try {
      setImageLoading(true);
      setErroMessage("");
      
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setErroMessage("Sessão expirada. Faça login novamente.");
        return;
      }

      const formData = new FormData();
      formData.append("foto", {
        uri: uri,
        type: "image/jpeg",
        name: "foto.jpg",
      });

      // Mostrar feedback instantâneo
      const timestamp = Date.now();
      const tempUri = `${uri}?temp=${timestamp}`;
      setImageUri(tempUri);

      // Envia para API
      const uploadResponse = await UrlService.post("/usuario/uploadFoto", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log('Resposta do upload:', uploadResponse.data);

      if (uploadResponse.data.success) {
        console.log('✅ Upload realizado com sucesso');
        
        // Pequeno delay para garantir que a imagem foi salva no servidor
        setTimeout(async () => {
          await recarregarFoto();
        }, 500);
      } else {
        throw new Error(uploadResponse.data.mensagem || "Erro no upload");
      }

    } catch (error) {
      console.error('❌ Erro no upload:', error);
      
      // Reverter para imagem anterior em caso de erro
      Alert.alert(
        "Erro ao enviar foto",
        error.message || "Não foi possível atualizar sua foto. Tente novamente."
      );
      
      // Recarregar a foto original do servidor
      await recarregarFoto();
    } finally {
      setImageLoading(false);
    }
  };

  // 🔧 Selecionar foto da galeria
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso às suas fotos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        const selectedImageUri = result.assets[0].uri;
        
        // Envia para o servidor
        await enviarFoto(selectedImageUri);
      }
    } catch (error) {
      console.log("Erro ao escolher imagem:", error);
      Alert.alert("Erro", "Não foi possível selecionar a imagem.");
    }
  };

  // 🔧 OptionButton
  const OptionButton = useMemo(
    () =>
      ({ iconName, text, onPress, isDanger = false, targetScreen }) => {
        const handlePress = () => {
          if (onPress) return onPress();
          if (targetScreen) navigation.navigate(targetScreen);
        };

        return (
          <Pressable
            onPress={handlePress}
            style={({ pressed }) => [
              styles.botaoOpcao,
              {
                backgroundColor: isDanger
                  ? theme.danger + "22"
                  : theme.background,
                borderWidth: 1,
                borderColor: isDanger ? theme.danger : theme.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <View style={styles.botaoContent}>
              <FontAwesome
                name={iconName}
                size={20}
                color={isDanger ? theme.danger : theme.primary}
                style={styles.iconeOpcao}
              />
              <Text
                style={[
                  styles.textoOpcao,
                  { color: isDanger ? theme.danger : theme.text },
                ]}
              >
                {text}
              </Text>
            </View>
          </Pressable>
        );
      },
    [theme]
  );

  const sairConta = async () => logout();

  const excluirConta = async () => {
    if (senha.length < 8) {
      setErroMessage("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    try {
      await UrlService.put("/usuario/deletar", { senha });
      logout();
    } catch (error) {
      setErroMessage("Erro ao excluir conta.");
    }
  };

  return (
    <SafeAreaView
      edges={["top"]}
      style={{ flex: 1, backgroundColor: theme.background }}
    >
      <View style={{ flex: 1 }}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{
            paddingBottom: 80,
            backgroundColor: theme.background,
          }}
        >
          <View style={styles.cabecalho}>
            <Text style={[styles.tituloCabecalho, { color: theme.text }]}>
              Seu Perfil
            </Text>
          </View>

          {mensagem ? (
            <Text style={[styles.mensagemFeedback, { color: theme.primary }]}>
              {mensagem}
            </Text>
          ) : null}

          {erroMessage ? (
            <Text style={[styles.mensagemError, { color: theme.danger }]}>
              {erroMessage}
            </Text>
          ) : null}

          <View
            style={[
              styles.perfilContainer,
              { borderBottomColor: theme.border },
            ]}
          >
            <View style={styles.avatarContainer}>
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  style={[
                    styles.avatar,
                    { borderColor: isDarkMode ? "#FFFFFF" : "#000" },
                  ]}
                  resizeMode="cover"
                  onError={(e) => {
                    console.log("❌ Erro ao carregar imagem:", imageUri, e.nativeEvent.error);
                    // Tentar recarregar sem cache
                    if (imageUri.includes('?')) {
                      const baseUrl = imageUri.split('?')[0];
                      setImageUri(`${baseUrl}?v=${Date.now()}`);
                    }
                  }}
                />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <FontAwesome name="user-circle" size={50} color={theme.textSecondary} />
                </View>
              )}
              
              {imageLoading && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color={theme.primary} />
                </View>
              )}
            </View>

            <Pressable
              onPress={pickImage}
              style={[
                styles.botaoEditarFoto,
                { backgroundColor: theme.border + "55" },
              ]}
              disabled={imageLoading}
            >
              <Text style={{ color: theme.primary, fontWeight: "600" }}>
                <FontAwesome name="camera" size={14} /> 
                {imageLoading ? " Enviando..." : " Editar Foto"}
              </Text>
            </Pressable>

            <Text style={[styles.nomePerfil, { color: theme.text }]}>{nome}</Text>
            <Text style={[styles.emailPerfil, { color: theme.textSecondary }]}>
              {email}
            </Text>
          </View>

          <View style={styles.opcoesContainer}>
            <OptionButton iconName="bookmark" text="Minhas Ocorrências" targetScreen="Ocorrencia" />
            <OptionButton iconName="pencil" text="Editar Perfil" targetScreen="DigiteDados" />
            <OptionButton iconName="shield" text="Termos e Política" targetScreen="Politica" />
            <OptionButton iconName="lock" text="Redefinir Senha" targetScreen="DigiteCodigo" />
            <OptionButton iconName="cog" text="Configurações" targetScreen="Configuracao" />

            <View style={[styles.separador, { backgroundColor: theme.border + "55" }]} />

            <OptionButton iconName="sign-out" text="Sair da Conta" onPress={sairConta} isDanger />
            <OptionButton iconName="trash" text="Excluir Conta" onPress={() => setModalDelete(true)} isDanger />
          </View>
        </ScrollView>

        {/* Navigation */}
        <SafeAreaView
          edges={["bottom"]}
          style={[
            styles.navigationContainer,
            { backgroundColor: isDarkMode ? "#01080A" : "#003366" },
          ]}
        >
          <Pressable
            style={({ pressed }) => [
              styles.navButton,
              { opacity: pressed ? 0.6 : 1 },
            ]}
            onPress={() => navigation.navigate("Home")}
          >
            <Icon name="home" size={26} color="#fff" />
            <Text style={styles.navButtonText}>Início</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.navButton,
              { opacity: pressed ? 0.6 : 1 },
            ]}
            onPress={() => navigation.navigate("Home")}
          >
            <Icon name="person" size={28} color="#fff" />
            <Text style={styles.navButtonText}>Perfil</Text>
          </Pressable>
        </SafeAreaView>

        <Modal animationType="fade" transparent visible={modalDelete}>
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: theme.background },
              ]}
            >
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Digite sua senha para confirmar
              </Text>

              <TextInput
                style={[
                  styles.modalInput,
                  { borderColor: theme.border, color: theme.text },
                ]}
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
                placeholder="Senha"
                placeholderTextColor={theme.textSecondary}
              />

              {erroMessage ? (
                <Text style={[styles.modalError, { color: theme.danger }]}>
                  {erroMessage}
                </Text>
              ) : null}

              <Pressable
                style={[
                  styles.modalButtonConfirm,
                  { backgroundColor: theme.danger },
                ]}
                onPress={excluirConta}
              >
                <Text style={styles.modalButtonText}>Excluir</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.modalButtonCancel,
                  { backgroundColor: theme.border },
                ]}
                onPress={() => {
                  setSenha("");
                  setErroMessage("");
                  setModalDelete(false);
                }}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    { color: isDarkMode ? "#FFFFFF" : "#251414" },
                  ]}
                >
                  Voltar
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  tituloCabecalho: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    flex: 1,
  },
  mensagemFeedback: {
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "600",
  },
  mensagemError: {
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "600",
    color: '#ff4444',
  },
  perfilContainer: {
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoEditarFoto: {
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
  },
  nomePerfil: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 5,
  },
  emailPerfil: {
    fontSize: 14,
  },
  opcoesContainer: {
    paddingHorizontal: 5,
  },
  botaoOpcao: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 18,
    borderRadius: 50,
    marginBottom: 10,
  },
  botaoContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconeOpcao: {
    marginRight: 15,
  },
  textoOpcao: {
    fontSize: 13,
    fontWeight: "500",
  },
  separador: {
    height: 1,
    marginVertical: 15,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 60,
  },
  navButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  navButtonText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    borderRadius: 15,
    padding: 25,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  modalError: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
  modalButtonConfirm: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalButtonCancel: {
    padding: 12,
    borderRadius: 8,
  },
  modalButtonText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff",
  },
});

export default MenuScreen;