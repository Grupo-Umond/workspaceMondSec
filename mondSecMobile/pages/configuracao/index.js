<<<<<<< HEAD
import React, {useContext, useState} from "react";
import {View, Text, Pressable, Switch, Linking, StyleSheet, ScrollView, Modal, TextInput} from 'react-native';
=======
import React, { useContext, useState } from "react";
import { View, Text, Pressable, Switch, Linking, StyleSheet, ScrollView, Modal, TextInput } from 'react-native';
>>>>>>> restaurarDados
import { AuthContext } from "../../services/AuthContext";
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import CheckBox from 'expo-checkbox';

<<<<<<< HEAD
const ConfiguracaoScreen = ({navigation, setUserToken}) => {
    const [notificacao, setNotificacao] = useState(true);
    const [oculto, setOculto] = useState(true);
    const [volumeEfeito, setVolumeEfeito] = useState(100);
    const [volumeNotificacao, setVolumeNotificacao] = useState(100);
    const [temaSelecionado, setTemaSelecionado] = useState('claro');
    const [senha, setSenha] = useState('');
    const [erroMessage, setErroMessage] = useState('');
    const { logout } = useContext(AuthContext);



    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
               <Pressable style={styles.backButton} onPress={() => navigation.navigate('Home')}>
               <Text style={styles.backArrow}>{"<"}</Text>
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
                <Text style={styles.sectionTitle}>Notificações</Text>
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
        <CheckBox
            value={temaSelecionado === 'claro'}
            onValueChange={() => setTemaSelecionado('claro')}
        />
        <Text style={styles.checkboxLabel}>Claro</Text>
    </View>
    <View style={styles.checkboxContainer}>
        <CheckBox
            value={temaSelecionado === 'escuro'}
            onValueChange={() => setTemaSelecionado('escuro')}
        />
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
                <Pressable onPress={() => setModalDelete(true)}>
                    <Text>Excluir conta</Text>
                </Pressable>
            </View>
            

            {/* Modal para digitar a senha */}
            <Modal animationType="fade" transparent visible={modalDelete}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Digite sua senha para confirmar</Text>
                        <TextInput
                            style={styles.modalInput}
                            secureTextEntry
                            value={senha}
                            onChangeText={setSenha}
                            placeholder="Senha"
                        />
                        {erroMessage ? <Text style={styles.modalError}>{erroMessage}</Text> : null}

                        <Pressable style={styles.modalButtonConfirm} onPress={excluirConta}>
                            <Text style={styles.modalButtonText}>Excluir</Text>
                        </Pressable>
                        <Pressable style={styles.modalButtonCancel} onPress={() => setModalDelete(false)}>
                            <Text style={styles.modalButtonText}>Voltar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
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
        flexDirection: 'row',
        gap: 40, 
    }, backArrow: {
    fontSize: 70,
    color: "#12577B",
  },
    backText: {
        color: '#12577B',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 30, 
        color: '#12577B'
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color:' #12577B'  
   
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
        color: '#12577B',
        textDecorationLine: 'underline',
        marginTop: 5,
    },
    modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 11, 11, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
},
modalContent: {
=======
const ConfiguracaoScreen = ({ navigation, setUserToken }) => {
  const [notificacao, setNotificacao] = useState(true);
  const [oculto, setOculto] = useState(true);
  const [volumeEfeito, setVolumeEfeito] = useState(100);
  const [volumeNotificacao, setVolumeNotificacao] = useState(100);
  const [temaSelecionado, setTemaSelecionado] = useState('claro');
  const [senha, setSenha] = useState('');
  const [erroMessage, setErroMessage] = useState('');
  const { logout } = useContext(AuthContext);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.backArrow}>{"<"}</Text>
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
        <Text style={styles.sectionTitle}>Notificações</Text>
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
          <CheckBox
            value={temaSelecionado === 'claro'}
            onValueChange={() => setTemaSelecionado('claro')}
          />
          <Text style={styles.checkboxLabel}>Claro</Text>
        </View>
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={temaSelecionado === 'escuro'}
            onValueChange={() => setTemaSelecionado('escuro')}
          />
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
        <Pressable onPress={() => setModalDelete(true)}>
          <Text>Excluir conta</Text>
        </Pressable>
      </View>

      <Modal animationType="fade" transparent visible={modalDelete}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Digite sua senha para confirmar</Text>
            <TextInput
              style={styles.modalInput}
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
              placeholder="Senha"
            />
            {erroMessage ? <Text style={styles.modalError}>{erroMessage}</Text> : null}

            <Pressable style={styles.modalButtonConfirm} onPress={excluirConta}>
              <Text style={styles.modalButtonText}>Excluir</Text>
            </Pressable>
            <Pressable style={styles.modalButtonCancel} onPress={() => setModalDelete(false)}>
              <Text style={styles.modalButtonText}>Voltar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff'
  },
  header: {
    marginBottom: 20,
    flexDirection: 'row',
    gap: 40
  },
  backArrow: {
    fontSize: 70,
    color: "#12577B"
  },
  backText: {
    color: '#12577B'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 30,
    color: '#12577B'
  },
  section: {
    marginBottom: 25
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#12577B'
  },
  slider: {
    width: '100%',
    height: 40
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  checkboxLabel: {
    marginLeft: 8
  },
  linkText: {
    color: '#12577B',
    textDecorationLine: 'underline',
    marginTop: 5
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 11, 11, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
>>>>>>> restaurarDados
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
<<<<<<< HEAD
    elevation: 5,
},
modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
},
modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
},
modalInput: {
=======
    elevation: 5
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center'
  },
  modalInput: {
>>>>>>> restaurarDados
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
<<<<<<< HEAD
    marginBottom: 10,
},
modalError: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
},
modalButtonConfirm: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
},
modalButtonCancel: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
},
modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
},

});

export default ConfiguracaoScreen;
=======
    marginBottom: 10
  },
  modalError: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center'
  },
  modalButtonConfirm: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10
  },
  modalButtonCancel: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  }
});

export default ConfiguracaoScreen;
>>>>>>> restaurarDados
