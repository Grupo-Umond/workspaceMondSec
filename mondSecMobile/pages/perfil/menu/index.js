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
  
  // Usar useRef para controlar a imagem atual
  const currentImageRef = useRef(null);
  const imageVersionRef = useRef(0);

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
                : theme.border + "33",
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

  useEffect(() => {
    async function puxarInfos() {
      try {
        const token = await AsyncStorage.getItem("userToken");

        const response = await UrlService.get("/usuario/buscar", {
          headers: { Authorization: `Bearer ${token}` },
        });


        const usuario = response.data.usuario;

        setNome(usuario.nome);
        setEmail(usuario.email);

        if (usuario.foto && typeof usuario.foto === "string") {
          // URL absoluta com timestamp FORTE
          let fotoUrl = usuario.foto;
          if (!fotoUrl.startsWith('http')) {
            fotoUrl = `http://${fotoUrl}`;
          }
          
          // Timestamp único e forte
          const timestamp = Date.now() + Math.random();
          const fotoUrlWithTimestamp = `${fotoUrl}?v=${timestamp}`;
          
          console.log('🔄 Definindo imagem inicial:', fotoUrlWithTimestamp);
          currentImageRef.current = fotoUrlWithTimestamp;
          setImageUri(fotoUrlWithTimestamp);
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setErroMessage("Erro ao carregar dados.");
      }
    }

    puxarInfos();
  }, []);

  // 🔧 Upload de foto - VERSÃO DIRETA
  const enviarFoto = async (uri) => {
    try {
      setImageLoading(true);
      
      const token = await AsyncStorage.getItem("userToken");

      const formData = new FormData();
      formData.append("foto", {
        uri: uri,
        type: "image/jpeg",
        name: "foto.jpg",
      });

      const uploadResponse = await UrlService.post("/usuario/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (uploadResponse.data.success && uploadResponse.data.foto) {
        const fotoUrl = uploadResponse.data.foto;
        
        // Timestamp ÚNICO e FORTE
        imageVersionRef.current += 1;
        const timestamp = Date.now() + imageVersionRef.current;
        const fotoUrlWithTimestamp = `${fotoUrl}?v=${timestamp}`;
        
        console.log('✅ Foto atualizada com timestamp forte:', fotoUrlWithTimestamp);
        
        // Atualizar referência e estado
        currentImageRef.current = fotoUrlWithTimestamp;
        setImageUri(fotoUrlWithTimestamp);
      }
    } catch (error) {
      console.error('❌ Erro no upload:', error);
      setErroMessage("Erro ao enviar foto.");
      
      // Em caso de erro, voltar para a imagem local
      const timestamp = Date.now();
      const localUriWithTimestamp = `${uri}?v=${timestamp}`;
      setImageUri(localUriWithTimestamp);
    } finally {
      setImageLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setErroMessage('Permissão para acessar a galeria é necessária');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        const uri = result.assets[0].uri;
        
        // Mostrar imagem local imediatamente com timestamp
        const timestamp = Date.now();
        const localUriWithTimestamp = `${uri}?v=${timestamp}`;
        console.log('📱 Mostrando imagem local:', localUriWithTimestamp);
        setImageUri(localUriWithTimestamp);
        
        // Fazer upload em segundo plano
        await enviarFoto(uri);
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      setErroMessage("Erro ao selecionar imagem.");
    }
  };

  // 🔧 Função SIMPLES para obter source da imagem
  const getImageSource = () => {
    if (imageUri) {
      return { uri: imageUri };
    }
    return { uri: "https://placehold.co/100x100/CCCCCC/666666?text=FP" };
  };

  // 🔧 Forçar recarregamento da imagem
  const forceReloadImage = () => {
    if (imageUri) {
      const baseUrl = imageUri.split('?')[0];
      const timestamp = Date.now() + Math.random();
      const newUri = `${baseUrl}?force=${timestamp}`;
      console.log('🔄 Forçando recarregamento:', newUri);
      setImageUri(newUri);
    }
  };

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
              <Pressable onPress={forceReloadImage}>
                <Image
                  style={[
                    styles.avatar,
                    { borderColor: isDarkMode ? "#FFFFFF" : "#000" },
                  ]}
                  source={getImageSource()}
                  onError={(e) => {
                    console.log('❌ Erro no carregamento da imagem');
                    console.log('URI atual:', imageUri);
                    // Tentar recarregar após 1 segundo
                    setTimeout(forceReloadImage, 1000);
                  }}
                  onLoad={() => {
                    console.log('✅ Imagem carregada com sucesso:', imageUri);
                  }}
                  onLoadEnd={() => {
                    console.log('🏁 Carregamento finalizado:', imageUri);
                  }}
                  resizeMode="cover"
                  key={imageUri} // 🔑 KEY CRÍTICA - força novo componente
                />
              </Pressable>
              
              {imageLoading && (
                <View style={styles.loadingOverlay}>
                  <Text style={{ color: '#fff', fontSize: 12 }}>Enviando...</Text>
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
            onPress={() => navigation.navigate("Menu")}
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
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
    marginBottom: 10,
    borderWidth: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
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
