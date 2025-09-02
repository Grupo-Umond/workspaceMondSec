import React, { useState } from "react";
import { View, Text, Pressable, TextInput, Button, Modal, StyleSheet } from 'react-native';
import { CoordenadaService } from '../../services/CoordenadaService';
import AsyncStorage from "@react-native-async-storage/async-storage";
import CheckBox from 'expo-checkbox';
import axios from "axios";

const RegistrarScreen = ({ navigation }) => {
    const [titulo, setTitulo] = useState('');
    const [tipo, setTipo] = useState('');
    const [descricaoTipo, setDescricaoTipo] = useState('');
    const [endereco, setEndereco] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [visivelFinal, setVisivelFinal] = useState(false);
    const [visivelInicio, setVisivelInicio] = useState(true);
    const [carregando, setCarregando] = useState(false);
    const [mensagemErro, setMensagemErro] = useState('');
    const [mostrar, setMostrar] = useState(false);

    const validarDados = () => {
        if (!titulo || !tipo || !endereco) {
            setMensagemErro('Preencha todos os campos obrigatórios.');
            return false;
        }
        return true;
    };

    const buscarEndereco = async () => {
        try {
            const coords = await CoordenadaService(endereco);
            return coords;
        } catch (e) {
            alert('Endereço não encontrado');
            throw e;
        }
    };

    const enviarOcorrencia = async () => {
        if (!validarDados()) return;
        setCarregando(true);
        setMensagemErro('');

        try {
            const coords = await buscarEndereco();

            const dados = {
                titulo,
                latitude: coords.latitude,
                longitude: coords.longitude,
                tbTipoOcorrencia: {
                    tipo,
                    descricao: descricaoTipo
                }
            };

            const token = await AsyncStorage.getItem('userToken');
            await axios.post('http://127.0.0.1:8000/api/ocorrencia/registrar', dados, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setVisivelFinal(true);

            // Limpa campos
            setTitulo('');
            setTipo('');
            setDescricaoTipo('');
            setEndereco('');
            setLatitude('');
            setLongitude('');
        } catch (err) {
            console.log(err);
            setMensagemErro('Erro ao enviar ocorrência');
        } finally {
            setCarregando(false);
        }
    };

    return (
        <View style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Text style={styles.link}>Voltar</Text>
                </Pressable>
                <Text style={styles.title}>Preencha sua ocorrência</Text>
                <Pressable onPress={() => navigation.navigate('Configuracao')}>
                    <Text style={styles.link}>Configurações</Text>
                </Pressable>
            </View>

            {/* Formulário */}
            <View style={styles.form}>
                <Text style={styles.label}>Título da Ocorrência</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite o título..."
                    onChangeText={setTitulo}
                    value={titulo}
                />

                <Text style={styles.label}>Tipo de Ocorrência</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: Roubo, Acidente..."
                    onChangeText={setTipo}
                    value={tipo}
                />

                <Text style={styles.label}>Descrição do Tipo de Ocorrência</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Descreva o tipo de ocorrência..."
                    onChangeText={setDescricaoTipo}
                    value={descricaoTipo}
                />

                <Text style={styles.label}>Endereço</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Digite o endereço..."
                    onChangeText={setEndereco}
                    value={endereco}
                />

                {mensagemErro ? <Text style={styles.erro}>{mensagemErro}</Text> : null}
            </View>

            {/* Botão enviar */}
            <Button
                onPress={enviarOcorrencia}
                title={carregando ? 'Enviando...' : 'Enviar'}
                disabled={carregando}
            />

            {/* Modal de sucesso */}
            <Modal
                animationType='slide'
                transparent={true}
                visible={visivelFinal}
                onRequestClose={() => setVisivelFinal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Ocorrência Enviada</Text>
                        <Text style={styles.modalText}>Sua ocorrência foi registrada com sucesso.</Text>

                        <Pressable onPress={() => setVisivelFinal(false)}>
                            <Text style={styles.modalButton}>Nova Ocorrência</Text>
                        </Pressable>

                        <Pressable onPress={() => {
                            setVisivelFinal(false);
                            navigation.navigate('Ocorrencia');
                        }}>
                            <Text style={styles.modalButton}>Ver Minhas Ocorrências</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType='slide'
                transparent={true}
                visible={visivelInicio}
                onRequestClose={() => setVisivelInicio(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>1. Escolha o tipo de ocorrência</Text>
                        <Text style={styles.modalText}>Ex: Assalto, Alagamento</Text>
                        <Text style={styles.modalText}>2. Informe o local</Text>
                        <Text style={styles.modalText}>Pode inserir o CEP ou nome da rua</Text>
                        <Text style={styles.modalText}>3. Descreva o que aconteceu</Text>
                        <Text style={styles.modalText}>Forneça os detalhes claros e objetivos</Text>
                        <Text style={styles.modalText}>4. Adicione o período do ocorrido (opcional)</Text>
                        <Text style={styles.modalText}>Pode ser algo recorrente de tal horário</Text>
                        <Text style={styles.modalText}>5. Envie sua ocorrência</Text>
                        <Text style={styles.modalText}>Acompanhe o status no menu "Minhas"</Text>

                        <Pressable onPress={() => setVisivelInicio(false)}>
                            <Text style={styles.modalButton}>Fazer Agora</Text>
                        </Pressable>

                        <View style={styles.checkboxContainer}>
                            <CheckBox value={mostrar} onValueChange={setMostrar} />
                            <Text style={styles.checkboxLabel}>Não mostrar novamente</Text>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    );
};

export default RegistrarScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F0F4F7',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    link: {
        color: '#007BFF',
        fontWeight: 'bold',
    },
    form: {
        marginBottom: 20,
    },
    label: {
        fontWeight: '600',
        marginBottom: 5,
        fontSize: 14,
    },
    input: {
        backgroundColor: '#FFF',
        borderColor: '#CCC',
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
        marginBottom: 12,
        fontSize: 14,
    },
    erro: {
        color: 'red',
        marginBottom: 10,
        fontSize: 13,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#FFF',
        padding: 25,
        borderRadius: 12,
        width: '90%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    modalText: {
        textAlign: 'center',
        marginBottom: 15,
        fontSize: 14,
    },
    modalButton: {
        color: '#007BFF',
        marginTop: 12,
        fontWeight: 'bold',
        fontSize: 15,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    checkboxLabel: {
        marginLeft: 8,
        fontSize: 14,
    },
});
