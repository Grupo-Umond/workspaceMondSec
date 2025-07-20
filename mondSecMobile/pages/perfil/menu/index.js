import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Pressable } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 
import axios from 'axios';

const MenuScreen = ({navigation}) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <FontAwesome name="user" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Seu Perfil</Text>
                <TouchableOpacity>
                    <FontAwesome name="user" size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <View style={styles.profileSection}>
                <Image 
                    source={{ uri: 'https://th.bing.com/th/id/R.8e2c571ff125b3531705198a15d3103c?rik=gzhbzBpXBa%2bxMA&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fuser-png-icon-big-image-png-2240.png&ehk=VeWsrun%2fvDy5QDv2Z6Xm8XnIMXyeaz2fhR3AgxlvxAc%3d&risl=&pid=ImgRaw&r=0//via.placeholder.com/' }} //
                    style={styles.avatar}
                />
                <Text style={styles.profileText}>Nome do Usuário</Text>
                <Text style={styles.profileText}>email@exemplo.com</Text>
            </View>

            <View style={styles.menuOptions}>
                <TouchableOpacity style={styles.menuButton}>
                    <Text style={styles.menuText}>Minhas Ocorrências</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuButton}>
                    <Text style={styles.menuText}>Alterar Senha</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuButton}>
                    <Text style={styles.menuText}>Termos e Privacidade</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuButton}>
                    <Text style={styles.menuText}>Sair da conta</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
export default MenuScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#f4f4f4',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    profileText: {
        fontSize: 16,
        marginBottom: 4,
    },
    menuOptions: {
        gap: 12,
    },
    menuButton: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    menuText: {
        fontSize: 16,
        color: '#333',
    },
});
