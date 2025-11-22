  import React, {
    useContext,
    useEffect,
    useState,
    useCallback,
  } from "react";
  import {
    View,
    Text,
    Pressable,
    Image,
    StyleSheet,
    Modal,
    TextInput,
    Alert,
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

    const { theme, isDarkMode } = useTheme(); // ← TEMA AQUI PABLO

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erroMessage, setErroMessage] = useState("");
    const [imageUri, setImageUri] = useState(null);
    const [modalDelete, setModalDelete] = useState(false);
      const [modalSobreVisible, setModalSobreVisible] = useState(false);


    // -----------------------------------------------------
    // BOTÕES DO MENU
    // -----------------------------------------------------
    const OptionButton = useCallback(
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

            <FontAwesome
              name="chevron-right"
              size={16}
              color={isDanger ? theme.danger : theme.primary}
            />
          </Pressable>
        );
      },
      [navigation, theme]
    );

    // PEGAR INFOS DO USUÁRIO

    useEffect(() => {
      async function puxarInfos() {
        try {
          const token = await AsyncStorage.getItem("userToken");

          const response = await UrlService.get("/usuario/buscar", {
            headers: { Authorization: `Bearer ${token}` },
          });

          setNome(response.data.usuario.nome);
          setEmail(response.data.usuario.email);
          setImageUri(response.data.usuario.foto);
        } catch (err) {
          setErroMessage("Erro ao carregar dados.");
        }
      }

      puxarInfos();
    }, [imageUri]);

    // -----------------------------------------------------
    // UPLOAD FOTO
    // -----------------------------------------------------
    const enviarFoto = async (uri) => {
      try {
        const token = await AsyncStorage.getItem("userToken");

        const blob = await (await fetch(uri)).blob();

        const formData = new FormData();
        formData.append("foto", {
          uri,
          name: "foto.jpg",
          type: blob.type || "image/jpeg",
        });

        const uploadResponse = await fetch(
          `${UrlService.defaults.baseURL}/usuario/upload`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );

        const data = await uploadResponse.json();
        if (data.foto) setImageUri(data.foto);
      } catch (error) {
        setErroMessage("Erro ao enviar foto.");
      }
    };

    const pickImage = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        await enviarFoto(uri);
      }
    };

    // -----------------------------------------------------
    // SAIR & EXCLUIR
    // -----------------------------------------------------
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
            
            {/* CABEÇALHO */}
        
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


            {/* PERFIL */}
        
            <View
              style={[
                styles.perfilContainer,
                { borderBottomColor: theme.border },
              ]}
            >
              <Image
                style={[
                  styles.avatar,
                  { borderColor: isDarkMode ? "#fff" : "#000" },
                ]}
                source={{
                  uri:
                    imageUri ||
                    "https://placehold.co/100x100/CCCCCC/666666?text=FP",
                }}
              />

              <Pressable
                onPress={pickImage}
                style={[
                  styles.botaoEditarFoto,
                  { backgroundColor: theme.border + "55" },
                ]}
              >
                <Text style={{ color: theme.primary, fontWeight: "600" }}>
                  <FontAwesome name="camera" size={14} /> Editar Foto
                </Text>
              </Pressable>

              <Text style={[styles.nomePerfil, { color: theme.text }]}>
                {nome}
              </Text>
              <Text style={[styles.emailPerfil, { color: theme.textSecondary }]}>
                {email}
              </Text>
            </View>

    
            {/* OPÇÕES */}
        
            <View style={styles.opcoesContainer}>
              <OptionButton
                iconName="bookmark"
                text="Minhas Ocorrências"
                targetScreen="Ocorrencia"
              />
              <OptionButton
                iconName="pencil"
                text="Editar Perfil"
                targetScreen="DigiteDados"
              />
              <OptionButton
                iconName="shield"
                text="Termos e Política"
                targetScreen="Politica"
              />
              <OptionButton
                iconName="lock"
                text="Redefinir Senha"
                targetScreen="DigiteCodigo"
              />
              <OptionButton
                iconName="cog"
                text="Configurações"
                targetScreen="Configuracao"
              />

              <View
                style={[
                  styles.separador,
                  { backgroundColor: theme.border + "55" },
                ]}
              />

              <OptionButton
                iconName="sign-out"
                text="Sair da Conta"
                onPress={sairConta}
                isDanger
              />

              <OptionButton
                iconName="trash"
                text="Excluir Conta"
                onPress={() => setModalDelete(true)}
                isDanger
              />
            </View>
          </ScrollView>

    
          {/* NAV BOTTOM */}
    
          <SafeAreaView
            edges={["bottom"]}
           style={[
  styles.navigationContainer,
  { 
    backgroundColor: isDarkMode ? "#01080aff" : "#003366" 
  },
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
              <Icon name="person" size={26} color="#fff" />
              <Text style={styles.navButtonText}>Perfil</Text>
            </Pressable>
          </SafeAreaView>

        
          {/* MODAL EXCLUIR CONTA */}
      
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
                    {
                      borderColor: theme.border,
                      color: theme.text,
                    },
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
                  onPress={() => setModalDelete(false)}
                >
                  <Text
                    style={[
                      styles.modalButtonText,
                      { color: isDarkMode ? "#ffffffff" : "#251414ff" },
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

    iconeCabecalho: {
      padding: 5,
    },

    mensagemFeedback: {
      textAlign: "center",
      marginBottom: 10,
      fontWeight: "600",
    },

    perfilContainer: {
      alignItems: "center",
      marginBottom: 20,
      paddingBottom: 20,
      borderBottomWidth: 1,
    },

    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: "#ccc",
      marginBottom: 10,
      borderWidth: 1,
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

    centralButton: {
      padding: 15,
      borderRadius: 50,
      elevation: 5,
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
