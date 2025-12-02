import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import UrlService from '../../../../services/UrlService';
import { useTheme } from '../../../../services/themes/themecontext';

const DigiteCampoScreen = ({ navigation }) => {
    const { theme, isDarkMode } = useTheme();

    const [login, setLogin] = useState('');
    const [erroMessage, setErroMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const telefoneRegex = /^(?:\(?\d{2}\)?\s?)?(?:9\d{4}|\d{4})-?\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const determinarCampo = () => {
        if (telefoneRegex.test(login)) return 'telefone';
        if (emailRegex.test(login)) return 'email';
        return null;
    };

    const verificarExistenciaDoCampo = async () => {
        const campo = determinarCampo();
        if (!campo) {
            setErroMessage('Digite um e-mail ou telefone válido');
            return;
        }

        try {
            setLoading(true);
            setErroMessage('');

            let valorLogin = login.trim();

            if (campo === 'telefone') {
                valorLogin = valorLogin.replace(/\D/g, '');
                if (!valorLogin.startsWith('55')) {
                    valorLogin = '+55' + valorLogin;
                } else {
                    valorLogin = '+' + valorLogin;
                }
            }

            const response = await UrlService.post('/usuario/checkcampo', {
                login: valorLogin,
                campo
            });

            const usuario = response.data.usuario;

            if (response.data.mensagem === 'granted') {
                await AsyncStorage.setItem('entrada', 'saida');
                navigation.navigate('DigiteCodigo', { usuario, campo });
            } else if (response.data.mensagem === 'denied') {
                setErroMessage('Erro! E-mail ou telefone não encontrado');
            } else {
                setErroMessage('Erro! Tente novamente mais tarde');
            }
        } catch (error) {
            console.error(error);
            setErroMessage('Erro de conexão. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>

            {/* NAV */}
            <View style={styles.nav}>
                <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={[styles.backArrow, { color: theme.title }]}>{"<"}</Text>
                </Pressable>

                <View style={styles.header}>
                    <Text style={[styles.headerTitle, { color: theme.title }]}>Alterar Senha</Text>
                </View>
            </View>

            {/* LOGO */}
            <View style={styles.avatarContainer}>
                <View style={styles.logoContainer}>
                    <Image
                        source={
                            isDarkMode
                                ? require('../../../../assets/logobrancaof.png')
                                : require('../../../../assets/mondSecLogo.png')
                        }
                        style={styles.logo}
                    />
                </View>
            </View>

            {/* TÍTULO */}
            <Text style={[styles.title, { color: theme.title}]}>
                Digite seu e-mail ou telefone
            </Text>

            {/* INPUT */}
            <View style={styles.inputContainer}>
                <TextInput
                    onChangeText={setLogin}
                    value={login}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="E-mail ou telefone"
                    placeholderTextColor={theme.textSecondary}
                    style={[
                        styles.input,
                        {
                            backgroundColor: theme.sectionbackground,
                            borderColor: erroMessage ? theme.danger : theme.border,
                            color: theme.text
                        }
                    ]}
                />

                {erroMessage ? (
                    <Text style={[styles.errorMessage, { color: theme.danger }]}>
                        {erroMessage}
                    </Text>
                ) : null}

                {/* BOTÃO */}
                <Pressable
                    onPress={verificarExistenciaDoCampo}
                    style={[
                        styles.confirmButton,
                        {
                            backgroundColor: theme.buttonColor,
                            opacity: loading ? 0.7 : 1
                        }
                    ]}
                    disabled={loading}
                >
                    <Text style={[styles.confirmButtonText, { color: "#fff" }]}>
                        {loading ? 'Verificando...' : 'Enviar'}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: "center"
    },
    nav: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 10
    },
    backButton: {
        marginRight: 90,
        marginBottom: 10
    },
    backArrow: {
        fontSize: 70
    },
    header: {
        flexDirection: "row",
        alignItems: "center"
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "600",
        marginLeft: -50
    },
    avatarContainer: {
        alignItems: "center",
        marginBottom: 10
    },
    logoContainer: {
        alignItems: 'center'
    },
    logo: {
        width: 200,
        height: 200,
        resizeMode: 'contain'
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 20
    },
    inputContainer: {
        width: '100%',
        alignItems: 'center'
    },
    input: {
        width: '100%',
        height: 55,
        fontSize: 16,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderRadius: 8,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginBottom: 15
    },
    errorMessage: {
        marginBottom: 10,
        textAlign: "center"
    },
    confirmButton: {
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 8,
        alignItems: "center",
        width: '100%',
        marginTop: 10
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: "bold"
    },
});

export default DigiteCampoScreen;
