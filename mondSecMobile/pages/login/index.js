import React, { useState, useEffect, useContext} from "react";
import { View, Text, TextInput, Pressable, StyleSheet, TouchableOpacity, Image}  from 'react-native';
import { AuthContext } from '../../services/AuthContext';
import UrlService from '../../services/UrlService';
import  axios  from 'axios';

const LoginScreen = ({navigation, route}) => {

  const[erroMessage, setErroMessage] = useState('');
  const[carregando, setCarregando] = useState(false);
  const[login, setLogin] = useState('');
  const[senha, setSenha] = useState('');
  const regexTelefone = /^(?:\s?)?(?:\(?\d{2}\)?\s?)?(?:9?\d{4}-?\d{4})$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const { logar }= useContext(AuthContext);
  const mensagem = route.params?.mensagem;
  const [sucessMessage, setSucessMessage] = useState(mensagem);

  const validarDados = () => {
    setSucessMessage('');
    if(!login || !senha) {
      setErroMessage('Por favor, preenche todos os campos.');
      return false;
    }

    if(!emailRegex.test(login) && !regexTelefone.test(login)) {
      setErroMessage('Por favor, digite um email ou numero valido.');
      return false;
    }

    if(senha.length < 8) {
      setErroMessage('Por favor, digite uma senha com no minimo 8 digitos.');
      return false;
    }
    
    setErroMessage('')
    return true;
  }

  const validarLogin = async () => {
    if(!validarDados()) return;
    setCarregando(true);

    try {

      const response = await UrlService.post('/usuario/login', {
        login,
        senha,
      });

      const token = response.data.tokenUser;
    
      if(!token) {
        setErroMessage("Erro ao autenticar. Token não recebido.");
        return;
      }
      const mensagem = response.data.mensagem;
      await logar(token);
      navigation.navigate('Home',{mensagem});     
    } catch (err) {

        if(err.response?.status === 401) {
          setErroMessage("Email ou senha incorretos.");
        } else if(err.response?.status === 403) {
          setErroMessage("Conta deletada"); 
    
        }else if(err.response?.status === 505){
          console.log(err);
          setErroMessage("Falha no servidor.");

        }
      }finally{
        setCarregando(false);
      }
  }

  return (
  <View style={styles.container}>
     <View style={styles.containerFundo}>
        <View style={[styles.metadeFundo, styles.metadeSuperior]} />
        <View style={[styles.metadeFundo, styles.metadeInferior]} />
      </View>
        <View style={styles.containerConteudo}>
            <View style={styles.logoContainer}>
                <Image
                  source={require('../../assets/mondlogo.png')}
                  style={styles.logo}
                />
              </View>
              <Pressable style={styles.backButton} onPress={() => navigation.navigate('Home')}>
                        <Text style={styles.backArrow}>{"<"}</Text>
                      </Pressable>
              <Text style={styles.textoBoasVindas}>Bem-vindo à MondSec!</Text>
    <Text style={styles.textoEntrar}>Entrar</Text>

     <View style={styles.containerInput}>
          <Text style={styles.rotulo}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu email..."
            placeholderTextColor="#999"
            onChangeText={setLogin}
            keyboardType="default"
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>
    
     <View style={styles.containerInput}>
           <Text style={styles.rotulo}>Senha</Text>
           <TextInput
             style={styles.input}
             keyboardType="default"
             placeholder="Digite sua senha..."
             placeholderTextColor="#999"
             onChangeText={setSenha}
             secureTextEntry
           />
         </View>

         <View style={styles.linhaOpcoes}>
     
           <Pressable onPress={() => navigation.navigate('DigiteCampo')}>
             <Text style={styles.textoSenhaEsquecida}>Esqueceu a senha?</Text>
           </Pressable>
         </View>

      {erroMessage ? <Text style={styles.erro}>{erroMessage}</Text> : null}
      {sucessMessage ? ( <Text style={styles.sucess}>{sucessMessage}</Text> ) : (null)}
<TouchableOpacity 
  style={styles.botaoLogin} 
  onPress={validarLogin} 
  disabled={carregando}
>
  <Text style={styles.textoBotaoLogin}>
    {carregando ? 'Entrando...' : 'Entrar'}
  </Text>
</TouchableOpacity>


    

    <View style={styles.divisor}>
      <View style={styles.linhaDivisor} />
      <Text style={styles.textoDivisor}>ou</Text>
      <View style={styles.linhaDivisor} />
    </View>

    <Pressable 
      style={styles.linkCadastro} 
      onPress={() => navigation.navigate('Cadastro')}
    >
      <Text style={styles.textoLinkCadastro}>Ainda não tem uma conta? <Text style={styles.destaqueLinkCadastro}>Cadastre-se</Text></Text>
    </Pressable>
  </View>

  </View>
  );
};


const styles = StyleSheet.create({
 container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#FFFFFF',
  },
  containerFundo: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  metadeFundo: {
    height: '50%',
  },
  metadeSuperior: {
    backgroundColor: '#12577B',
  },
  metadeInferior: {
    backgroundColor: '#a9cfe5',
  },
  containerConteudo: {
    flex: 1,
    paddingHorizontal: 20,
    marginHorizontal: 25,
    marginTop: 80,
    marginBottom: 80,
    zIndex: 1,
    backgroundColor: 'whitesmoke',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: 'center',
  },
  logoContainer: {
    alignSelf: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 30,
    elevation: 3,
    width: '80%'
  },
  logo: {
    width: '100%',
    height: 80,
    resizeMode: 'contain'
  },
  textoBoasVindas: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#021b33',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  textoEntrar: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#021b33',
    textAlign: 'center',
    marginBottom: 20,
  },
  containerInput: {
    marginBottom: 5,
  },
  rotulo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: -12,
  },
  input: {
    width: '100%',
    height: 60,
    backgroundColor: 'transparent',
    borderBottomWidth: 0.8,
    borderBottomColor: 'gray',
    fontSize: 16,
    color: '#333',
  },
  linhaOpcoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  textoSenhaEsquecida: {
    color: '#12577B',
    fontSize: 14,
    fontWeight: '600',
  },
  erro: {
    color: '#f00',
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 15,
  },
  sucess: {
    color: '#008000',
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 15,
  },
  containerBotoes: {
    width: '100%',
    marginTop: 20,
  },
  botaoLogin: {
    width: '70%',
    height: 45, 
    backgroundColor: '#12577B',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    alignSelf: 'center',
  },
  textoBotaoLogin: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  divisor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linhaDivisor: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  textoDivisor: {
    color: '#757575',
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 10,
  },
  linkCadastro: {
    marginTop: 10,
  },
  textoLinkCadastro: {
    color: '#757575',
    fontSize: 14,
    textAlign: 'center',
  },
  destaqueLinkCadastro: {
    color: '#12577B',
    fontWeight: '600',

  },
});

export default LoginScreen;
