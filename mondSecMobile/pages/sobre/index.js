import React, {} from "react";
import {View, Text, Pressable} from 'react-native';

const SobreScreen = ({navigation}) => {
    return (
        <View>
            <Pressable onPress={() => navigation.navigate('Home')}>
                <Text>Back</Text>
            </Pressable>
            <Text>Tela sobre</Text>
            <Pressable onPress={() => navigation.navigate('Configuracao')}>
                <Text>Configuração</Text>
            </Pressable>
        </View>
    );
};

export default SobreScreen;