import React, {useState} from "react";
import {View, Text, TextInput, Pressable} from 'react-native';

const DigiteEmailScreen = ({navigation}) => {
        return(
                <View>
                        <View>
                                <Pressable onPress={() => navigation.goBack()}>
                                        <Text>Sair</Text>
                                </Pressable>
                                <Text>Alterar Senha</Text>
                        </View>

                        <View>
                                <TextInput />
                                <Pressable>
                                        <Text>Enviar</Text>
                                </Pressable>
                        </View>
                </View>
        );
};
export default DigiteEmailScreen;