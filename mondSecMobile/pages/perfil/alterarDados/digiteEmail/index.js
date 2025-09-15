import React, {useState} from "react";
import {View, Text, TextInput, Pressable} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const DigiteEmailScreen = ({navigation}) => {
        const [ email , setEmail] = useState('');
        const [erroMessage, setErroMessage] = useState('');

        const verificarExistenciaDoEmail = async () => {
                console.log(email);
                const response = await axios.post('http://127.0.0.1:8000/api/usuario/checkemail', {email});
                if (response.data.mensagem === 'granted'){
                        await AsyncStorage.setItem('entrada','saida');
                        navigation.navigate('DigiteCodigo');
                
                } else if(response.data.mensagem === 'denied'){
                        setErroMessage('Erro! Email não encontrado');
                        return false;
                } else {
                        setErroMessage('Erro! Tente novamente mais tarde');
                        return false;
                }
        }
        return(
                <View>
                        <View>
                                <Pressable onPress={() => navigation.goBack()}>
                                        <Text>Sair</Text>
                                </Pressable>
                                <Text>Alterar Senha</Text>
                        </View>

                        <View>
                                <TextInput onChangeText={setEmail} value={email} keyboardType="email"/>
                                {erroMessage ? (<Text>{erroMessage}</Text>) : (null)}
                                <Pressable onPress={() => verificarExistenciaDoEmail()}>
                                        <Text>Enviar</Text>
                                </Pressable>
                        </View>
                </View>
        );
};
export default DigiteEmailScreen;





                                             