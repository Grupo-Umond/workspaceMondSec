import React, {useState, useEffect} from "react";
import {View, Text, TextInput, Pressable, Button, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const DigiteDadosScreen = ({navigation}) => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [genero, setGenero] = useState('');

    const opcoesGenero = ['Masculino', 'Feminino', 'Prefiro não informar'];

    const [carregando, setCarregando] = useState(false);
    const [erroMessage, setErroMessage] = useState('');

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexTelefone = /^(\+55\s?)?(\(?[1-9]{2}\)?\s?)?(9\d{4}|\d{4})-?\d{4}$/;
;



    useEffect(() => {
        buscarDados();
    },[])

    const validarDados = () => {

        if(!regexEmail.test(email)) {
            setErroMessage('Digite um email valido');
            return false;
        }

        if(!regexTelefone.test(telefone)) {
            setErroMessage('Digite um telefone valido');
            return false;
        }


        return true;
    }

    const buscarDados = async () => {
        const tokenUser = await AsyncStorage.getItem('userToken');
        try{
        const response = await axios.get('http://127.0.0.1:8000/api/usuario/buscar',{
            headers:{
                authorization: `Bearer ${tokenUser}`
            }
        });

        console.log(response);
        
        const usuario = response.data.usuario;
        console.log(usuario);
        setNome(usuario.nome ?? '');
        setEmail(usuario.email ?? '');
        setTelefone(usuario.telefone ?? '');
        setGenero(usuario.genero ?? '');

        }catch(erro){
            console.log(erro);
        }
    }

    const alterarDados = async () => {
        if(!validarDados()) return;

        const tokenUser = await AsyncStorage.getItem('userToken');

        const response = await axios.put('http://127.0.0.1:8000/api/usuario/update', {
            nome,
            email,
            telefone,
            genero,
        },{
            headers:{
                authorization: `Bearer ${tokenUser}`
            }
        });

        navigation.navigate('Menu');
    }

    return(
        <View>
            <View>
                <Pressable onPress={() => navigation.goBack()}>
                    <Text>Back</Text>
                </Pressable>
            </View>
            <View>
                <Text>Nome</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite seu usuário..."
                    value={nome}
                    onChangeText={setNome}
                />
                
                <Text>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite seu email..."
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <Text>Telefone</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite seu telefone..."
                    value={telefone}
                    onChangeText={setTelefone}
                    keyboardType="numeric"
                    autoCapitalize="none"
                />
                <Text>Gênero</Text>
                    {opcoesGenero.map((op) => (
                    <Pressable key={op} style={styles.opcao} onPress={() => setGenero(op)}>
                        <View style={styles.radioContainer}>
                            <View style={styles.radio}>
                              {genero === op && <View style={styles.radioSelecionado} />}
                            </View>
                            <Text style={styles.texto}>{op}</Text>
                        </View>
                    </Pressable>
                    ))}
                
                
                {erroMessage ? (
                    <Text style={{ color: 'red', marginBottom: 10 }}>{erroMessage}</Text>
                ) : null}
                
                <Button
                    title={carregando ? 'Enviando...' : 'Alterar'}
                    onPress={() => alterarDados()}
                    color="black"
                    disabled={carregando}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
    borderRadius: 5
  },
  opcao: {
    marginVertical: 5
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  radio: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioSelecionado: {
    width: 10,
    height: 10,
    backgroundColor: '#000',
    borderRadius: 5
  },
  texto: {
    fontSize: 16
  }
});

export default DigiteDadosScreen;