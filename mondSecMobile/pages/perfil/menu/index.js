import React, {useEffect, useState} from 'react';
import {View, Text, Pressable, Image, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from 'axios';

<<<<<<< HEAD
=======
const MenuScreen = ({navigation}) => {

    
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <FontAwesome name="user" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Seu Perfil</Text>
                <TouchableOpacity>
                    <FontAwesome name="user" size={24} color="#000" />
                </TouchableOpacity>
            </View>
>>>>>>> c01043568131a18646d5d421cccb15b2bd7d3a14


const MenuScreen = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [erroMessage, setErroMessage] = useState('');


    useEffect(() => {
        async function puxarInfos() {
            try {
                const token = await AsyncStorage.getItem('userToken');

                if(!token) {
                    console.log("Token não recebido");
                }

                const response = await axios.get('http://127.0.0.1:8000/api/buscar', {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log(response);

                setNome(response.data.usuario.nomeUsuario);
                setEmail(response.data.usuario.emailUsuario);
        
            }catch(err) {
                if(err.response?.status === 401) {

                setErroMessage("Acesso negado", "Credenciais incorretas");

                console.log(err);
                } else {
                setErroMessage("Falha na conexão com servidor.");
                console.log("parara:", err);
                }
            }
        };
        puxarInfos();

    }, []);


    return(
        <View>
            <View>
                <Pressable onPress={() => navigation.navigate('Home')}>
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
                <Pressable onPress={() => navigation.navigate('Ocorrencia')}>
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