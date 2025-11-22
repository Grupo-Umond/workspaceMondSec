import React from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from "../../services/themes/themecontext"; // THEME AQUI

const SobreScreen = ({ navigation }) => {
    const { theme, isDarkMode } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode? theme.background : "#10405eff"}]}>
            <View style={styles.cabecalho}>
                <Pressable onPress={() => navigation.navigate('Home')} style={styles.iconeCabecalho}>
                    <FontAwesome name="arrow-left" size={20} color={theme.icon} />
                </Pressable>
                <Text style={[styles.tituloCabecalho, { color: theme.icon }]}>
                    Sobre o App
                </Text>
            </View>

            <View style={styles.conteudo}>
                {/* Logo da empresa */}
                <View style={styles.logoContainer}>
                    <Image
                        source={
                            isDarkMode
                                ? require('../../assets/umondlogobranco.png')    // LOGO PARA MODO ESCURO
                                : require('../../assets/umondlogobranco.png')          // LOGO PARA MODO CLARO
                        }
                        style={[styles.logo, { backgroundColor: theme.card }]}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.texto}>
                    <Text style={[styles.title, { color: theme.icon }]}>
                        Sobre o MondSec
                    </Text>
                    <Text style={[styles.paragrafo, { color: theme.icon}]}>
                        Nosso aplicativo tem como objetivo proporcionar segurança aos Usuários durante 
                        seus deslocamentos. Através dele, qualquer pessoa pode registrar Ocorrências em 
                        tempo real, como assaltos, furtos, violência ou situações de risco, diretamente 
                        no mapa do aplicativo.
                    </Text>

                    <Text style={[styles.title, { color: theme.icon }]}>
                        Como Funciona
                    </Text>
                    <Text style={[styles.paragrafo, { color: theme.icon }]}>
                        Ao abrir o app, o Usuario tem sua localização identificada e pode cadastrar uma 
                        Ocorrência, selecionando sua categoria e descrevendo o ocorrido. Esta informação 
                        é apresentada em um mapa, visível a todos os usuários.
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    cabecalho: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'relative',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    tituloCabecalho: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '600',
        position: 'absolute',
        left: 0,
        right: 0,
    },
    iconeCabecalho: {
        padding: 5,
    },
    conteudo: {
        flex: 1,
        paddingHorizontal: 5,
        paddingVertical: 10,
        alignItems: 'center',
    },
    logoContainer: {
        marginBottom: 30,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    logo: {
        width: 150,
        height: 150,
        borderRadius: 75,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    texto: {
        width: '100%',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 12,
        textAlign: 'left',
        letterSpacing: 0.2,
    },
    paragrafo: {
        fontSize: 14,
        lineHeight: 18,
        marginBottom: 32,
        textAlign: 'left',
        fontWeight: '400',
        opacity: 0.95,
        letterSpacing: 0.2,
    },
});

export default SobreScreen;
