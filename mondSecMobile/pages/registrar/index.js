import React, {useEffect, useState} from 'react';
import { 
  View, Text, Pressable, Image, StyleSheet, TextInput, Button, 
  TouchableOpacity, ActivityIndicator, Modal, CheckBox
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';


const RegistrarScreen = ({ navigation }) => {
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [descricao, setDescricao] = useState('');
  const [visivelFinal, setVisivelFinal] = useState(false);
  const [visivelInicio, setVisivelInicio] = useState(true);
  const [carregando, setCarregando] = useState(false);
  const [mostrar, setMostrar] = useState('');
  const [menssagemErro, setMessagemErro] = useState('');

  const validarDados = () => {
    if (!tipo || !longitude || !latitude) {
      setMessagemErro('Preencha todos os campos obrigatórios.');
      return false;
    }

    if(isNaN(longitude) && longitude.trim() !== '' || isNaN(latitude) && latitude.trim() !== '') {
        setMenssagemErro('Insira apenas numeros nos campo longitude e latitude.')
        return false;
    }
    return true;
  };

  async function enviarOcorrencia() {
    if (!validarDados()) return;

    setCarregando(true);

    const dados = {
        titulo: titulo,
        descricao: descricao, 
        latitude: latitude,
        longitude: longitude,
        tbTipoOcorrencia: {
            tipo: tipo,
            descricao: descricao
    }
}


    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post('http://127.0.0.1:8000/api/ocorrencia/registrar', dados, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setVisivelFinal(true);
    } catch (err) {
      console.log(err);
      setMessagemErro('Erro ao enviar ocorrência');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
                <Pressable onPress={() => navigation.navigate('Home')} style={styles.iconeCabecalho}>
                    <FontAwesome name="arrow-left" size={24} color="#12577B" />
                </Pressable>
                <Text style={styles.tituloCabecalho}>Seu Perfil</Text>
                <Pressable onPress={() => navigation.navigate('Configuracao')} style={styles.iconeCabecalho}>
                    <FontAwesome name="cog" size={24} color="#12577B" />
                </Pressable>
            </View>

<View style={styles.form}>
  <Text style={styles.label}>Título da Ocorrência</Text>
  <TextInput 
    style={styles.input} 
    placeholder="Digite o título..." 
    onChangeText={setTitulo} 
  />

  <Text style={styles.label}>Tipo de Ocorrência</Text>
  <View style={styles.pickerWrapper}>
    <Picker
      selectedValue={tipo}
      onValueChange={(itemValue) => setTipo(itemValue)}
      style={styles.picker}
    >
      <Picker.Item label="Selecione..." value="" />
      <Picker.Item label="Roubo" value="Roubo" />
      <Picker.Item label="Acidente" value="Acidente" />
      <Picker.Item label="Incêndio" value="Incêndio" />
      <Picker.Item label="Outro" value="Outro" />
    </Picker>
  </View>

  <Text style={styles.label}>Latitude</Text>
  <TextInput 
    style={styles.input} 
    placeholder="Digite a latitude..." 
    onChangeText={setLatitude} 
  />

  
  <Text style={styles.label}>Longitude</Text>
  <TextInput 
    style={styles.input} 
    placeholder="Digite a longitude ..." 
    onChangeText={setLongitude} 
  />

  <Text style={styles.label}>Descrição</Text>
  <TextInput
    style={styles.textArea}
    placeholder="Descreva a ocorrência..."
    value={descricao}
    onChangeText={setDescricao}
    multiline
    maxLength={120}
    textAlignVertical="top"
  />
  <Text style={styles.contador}>
    {descricao.length}/120
  </Text>

  {menssagemErro ? <Text style={styles.erro}>{menssagemErro}</Text> : null}
</View>


    <TouchableOpacity
  style={[styles.botao, carregando && styles.botaoDesabilitado]}
  onPress={enviarOcorrencia}
  disabled={carregando}
>
  {carregando ? (
    <ActivityIndicator color="#fff" />
  ) : (
    <Text style={styles.textoBotao}>Enviar</Text>
  )}
</TouchableOpacity>

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
            <Pressable onPress={() => {
              setVisivelFinal(false);
              setTitulo('');
              setTipo('');
              setDescricao('');
              setLatitude(''); 
              setLongitude(''); 
            }}>
              <Text style={styles.modalButton}>Nova Ocorrência</Text>
            </Pressable>
            <Pressable onPress={() => {
              setVisivelFinal(false);
              setTitulo('');
              setTipo('');
              setDescricao('');
              setLatitude(''); 
              setLongitude(''); 
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
      <View style={styles.header}>
        <Text style={styles.modalTitle}>Como Funciona</Text>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => setVisivelInicio(false)}
        >
          <Text style={styles.closeIcon}>×</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.stepsContainer}>
        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Escolha o tipo de ocorrência</Text>
            <Text style={styles.stepDescription}>Ex: Assalto, Alagamento</Text>
          </View>
        </View>
        
        <View style={styles.stepDivider} />
        
        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Informe o local</Text>
          </View>
        </View>
        
        <View style={styles.stepDivider} />
        
        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Descreva o que aconteceu</Text>
          </View>
        </View>
        
        <View style={styles.stepDivider} />
        
        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>4</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Envie sua ocorrência</Text>
            <Text style={styles.stepDescription}>Acompanhe o status no menu "Minhas ocorrências"</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.primaryButton}
        onPress={() => setVisivelInicio(false)}
      >
        <Text style={styles.primaryButtonText}>Fazer Agora</Text>
      </TouchableOpacity>
      
      <View style={styles.checkboxContainer}>
        <CheckBox 
          value={mostrar} 
          onValueChange={setMostrar}
          tintColors={{ true: '#12577B', false: '#64748B' }}
        />
        <Text style={styles.checkboxLabel}>Não mostrar novamente</Text>
      </View>
    </View>
  </View>
</Modal>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF', 
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  tituloCabecalho: {
    fontSize: 20,
    fontWeight: '600',
    color: '#12577B',
  },
  iconeCabecalho: {
    padding: 5,
  },
  form: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF', 
    padding: 16,
    borderRadius: 12, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, 
  },
  label: {
    fontWeight: '700',
    marginBottom: 8, 
    fontSize: 14,
    color: '#1D3557', 
  },
  input: {
    backgroundColor: 'transparent', 
    borderBottomWidth: 2, 
    borderColor: '#0a0e13ff', 
    padding: 12, 
    borderRadius: 5, 
    marginBottom: 12, 
    fontSize: 14,
    color: '#334155', 
  },
 
  pickerWrapper: {
    borderBottomWidth: 2,
    borderColor: '#0a0e13ff',
    borderRadius: 5,
    marginBottom: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#334155',
    fontSize: 14,
  },
  erro: {
    color: '#E63946', 
    fontSize: 13,
    marginBottom: 10,
  },textArea: {
  borderBottomWidth: 1,
  borderColor: "#cbd5e1",
  fontSize: 14,
  color: "#334155",
  padding: 8,
  minHeight: 80, 
  marginBottom: 4,
},
contador: {
  fontSize: 12,
  color: "#94a3b8",
  textAlign: "right",
  marginBottom: 12,
}, botao: {
    backgroundColor: '#334155', 
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5, 
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
    modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 20,
    color: '#64748B',
    fontWeight: 'bold',
    lineHeight: 20,
  },
  stepsContainer: {
    marginBottom: 24,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#12577B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  stepDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
    marginLeft: 14,
  },
  primaryButton: {
    backgroundColor: '#12577B',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#12577B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#64748B',
  },
});


export default RegistrarScreen;