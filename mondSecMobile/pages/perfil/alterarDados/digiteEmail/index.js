import React, {useState} from "react";
import {View, Text, TextInput, Pressable} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DigiteEmailScreen = ({navigation}) => {
        const [ email , setEmail] = useState(null);

        const verificarExistenciaDoEmail = async () => {
                const response = await axios.get('http://127.0.0.1:8000/api/', email);
                if(response.data.mensagem === 'grated'){
                        await AsyncStorage.setItem('entrada','saida');
                        navigation.navigate('DigiteCodigo');
                } else {
                        setErroMessage('Erro! Email não encontrado');
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
                                <Pressable onPress={() => verificarExistenciaDoEmail()}>
                                        <Text>Enviar</Text>
                                </Pressable>
                        </View>
                </View>
        );
};
export default DigiteEmailScreen;