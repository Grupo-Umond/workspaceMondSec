import React, {useState} from "react";
import {View, Text, TextInput, Pressable, Button} from 'react-native';

const TrocarEmailScreen = ({navigate}) => {
    const[carregando, setCarregando] = useState(false);
    const[novoEmail, setNovoEmail] = useState('');
    const[novoEmailConfirma, setNovoEmailConfirma] = useState('');
    const[erroMessage, setErroMessage] = useState('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    const validarDados = () => {
        if(!novoEmail || !novoEmailConfirma) {
            setErroMessage('Digite todos os campos obrigatorios');
            return false;
        }

        if(novoEmail !== novoEmailConfirma) {
            setErroMessage('Os emails são diferentes');
            return false;
        }  

        if(!emailRegex.test(novoEmail) || !emailRegex.test(novoEmaiConfirma)) {
            setErroMessage('Email em formato invalido');
            return false;
        }

        return true;
    }

    const alterarEmail = async () => {
        if(!validarDados()){return;};

        setCarregando(true);
        


    }





    return(
        <View style={styles.container}>
            <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backText}>← Voltar</Text>
            </Pressable>
        
            <View style={styles.form}>
                <Text style={styles.label}>Digite seu novo email</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry
                    value={novoEmail}
                    onChangeText={setNovoEmail}
                />
                <Text style={styles.label}>Confirme o seu novo email</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry
                    value={novoEmailConfirma}
                    onChangeText={setNovoEmailConfirma}
                />
                {erroMessage ? <Text style={styles.error}>{erroMessage}</Text> : null}
                <Button 
                    title={carregando ? 'Enviando...' : 'Enviar'}
                    onPress={() => alterarEmail()}
                    disabled={carregando}
                />
                        
                    </View>
                </View>
    );
};
export default TrocarEmailScreen;