import React, {useEffect, useState} from 'react';
import {View, Text, Pressable, Image, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from 'axios';

const MenuScreen = ({navigation}) => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [erroMessage, setErroMessage] = useState('');
    const [porOnde, setPorOnde] = useState('');

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

    const sairConta = async () => {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('lembraMim');
        navigation.navigate('Login');
    }
    return(
        <View>
            <View>
                <Pressable onPress={() => navigation.navigate('Home')}>
                    <FontAwesome name="home" size={30} color="blue" />
                </Pressable>
                <Text>
                    Seu Perfil
                </Text>
                <Pressable onPress={() => navigation.navigate('Configuracao')}>
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
                <Pressable onPress={() => {setPorOnde('email'); navigation.navigate('DigiteDados', porOnde);}}>
                    <Text>
                        Alterar Email
                    </Text>
                </Pressable>
                <Pressable onPress={() => {setPorOnde('senha'); navigation.navigate('DigiteDados', porOnde);}}>
                    <Text>
                        Alterar Senha
                    </Text>
                </Pressable>
                <Pressable>
                    <Text>
                        Termos e Privacidade
                    </Text>
                </Pressable>
                <Pressable onPress={() => sairConta()}>
                    <Text>
                        Sair da Conta
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};
export default MenuScreen;