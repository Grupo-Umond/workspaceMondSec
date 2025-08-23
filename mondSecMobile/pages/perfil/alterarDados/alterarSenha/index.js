import React, {useState} from 'react';
import {Pressable, View, TextInput, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome'; 
const AlterarSenhaScreen = ({navigation}) => {
    const[novaSenha, setNovaSenha] = useState('');
    const[novaSenhaConfirma, setNovaSenhaConfirma] = useState('');
    const[carregando, setCarregando] = useState(false);
    const[erroMessage, setErroMessage] = useState('');


    const validarSenhaNova = () => {
        if(!novaSenha || !novaSenhaConfirma) {
            setErroMessage('Digite os campos obrigatorios');
            return false;
        }

        if(novaSenha !== novaSenhaConfirma) {
            setErroMessage('As senhas não são iguais')
            return false;
        }

        if(novaSenha.length < 6 || novaSenhaConfirma.length < 6) {
            setErroMessage('Digite uma senha com 6 ou mais caracteres');
            return false;
        }

        return true;
    }

    const alterarSenha = async () => {
        if(!validarSenhaNova()){return};

        setCarregando(true);

        const tokenTemp = await AsyncStorage.getItem('tokenTemp');
        console.log('token temporario:',tokenTemp);
        
        const tokenUser = await AsyncStorage.getItem('userToken');
        try{
            const response = await axios.put('http://127.0.0.1:8000/api/usuario/alterar', 
            {
                tokenTemp,
                novaSenhaConfirma,
            },{
                headers: {
                    Authorization: `Bearer ${tokenUser}`
                },
            });

            await AsyncStorage.removeItem('tokenTemp');
            navigation.navigate('Menu');

        }catch(err){
            console.log(err);
        }finally{
            setCarregando(false);
        }
    };


    return (
        <View style={styles.container}>
            {/* Fundo dividido */}
            <View style={styles.containerFundo}>
                <View style={[styles.metadeFundo, styles.metadeSuperior]} />
                <View style={[styles.metadeFundo, styles.metadeInferior]} />
            </View>

            {/* Card central */}
            <View style={styles.card}>
                {/* Botão voltar */}
                <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                    {/* AQUI ESTÁ A MUDANÇA */}
                    <Icon name="arrow-left" size={32} color="#12577B" />
                </Pressable>

                {/* Título */}
                <Text style={styles.title}>Defina sua nova senha</Text>

                {/* Logo / ícone */}
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../../../assets/mondSecLogo.png')}
                        style={styles.logo}
                    />
                </View>

                {/* Subtítulo */}
                <Text style={styles.subtitle}>
                    Sua nova senha deve ter pelo menos 6 caracteres, incluindo letras e números.
                </Text>

                {/* Inputs */}
                <Text style={styles.sectionTitle}>Nova Senha</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite sua nova senha..."
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={novaSenha}
                    onChangeText={setNovaSenha}
                />

                <Text style={styles.sectionTitle}>Confirmar nova senha</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite a confirmação..."
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={novaSenhaConfirma}
                    onChangeText={setNovaSenhaConfirma}
                />

                {erroMessage ? <Text style={styles.error}>{erroMessage}</Text> : null}

                {/* Botão */}
                <TouchableOpacity 
                    style={styles.button}
                    onPress={alterarSenha}
                    disabled={carregando}
                >
                    <Text style={styles.buttonText}>Alterar Senha</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center'
    },
    containerFundo: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 0,
    },
    metadeFundo: {
        height: '50%',
    },
    metadeSuperior: {
        backgroundColor: '#12577B',
    },
    metadeInferior: {
        backgroundColor: '#a9cfe5',
        borderRadius: 10, 
    },
    card: {
        backgroundColor: '#f7f7f7',
        marginLeft: 30,
        marginRight: 30,
        borderRadius: 20,
        padding: 20,
        elevation: 5,
        height: 500, 
    },
    backButton: {
        position: 'absolute',
        top: 15,
        left: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: '600', // Changed to string, more compatible with RN
        textAlign: 'center',
        marginLeft: 15,
        marginBottom: 5,
        color: '#000',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 5,
    },
    logo: {
        width: 140,
        height: 140,
        resizeMode: 'contain',
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        color: '#052637ff',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600', // Changed to string
        color: '#000',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
    },
    button: {
        backgroundColor: '#12577B',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
    error: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default AlterarSenhaScreen;
