import React, {useState} from "react";
import {View, Text, TextInput, Pressable} from 'react-native';

const DigiteCodigoScreen = ({navigation}) => {

    
    return(
        <View>
            <View>
                <Pressable>
                    <Text>Back</Text>
                </Pressable>
            </View>
            <View>
                <Text>Digite o codigo que enviamos para seu email</Text>
                <TextInput />
                <Pressable>
                    <Text>Não recebeu o codigo? reenvie aqui</Text>
                </Pressable>

                <Pressable onPress={() => enviarCodigo()}>
                    <Text>Enviar</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default DigiteCodigoScreen;