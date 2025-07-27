import React, {useState} from "react";
import {View, Text, Pressable, Switch, Linking, StyleSheet, ScrollView} from 'react-native';
import Slider from '@react-native-community/slider';
import CheckBox from 'expo-checkbox';

const ConfiguracaoScreen = ({navigation}) => {
    const [notificacao, setNotificacao] = useState(true);
    const [oculto, setOculto] = useState(true);
    const [volumeEfeito, setVolumeEfeito] = useState(100);
    const [volumeNotificacao, setVolumeNotificacao] = useState(100);
    const [escuro, setEscuro] = useState(false);
    const [claro, setClaro] = useState(true);



    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.backText}>Back</Text>
                </Pressable>
                <Text style={styles.title}>Configuração</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Volume</Text>
                <Text>Efeitos</Text>
                <Slider
                    style={styles.slider}
                    value={volumeEfeito}
                    onValueChange={setVolumeEfeito}
                    minimumValue={0}
                    maximumValue={100}
                />
                <Text>Notificações</Text>
                <Slider
                    style={styles.slider}
                    value={volumeNotificacao}
                    onValueChange={setVolumeNotificacao}
                    minimumValue={0}
                    maximumValue={100}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notificações</Text>
                <Switch
                    value={notificacao}
                    onValueChange={setNotificacao}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tema</Text>
                <View style={styles.checkboxContainer}>
                    <CheckBox value={claro} onValueChange={setClaro} />
                    <Text style={styles.checkboxLabel}>Claro</Text>
                </View>
                <View style={styles.checkboxContainer}>
                    <CheckBox value={escuro} onValueChange={setEscuro} />
                    <Text style={styles.checkboxLabel}>Escuro</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Dados e Privacidade</Text>
                <Pressable>
                    <Text>Permitir acesso à localização</Text>
                </Pressable>
                <Switch
                    value={oculto}
                    onValueChange={setOculto}
                />
                <Pressable onPress={() => Linking.openURL('https://example.com/termos')}>
                    <Text style={styles.linkText}>Ler nossos termos</Text>
                </Pressable>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Suporte</Text>
                <Pressable>
                    <Text>Fale conosco</Text>
                </Pressable>
                <Pressable>
                    <Text>FAQ</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        marginBottom: 20,
    },
    backText: {
        color: 'blue',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    checkboxLabel: {
        marginLeft: 8,
    },
    linkText: {
        color: 'blue',
        textDecorationLine: 'underline',
        marginTop: 5,
    },
});

export default ConfiguracaoScreen;
