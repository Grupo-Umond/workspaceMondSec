import React from 'react';
import {View, Text, Pressable, Image, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const SobreScreen = ({navigation}) => {
    return (
        <View style={styles.container}>
            <View style={styles.cabecalho}>
                <Pressable onPress={() => navigation.navigate('Home')} style={styles.iconeCabecalho}>
                    <FontAwesome name="arrow-left" size={24} color="#fff" />
                </Pressable>
                <Text style={styles.tituloCabecalho}>Sobre o App</Text>
                <Pressable onPress={() => navigation.navigate('Configuracao')} style={styles.iconeCabecalho}>
                    <FontAwesome name="cog" size={24} color="#fff" />
                </Pressable>
            </View>

            <View style={styles.conteudo}>
                {/* Logo da empresa */}
                <View style={styles.logoContainer}>
                    <Image 
                        source={require('../../assets/umondlogobranco.png')} 
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.texto}> 
                    <Text style={styles.title}>Sobre o MondSec</Text>  
                    <Text style={styles.paragrafo}>
                        Nosso aplicativo tem como objetivo proporcionar segurança aos Usuários durante 
                        seus deslocamentos. Através dele, qualquer pessoa pode registrar Ocorrências em 
                        tempo real, como assaltos, furtos, violência ou situações de risco, diretamente 
                        no mapa do aplicativo.
                    </Text>  

                    <Text style={styles.title}>Como Funciona</Text> 
                    <Text style={styles.paragrafo}>
                        Ao abrir o app, o Usuario tem sua localização identificada e pode cadastrar uma 
                        Ocorrência, selecionando sua categoria e descrevendo o ocorrido. Esta informação 
                        é apresentada em um mapa, visivel a todos os usuarios.
                    </Text>  
                </View> 
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#12577B',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    cabecalho: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    tituloCabecalho: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
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
        backgroundColor: '#12577b', 
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    texto: {
        width: '100%', 
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#F7F7F7',
        marginBottom: 12, 
        textAlign: 'left',
        letterSpacing: 0.2,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    paragrafo: {
        fontSize: 14,
        lineHeight: 18,
        color: '#FFFFFF',
        marginBottom: 32,
        textAlign: 'left',
        fontWeight: '400',
        opacity: 0.95,
        letterSpacing: 0.2,
    },
});

export default SobreScreen;