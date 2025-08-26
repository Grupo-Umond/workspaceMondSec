import React, {useEffect, useState} from 'react';
import {View, Text, Pressable, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from 'axios';

const MenuScreen = ({navigation, setUserToken}) => {
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

                const response = await axios.get('http://127.0.0.1:8000/api/usuario/buscar', {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log(response);

                setNome(response.data.usuario.nome);
                setEmail(response.data.usuario.email);
        
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
        await AsyncStorage.removeItem('Localizacao');
        await AsyncStorage.removeItem('viewModal');
        await AsyncStorage.removeItem('userToken');
        setUserToken(null);
        
    }
    return(
        <View style={styles.container}>
            <View style={styles.cabecalho}>
                <Pressable onPress={() => navigation.navigate('Home')} style={styles.iconeCabecalho}>
                    <FontAwesome name="arrow-left" size={24} color="#12577B" />
                </Pressable>
                <Text style={styles.tituloCabecalho}>Seu Perfil</Text>
                <Pressable onPress={() => navigation.navigate('Configuracao')} style={styles.iconeCabecalho}>
                    <FontAwesome name="cog" size={24} color="#12577B" />
                </Pressable>
            </View>

            <View style={styles.perfilContainer}>
                <Image style={styles.avatar} source={require('../../../assets/avatar-placeholder.png')} />
                <Text style={styles.nomePerfil}>{nome}</Text>
                <Text style={styles.emailPerfil}>{email}</Text>
            </View>

            <View style={styles.opcoesContainer}>
                <Text style={styles.tituloSecao}>O que você pode fazer por aqui</Text>
                
                <Pressable 
                    style={styles.botaoOpcao} 
                    onPress={() => navigation.navigate('Ocorrencia')}
                >
                    <Text style={styles.textoOpcao}>Minhas Ocorrências</Text>
                    <FontAwesome name="chevron-right" size={16} color="#999" />
                </Pressable>
                
                <Pressable 
                    style={styles.botaoOpcao}
                    onPress={() => navigation.navigate('DigiteDados')}
                >
                    <Text style={styles.textoOpcao}>Editar Perfil</Text>
                    <FontAwesome name="chevron-right" size={16} color="#999" />
                </Pressable>
                
                <Pressable style={styles.botaoOpcao}>
                    <Text style={styles.textoOpcao}>Termos e Privacidade</Text>
                    <FontAwesome name="chevron-right" size={16} color="#999" />
                </Pressable>
                
                <Pressable 
                    style={styles.botaoOpcao}
                    onPress={() => navigation.navigate('DigiteCodigo')}
                >
                    <Text style={styles.textoOpcao}>Redefinir Senha</Text>
                    <FontAwesome name="chevron-right" size={16} color="#999" />
                </Pressable>
                
                <Pressable 
                    style={[styles.botaoOpcao, styles.botaoSair]} 
                    onPress={sairConta}
                >
                    <Text style={[styles.textoOpcao, styles.textoSair]}>Sair da Conta</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  tituloCabecalho: {
    fontSize: 20,
    fontWeight: '600',
    color: '#12577B',
  },
  iconeCabecalho: {
    padding: 5,
  },
  perfilContainer: {
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0E0E0',
    marginBottom: 15,
  },
  nomePerfil: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 5,
  },
  emailPerfil: {
    fontSize: 14,
    color: '#666',
  },
  opcoesContainer: {
    paddingHorizontal: 10,
  },
  tituloSecao: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    fontWeight: '500',
  },
  botaoOpcao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  textoOpcao: {
    fontSize: 16,
    color: '#000',
  },
  botaoSair: {
    marginTop: 20,
    borderBottomWidth: 0,
  },
  textoSair: {
    color: '#E74C3C',
  },
});

export default MenuScreen;