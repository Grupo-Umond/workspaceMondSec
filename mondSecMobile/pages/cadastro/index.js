
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, TouchableOpacity, Image } from 'react-native';
import CheckBox from 'expo-checkbox';
import UrlService from '../../services/UrlService'; 

const CadastroScreen = ({ navigation }) => {
  
  const [nome, setNome] = useState('');
  const [genero, setGenero] = useState(null);          
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaConfirma, setSenhaConfirma] = useState('');
  
  const regexTelefone = /^(?:\+55\s?)?(?:\(?\d{2}\)?\s?)?(?:9?\d{4}-?\d{4})$/;
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [concordoTermos, setConcordoTermos] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const [erroMessage, setErroMessage] = useState('');
  const [erroSenha, setErroSenha] = useState('');
  const [erroSenhaConfirma, setErroSenhaConfirma] = useState('');

  const opcoesGenero = ['Masculino', 'Feminino', 'Prefiro não informar'];

  useEffect(() => {
    const validarSenha = () => {
        if (!senha) return;

        if (senha.length < 8){
          setErroSenha('A senha precisa ter pelo menos 8 caracteres.');
          return false;
        }
    
        if (!/\d/.test(senha)){ 
          setErroSenha('A senha precisa conter pelo menos um número.');
          return false;
        }
    
        if (!/[A-Z]/.test(senha)){
          setErroSenha('A senha precisa conter pelo menos uma letra maiúscula.');
          return false;
        }
        setErroSenha('');
        return true;
      }    
      validarSenha();
  }, [senha]);

    useEffect(() => {
    const validarSenhaConfirma = () => {
        if (!senhaConfirma) return;

        if (senhaConfirma.length < 8){
          setErroSenhaConfirma('A senha precisa ter pelo menos 8 caracteres.');
          return false;
        }
    
        if (!/\d/.test(senhaConfirma)){ 
          setErroSenhaConfirma('A senha precisa conter pelo menos um número.');
          return false;
        }
    
        if (!/[A-Z]/.test(senhaConfirma)){
          setErroSenhaConfirma('A senha precisa conter pelo menos uma letra maiúscula.');
          return false;
        }
        setErroSenhaConfirma('');
        return true;
      }    
      validarSenhaConfirma();
  }, [senhaConfirma]);


  const validarDados = () => {
    if (!nome || !genero || !email || !senha || !telefone) {
      setErroMessage('Por favor, preencha todos os campos obrigatórios.');
      return false;
    }

    if(!senha === senhaConfirma){
      setErroMessage('As senhas devem ser iguais');
      return false;
    }

    if (erroSenha) {
      setErroMessage(erroSenha);
      return false;
    }

    if (!regexTelefone.test(telefone)) {
      setErroMessage('Telefone inválido.');
      return false;
    }

    if (!regexEmail.test(email)) {
      setErroMessage('Email inválido.');
      return false;
    }

    if (!concordoTermos) {
      setErroMessage('Concorde com nossos termos de uso.');
      return false;
    }

    setErroMessage('');
    return true;
  };

  const enviarDados = async () => {
    if (!validarDados()) return;

    setCarregando(true);

    try {
      const response = await UrlService.post('/usuario/cadastrar', {
        nome,
        email,
        telefone,
        genero,
        senha,

      });

      const mensagem = response.data.mensagem;
      navigation.navigate('Login', { mensagem });

    } catch (erro) {
      console.log(erro);
      const status = erro.response?.status;

      if (status === 401) setErroMessage('Cadastro não autorizado.');
      else if (status === 500) setErroMessage('Erro no servidor, tente mais tarde.');
      else if (status === 422) setErroMessage('Erro, dados inválidos.');
      else setErroMessage('Erro inesperado, tente mais tarde.');
      
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerLogo}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{"<"}</Text>
        </Pressable>
        <Text style={styles.textoCabecalho}>Cadastre-se Agora</Text>
        <Image 
          source={require('../../assets/mondSecLogo.png')} 
          style={styles.imagemLogo} 
        />
      </View> 

      <View style={styles.containerFormulario}>

        <View style={styles.grupoInput}>
          <Text style={styles.rotulo}>Nome</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu nome..."
            placeholderTextColor="#999"
            value={nome}
            onChangeText={setNome}
          />
        </View>

        <View style={styles.grupoInput}>
          <Text style={styles.rotulo}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu email..."
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.grupoInput}>
          <Text style={styles.rotulo}>Telefone</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu telefone..."
            placeholderTextColor="#999"
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="numeric"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.grupoInput}>
          <Text style={styles.rotulo}>Senha</Text>
          {erroSenha ? <Text style={styles.erro}>{erroSenha}</Text> : null}
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha..."
            placeholderTextColor="#999"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />
          <Text style={styles.rotulo}>Confirma Senha</Text>
          {erroSenhaConfirma ? <Text style={styles.erro}>{erroSenhaConfirma}</Text> : null}
          <TextInput
            style={styles.input}
            placeholder="Confirme a senha..."
            placeholderTextColor="#999"
            value={senhaConfirma}
            onChangeText={setSenhaConfirma}
            secureTextEntry
          />
        </View>

        <View style={styles.grupoInput}>
          <Text style={styles.rotulo}>Gênero</Text>
          <View style={styles.opcoesGenero}>
            {opcoesGenero.map((op) => (
              <Pressable key={op} style={styles.botaoOpcao} onPress={() => setGenero(op)}>
                <View style={[styles.radioExterno, genero === op && styles.radioSelecionado]}>
                  {genero === op && <View style={styles.radioInterno} />}
                </View>
                <Text style={styles.textoOpcao}>{op}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.containerTermos}>
          <CheckBox
            value={concordoTermos}
            onValueChange={setConcordoTermos}
            tintColors={{ true: '#4CAF50', false: '#aaa' }}
            style={styles.checkbox}
          />
         <Text style={styles.textoTermos}>
      Concordo com os
  <Text style={styles.termosLink} onPress={() => navigation.navigate('Politica')}> termos de uso</Text>
</Text>

        </View>

        {erroMessage ? <Text style={styles.erro}>{erroMessage}</Text> : null}

        <TouchableOpacity 
          style={[styles.botaoPrimario, carregando && styles.botaoDesativado]} 
          onPress={enviarDados}
          disabled={carregando}
        >
          <Text style={styles.textoBotao}>
            {carregando ? 'Cadastrando...' : 'Cadastrar'}
          </Text>
        </TouchableOpacity>

        <Pressable style={styles.linkLogin} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.textoLinkLogin}>
            Já tem uma conta? <Text style={styles.textoLinkLoginNegrito}>Faça login</Text>
          </Text>
        </Pressable>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  containerLogo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  textoCabecalho: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 8,
  },
  imagemLogo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  containerFormulario: {
    width: '100%',
  },
  grupoInput: {
    marginBottom: 12,
  },
  rotulo: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 4,
  },
  input: {
    width: '100%',
    height: 42,
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1A202C',
  },
  opcoesGenero: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 6,
  },
  botaoOpcao: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioExterno: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#CBD5E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  radioSelecionado: {
    borderColor: '#4299E1',
  },
  radioInterno: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4299E1',
  },
  textoOpcao: {
    fontSize: 13,
    color: '#4A5568',
  },
  containerTermos: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
    gap: 5, 
  },
 textoTermos: {
    fontSize: 14,
    color: '#000', 
    maeginLeft: 4,
  },
  termosLink: {
    color: '#12577B', 
    textDecorationLine: 'underline',
    fontWeight: 'bold', 
  },
  erro: {
    color: '#f00',
    fontSize: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  sucess: {
    color: '#0f0',
    marginBottom: 10,
    fontSize: 15,
    textAlign: 'center',
  },
  botaoPrimario: {
    width: '100%',
    height: 44,
    backgroundColor: '#4299E1',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  botaoDesativado: {
    backgroundColor: '#BEE3F8',
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  divisor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  linhaDivisor: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  textoDivisor: {
    color: '#718096',
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 10,
  },
  conteudoBotaoGoogle: {
    flexDirection: 'row',    
  alignItems: 'center',   
  justifyContent: 'center', 
  padding: 10,
  backgroundColor: 'transparent', 
  }, 
  botaoGoogle: {
    width: '100%',
    height: 44,
    backgroundColor: '#12577B',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconeGoogle: {
    width: 18,
    height: 18,
    marginRight: 10,
        flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  textoBotaoGoogle: {
    color: '#ffffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  linkLogin: {
    marginTop: 12,
    marginBottom: 20,
  },
  textoLinkLogin: {
    color: '#718096',
    fontSize: 13,
    textAlign: 'center',
  },
  textoLinkLoginNegrito: {
    color: '#4299E1',
    fontWeight: '600',
  },
});

export default CadastroScreen;
