import React, {useState, useEffect} from "react";
import {Pressable, View, Button, Text, ScrollView, TextInput} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const OcorrenciaScreen = ({navigation}) => {
    const [ocorrencias, setOcorrencias] = useState([]);
    const [lengthNumber, setLenghtNumber] = useState('');

    useEffect(() => {

        buscarOcorrencia();

    }, []);

    
    async function buscarOcorrencia() {
        try{
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                console.log("Token não recebido.")
                return;
            }
            
            const {data} = await axios.get('http://127.0.0.1:8000/api/ocorrencia/procurar', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log(data);

            setOcorrencias(data);
            setLenghtNumber(data.length);
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <ScrollView>
            <View>
                <Pressable onPress={() => navigation.navigate('Menu')}>
                    <Text>Back</Text>
                </Pressable>
                <Text>Seu Historico</Text>
                <Pressable onPress={() => navigation.navigate('Configuracao')}>
                    <Text>Config</Text>
                </Pressable>
            </View>
            <TextInput />
            <View>
                <Text>Total de Ocorrencia: {lengthNumber}</Text>
                <Pressable onPress={() => navigation.navigate('Registrar')}>
                    <Text>+</Text>
                </Pressable>
                {ocorrencias.map((ocorrencia, index) => (
                    <View key={index}>
                        <Text>{ocorrencia.titulo}</Text>
                        <Text>{ocorrencia.longitude}</Text>
                        <Text>{ocorrencia.latitude}</Text>
                        <Text>{ocorrencia.data}</Text>
                        <Button/>
                    </View>
                    ))}
            </View>
        </ScrollView>
    );
};
export default OcorrenciaScreen;