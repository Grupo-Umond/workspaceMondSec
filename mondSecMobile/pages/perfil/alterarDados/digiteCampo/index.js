import React, {useState} from "react";
import {View, Text, TextInput, Pressable} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const DigiteCampoScreen = ({navigation}) => {
        const [ login , setLogin ] = useState('');
        const [ usuario, setUsuario] = useState([]);
        const [erroMessage, setErroMessage] = useState('');
        const telefoneRegex = /^(?:\s?)?(?:\(?\d{2}\)?\s?)?(?:9?\d{4}-?\d{4})$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const determinarCampo = () => {
                if(telefoneRegex.test(login)){
                        const campo = 'telefone';
                        return campo;
                }
                if(emailRegex.test(login)){
                        const campo = 'email';
                        return campo;
                }
        }
        const verificarExistenciaDoCampo = async () => {
                const campo = determinarCampo();
                const response = await axios.post('http://127.0.0.1:8000/api/usuario/checkcampo', {
                        login,
                        campo
                });
                const usuario = {
                        'email': response.data.usuario.email,
                        'telefone': response.data.usuario.telefone,
                };
                console.log(usuario);
                if (response.data.mensagem === 'granted'){
                        await AsyncStorage.setItem('entrada','saida');
                        navigation.navigate('DigiteCodigo', {usuario});
                
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
                                <TextInput onChangeText={setLogin} value={login} keyboardType="email"/>
                                {erroMessage ? (<Text>{erroMessage}</Text>) : (null)}
                                <Pressable onPress={() => verificarExistenciaDoCampo()}>
                                        <Text>Enviar</Text>
                                </Pressable>
                        </View>
                </View>
        );
};
export default DigiteCampoScreen;





                                             