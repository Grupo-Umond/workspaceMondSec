import React, {} from "react";
import {View, Text, Pressable} from 'react-native';

const SobreScreen = ({navigation}) => {
    return (
        <View>
            <Pressable onPress={() => navigation.navigate('Home')}><Text>Tela sobre</Text></Pressable>
            <Pressable><Text>Configuração</Text></Pressable>
        </View>
    );
};

export default SobreScreen;