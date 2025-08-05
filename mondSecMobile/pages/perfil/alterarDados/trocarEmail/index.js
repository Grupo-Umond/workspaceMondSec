import React, {useState} from "react";
import {View, Text, TextInput, Pressable, Button, StyleSheet} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';



const TrocarEmailScreen = ({navigation}) => {
    const[carregando, setCarregando] = useState(false);
    const[novoEmail, setNovoEmail] = useState('');
    const[novoEmailConfirma, setNovoEmailConfirma] = useState('');
    const[erroMessage, setErroMessage] = useState('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    const validarDados = () => {
        if(!novoEmail || !novoEmailConfirma) {
            setErroMessage('Digite todos os campos obrigatorios');
            return false;
        }

        if(novoEmail !== novoEmailConfirma) {
            setErroMessage('Os emails são diferentes');
            return false;
        }  

        if(!emailRegex.test(novoEmail) || !emailRegex.test(novoEmailConfirma)) {
            setErroMessage('Email em formato invalido');
            return false;
        }

        return true;
    }

    const alterarEmail = async () => {
        if(!validarDados()){return;};

        setCarregando(true);
        
        const tokenUser = await AsyncStorage.getItem('userToken');
        const tokenTemp = await AsyncStorage.getItem('tokenTemp');
        try{
            const response = await axios.post('http://127.0.0.1:8000/api/updateEmail', 
                {
                    novoEmailConfirma,
                    tokenTemp,
                },{
                    headers: {
                        Authorization: `Bearer ${tokenUser}`
                    }
                },
            );
            await AsyncStorage.removeItem('tokenTemp');
            navigation.navigate('Menu');
        }catch(err){
            console.log('Erro:',err);
        }finally{
            setCarregando(false);
        }


    }

    return(
        <View style={styles.container}>
            <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backText}>← Voltar</Text>
            </Pressable>
        
            <View style={styles.form}>
                <Text style={styles.label}>Digite seu novo email</Text>
                <TextInput
                    style={styles.input}
                    value={novoEmail}
                    onChangeText={setNovoEmail}
                />
                <Text style={styles.label}>Confirme o seu novo email</Text>
                <TextInput
                    style={styles.input}
                    value={novoEmailConfirma}
                    onChangeText={setNovoEmailConfirma}
                />
                {erroMessage ? <Text style={styles.error}>{erroMessage}</Text> : null}
                <Button 
                    title={carregando ? 'Enviando...' : 'Enviar'}
                    onPress={() => alterarEmail()}
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
export default TrocarEmailScreen;