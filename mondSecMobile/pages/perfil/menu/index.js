import React, {useEffect, useState} from 'react';
import {View, Text, Pressable, Image, Alert} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from 'axios';



const MenuScreen = ({navigation}) => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [erroMessage, setErroMessage] = useState('');


    useEffect(() => {
        async function puxarInfos() {
            try {
                const token = await SecureStore.getItemAsync('userToken');
                const {data} = await axios.post('http://127.0.0.1:8000/api/buscar', {}, {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                    },
                }
                );
                
                setNome(data.nomeUsuario);
                setEmail(data.emailUsuario);
        
            }catch(err) {
                if(err.response?.status === 401) {
                setErroMessage("Email ou senha incorretos.");
                Alert.alert(erroMessage);
                } else {
                setErroMessage("Falha na conexão com servidor.");
                Alert.alert(erroMessage);
                }
            }
        };
        puxarInfos();

    }, []);


    return(
        <View>
            <View>
                <Pressable>
                    <FontAwesome name="home" size={30} color="blue" />
                </Pressable>
                <Text>
                    Seu Perfil
                </Text>
                <Pressable>
                     <FontAwesome name="home" size={30} color="blue" />
                </Pressable>
            </View>
            <View>
                <Image />
                <Text>
                    {nome}
                </Text>
                <Text>
                    {email}
                </Text>
                <Pressable>
                    <Text>
                        Minhas Ocorrências
                    </Text>
                </Pressable>
                <Pressable>
                    <Text>
                        Alterar Senha
                    </Text>
                </Pressable>
                <Pressable>
                    <Text>
                        Termos e Privacidade
                    </Text>
                </Pressable>
                <Pressable>
                    <Text>
                        Sair da Conta
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};
export default MenuScreen;