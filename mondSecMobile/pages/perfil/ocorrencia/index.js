import React, {useState, useEffect} from "react";
import {Pressable, View, Button, Text} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput } from "react-native";
import axios from "axios";

const OcorrenciaScreen = ({navigation}) => {
    const [ocorrencias, setOcorrencias] = useState([]);

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
            
            const {data} = await axios.get('http://127.0.0.1:8000/api/procurar', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!data) {
                console.log("Tem parada errada parceiro");
            }

            console.log(data);

            setOcorrencias(data);
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <View>
            <View>
                <Pressable onPress={() => navigation.navigate('Menu')}>
                </Pressable>
                <Text>Seu Historico</Text>
                <Pressable>
                </Pressable>
            </View>
            <TextInput />
            <View>
                    {ocorrencias.map((ocorrencia, index) => (
                        <View key={index}>
                            <Text>{ocorrencia.tituloOcorrencia}</Text>
                            <Text>{ocorrencia.longitudeOcorrencia}</Text>
                            <Text>{ocorrencia.latitudeOcorrencia}</Text>
                            <Text>{ocorrencia.dataRegistradaOcorrencia}</Text>
                            <Button/>
                        </View>
                    ))}
            </View>
        </View>
    );
};
export default OcorrenciaScreen;