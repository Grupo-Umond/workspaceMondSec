import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, {useState} from "react";
import {TextInput, View, Text, Pressable} from 'react-native';

const DigiteDadoScreen = ({navigation}) => {
    const[email, setEmail] = useState('');
    const[erroMessage, setErroMessage] = useState('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    
    const validarDados = () => {
        if(!email) {
            setErroMessage('Digite o campo obrigatorio.');
            return;
        }
    
    }

    const validarEnvio = async () => {
        validarDados();
        const token = await AsyncStorage.getItem('userToken');

        try{
            const response = await axios.post('http://127.0.0.1:8000', 
                {
                    headers: {
                        Authorization: `Bearer: ${token}`
                    },

                    email,
                }, 
            );
        }catch(err){
            console.log(err);
        }

        
        navigation.navigate('DigiteCodigo');
    }
    return(
        <View>
            <View>
                <Text>Back</Text>
            </View>
            <View>
                <Text>Digite seu email:</Text>
                <TextInput />

                {erroMessage ? (<Text style={{ color: 'red', marginBottom: 10 }}>{erroMessage}</Text>) : null}

                <Pressable onPress={() => validarEnvio()}>
                    <Text>Enviar</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default DigiteDadoScreen;