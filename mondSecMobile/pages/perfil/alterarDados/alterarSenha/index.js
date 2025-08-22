import React, {useState} from 'react';
import {Pressable, View, TextInput, Text, Button, StyleSheet} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
            <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backText}>← Voltar</Text>
            </Pressable>

            <View style={styles.form}>
                <Text style={styles.label}>Digite sua nova senha</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry
                    value={novaSenha}
                    onChangeText={setNovaSenha}
                />

                <Text style={styles.label}>Confirme a sua nova senha</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry
                    value={novaSenhaConfirma}
                    onChangeText={setNovaSenhaConfirma}
                />

                {erroMessage ? <Text style={styles.error}>{erroMessage}</Text> : null}

                <Button 
                    title={carregando ? 'Enviando...' : 'Enviar'}
                    onPress={() => alterarSenha()}
                    disabled={carregando}
                />
                
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    backButton: {
        marginBottom: 20,
    },
    backText: {
        color: '#007AFF',
        fontSize: 16,
    },
    form: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
});

export default AlterarSenhaScreen;