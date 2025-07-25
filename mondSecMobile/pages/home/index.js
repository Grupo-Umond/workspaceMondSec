import React, {useState} from 'react';
import {View, Text, Pressable, TextInput} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const HomeScreen = ({ navigation }) => {
    return(
        <View>
            <View>
                <TextInput />
            </View>
            <View>
                <Pressable onPress={() => navigation.navigate('Home')}><Text>Home</Text></Pressable>
                <Pressable onPress={() => navigation.navigate('Sobre')}><Text>Sobre</Text></Pressable>
                <Pressable onPress={() => navigation.navigate('Menu')}><Text>Perfil</Text></Pressable>
            </View>
        </View>
    );

};
export default HomeScreen;