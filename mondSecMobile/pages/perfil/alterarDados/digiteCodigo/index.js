import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, TouchableOpacity, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const DigiteCodigoScreen = ({ navigation, route }) => {

        const [digitos, setDigitos] = useState(["", "", "", "", "", ""]);
        const code = digitos.join("");

        const [direcao, setDirecao] = useState(true);
        const [email, setEmail] = useState('');
        const [telefone, setTelefone] = useState('');

        const [carregando, setCarregando] = useState(false);
        const [erroMessage, setErroMessage] = useState('');

        const usuario = route.params?.usuario;
  
        const baseURL = "http://127.0.0.1:8000";

        useEffect(() => {
                const pegarLogin = () => {
                        if(direcao){
                                setEmail(usuario.email);
                                return usuario.email;
                        }else if(!direcao){
                                setTelefone(usuario.telefone);
                                return usuario.telefone;
                        }
                }


                const buscarDados = async () => {
                        const tokenUser = await AsyncStorage.getItem('userToken');
                        try {
                                if (tokenUser) {
                                        const response = await axios.get('http://127.0.0.1:8000/api/usuario/buscar', {
                                                headers: { Authorization: `Bearer ${tokenUser}` },
                                });
                                setEmail(response.data.usuario.email);
                                setTelefone(response.data.usuario.telefone);
                                } else if (usuario) {
                                        return pegarLogin();
                                }
                        } catch (erro) {
                                console.log("Erro ao buscar dados:", erro.response?.data || erro.message);
                        }
                };
              
                const criarCodigo = async () => {
                        const login = await buscarDados();
                        const tokenUser = await AsyncStorage.getItem('userToken');
                        try {
                                if (direcao) {
                                        if (tokenUser) {
                                                const response = await axios.post('http://127.0.0.1:8000/api/codigo/sendEmail', {}, {
                                                        headers: { Authorization: `Bearer ${tokenUser}` },
                                                });
                                        } else {
                                                const response = await axios.post('http://127.0.0.1:8000/api/codigo/sendEmail', { login });
                                        }
                                } else {
                                        if (tokenUser) {
                                                const response = await axios.post('http://127.0.0.1:8000/api/codigo/sendSms', {}, {
                                                        headers: { Authorization: `Bearer ${tokenUser}` },
                                                });
                                        } else {
                                                await axios.post('http://127.0.0.1:8000/api/codigo/sendSms', { telefone });
                                        }
                                }
                        } catch (erro) {
                                console.log("Erro ao criar código:", erro.response?.data || erro.message);
                        }
                      };

                buscarDados();
                criarCodigo();
        }, [direcao]);

        const handleChange = (text, index) => {
                const newDigitos = [...digitos];
                newDigitos[index] = text;
                setDigitos(newDigitos);
        };

        const validarCodigo = () => {
                setErroMessage('');
                if (!code) {
                        setErroMessage('Digite o código.');
                        return false;
                }
                if (!/^\d{6}$/.test(code)) {
                        setErroMessage('Digite o código com exatamente 6 números.');
                        return false;
                }
                return true;
        };

        const enviarCodigo = async () => {
                if (!validarCodigo()) return;
                setCarregando(true);
                const tokenUser = await AsyncStorage.getItem('userToken');
                try {
                        const login = await buscarDados();
                        const response = await axios.post(`${baseURL}/api/codigo/verify`,
                                { code, direcao, login },
                                tokenUser ? { headers: { Authorization: `Bearer ${tokenUser}` } } : {}
                        );
                        const tokenTemp = response.data.token;
                        if (!tokenTemp) {
                                setErroMessage('Permissão não recebida');
                                return;
                        }
                        await AsyncStorage.setItem('tokenTemp', tokenTemp);
                        navigation.navigate('AlterarSenha', { direcao });
                } catch (err) {
                        console.log("Erro ao enviar código:", err.response?.data || err.message);
                } finally {
                        setCarregando(false);
                }
        };

  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{"<"}</Text>
        </Pressable>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Verificação de Conta</Text>
        </View>
      </View>

      <View style={styles.avatarContainer}>
        <View style={styles.logoContainer}>
          <Image source={require('../../../../assets/mondSecLogo.png')} style={styles.logo} />
        </View>
      </View>

      <Text style={styles.title}>
        {direcao
          ? `Digite o código que enviamos para o email ${email}`
          : `Digite o código que enviamos para o número ${telefone}`}
      </Text>

      {direcao ? (
        <Pressable onPress={() => setDirecao(false)}>
          <Text style={styles.linkText}>
            Não tenho acesso a esse email. <Text style={styles.linkHighlight}>Enviar por SMS</Text>
          </Text>
        </Pressable>
      ) : (
        <Pressable onPress={() => setDirecao(true)}>
          <Text style={styles.linkText}>
            Não tenho acesso a esse telefone. <Text style={styles.linkHighlight}>Enviar por email</Text>
          </Text>
        </Pressable>
      )}

      <View style={styles.inputContainer}>
        {digitos.map((d, index) => (
          <TextInput
            key={index}
            style={styles.input}
            value={d}
            maxLength={1}
            keyboardType="numeric"
            onChangeText={(text) => handleChange(text, index)}
          />
        ))}
      </View>

      {erroMessage ? <Text style={styles.errorMessage}>{erroMessage}</Text> : null}

      <TouchableOpacity>
        <Text style={styles.resendLink}>Não recebeu o código? Reenviar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.confirmButton, carregando && styles.disabledButton]}
        onPress={enviarCodigo}
        disabled={carregando}
      >
        <Text style={styles.confirmButtonText}>
          {carregando ? "Enviando..." : "Confirmar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", alignItems: "center" },
  header: { flexDirection: "row", alignItems: "center" },
  backButton: { marginRight: 90, marginBottom: 10 },
  nav: { flexDirection: 'row' },
  backArrow: { fontSize: 70, color: "#12577B" },
  headerTitle: { fontSize: 22, fontWeight: "600", color: "#000", marginLeft: -50 },
  avatarContainer: { alignItems: "center", marginBottom: 10 },
  logoContainer: { alignItems: 'center' },
  logo: { width: 200, height: 200, resizeMode: 'contain' },
  inputContainer: { flexDirection: "row", justifyContent: "center", gap: 10, marginVertical: 20 },
  input: { width: 45, height: 55, fontSize: 20, textAlign: "center", borderWidth: 1, borderColor: "#ccc", borderRadius: 8, backgroundColor: "#fff", elevation: 2, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  errorMessage: { color: "red", marginBottom: 10, textAlign: "center" },
  resendLink: { color: "#007AFF", fontSize: 14, textAlign: "center", marginBottom: 20 },
  confirmButton: { backgroundColor: "#003366", paddingVertical: 12, paddingHorizontal: 40, borderRadius: 8, alignItems: "center" },
  confirmButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  disabledButton: { opacity: 0.5 },
  title: { fontSize: 18, fontWeight: "600", color: "#333", textAlign: "center", marginBottom: 20 },
  linkText: { fontSize: 14, color: "#555", textAlign: "center", marginTop: 10 },
  linkHighlight: { color: "#1E90FF", fontWeight: "bold" },
});

export default DigiteCodigoScreen;
