import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, TouchableOpacity, Image } from 'react-native';
import CheckBox from 'expo-checkbox';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import UrlService from '../../services/UrlService';
import { TextInputMask } from 'react-native-masked-text';
import { useTheme } from "../../services/themes/themecontext";  // ⭐ ADICIONADO
import Feather from '@expo/vector-icons/Feather';

const CadastroScreen = ({ navigation }) => {

  // ⭐ TEMA
  const { theme, isDarkMode } = useTheme();

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

  const [viewPass, setViewPass] = useState(true);

  useEffect(() => {
    const validarSenha = () => {
      if (!senha) return;
      if (senha.length < 8) {
        setErroSenha('A senha precisa ter pelo menos 8 caracteres.');
        return false;
      }
      if (!/\d/.test(senha)) {
        setErroSenha('A senha precisa conter pelo menos um número.');
        return false;
      }
      if (!/[A-Z]/.test(senha)) {
        setErroSenha('A senha precisa conter pelo menos uma letra maiúscula.');
        return false;
      }
      setErroSenha('');
      return true;
    };
    validarSenha();
  }, [senha]);

  useEffect(() => {
    const validarSenhaConfirma = () => {
      if (!senhaConfirma) return;
      if (senhaConfirma.length < 8) {
        setErroSenhaConfirma('A senha precisa ter pelo menos 8 caracteres.');
        return false;
      }
      if (!/\d/.test(senhaConfirma)) {
        setErroSenhaConfirma('A senha precisa conter pelo menos um número.');
        return false;
      }
      if (!/[A-Z]/.test(senhaConfirma)) {
        setErroSenhaConfirma('A senha precisa conter pelo menos uma letra maiúscula.');
        return false;
      }
      setErroSenhaConfirma('');
      return true;
    };
    validarSenhaConfirma();
  }, [senhaConfirma]);

  const validarCadastro = () => {
    if (!nome || !genero || !email || !senha || !telefone) {
      setErroMessage('Por favor, preencha todos os campos obrigatórios.');
      return false;
    }
    if (senha !== senhaConfirma) {
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
    if (!validarCadastro()) return;
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

  function onViewPass() {
    setViewPass(!viewPass)
  }

  return (

    <View style={[
      styles.container,
      { backgroundColor: theme.background }  // ⭐ MODO ESCURO
    ]}>

      {/* Fundo */}
      <View style={styles.containerFundo}>
        <View style={[
          styles.metadeFundo,
          { backgroundColor: isDarkMode ? theme.cimaDark : "#12577B" }
        ]} />

        <View style={[
          styles.metadeFundo,
          { backgroundColor: isDarkMode ? theme.baixoDark : "#a9cfe5" }
        ]} />
      </View>

      {/* CARD */}
      <View style={[
        styles.containerConteudo,
        { backgroundColor: isDarkMode ? "#1a1a1a" : "whitesmoke" }
      ]}>

        {/* HEADER */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.iconeCabecalho}>
            <FontAwesome name="arrow-left" size={20} color={theme.title} />
          </Pressable>
        </View>

        <View style={styles.logoContainer}>
          <Image
            source={
              isDarkMode
                ? require("../../assets/logobranca.png")
                : require("../../assets/mondSecLogo.png")
            }
            style={styles.imagemLogo}
          />
        </View>

        <Text style={[styles.textoCabecalho, { color: theme.title }]}>
          Cadastrar
        </Text>

        {/* FORMULÁRIO */}
        <View style={styles.containerFormulario}>

          {/* NOME */}
          <View style={styles.grupoInput}>
            <Text style={[styles.rotulo, { color: theme.text }]}>Nome</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.input,
                  borderColor: theme.border,
                  color: theme.text,
                }
              ]}
              placeholder="Digite seu nome..."
              placeholderTextColor={theme.textSecondary}
              value={nome}
              onChangeText={setNome}
            />
          </View>

          {/* EMAIL */}
          <View style={styles.grupoInput}>
            <Text style={[styles.rotulo, { color: theme.text }]}>Email</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.input,
                  borderColor: theme.border,
                  color: theme.text,
                }
              ]}
              placeholder="Digite seu email..."
              placeholderTextColor={theme.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* TELEFONE */}
          <View style={styles.grupoInput}>
            <Text style={[styles.rotulo, { color: theme.text }]}>Telefone</Text>
            <TextInputMask
              type={'cel-phone'}
              options={{
                maskType: 'BRL',
                withDDD: true,
                dddMask: '(99) '
              }}
              value={telefone}
              onChangeText={text => setTelefone(text)}
              style={[
                styles.input,
                {
                  backgroundColor: theme.input,
                  borderColor: theme.border,
                  color: theme.text,
                }
              ]}
              keyboardType="numeric"
              placeholderTextColor={theme.textSecondary}
              placeholder="Digite seu telefone..."
            />
          </View>

          {/* SENHA */}
          <View style={styles.grupoInput}>
            <Text style={[styles.rotulo, { color: theme.text }]}>Senha</Text>
            {erroSenha ? <Text style={styles.erro}>{erroSenha}</Text> : null}
            <View style={styles.input}>
              <View style={styles.campoSenha}>
                <View style={styles.campoInput}>
                  <TextInput
                    style={[
                      styles.senha,
                      {
                        backgroundColor: theme.input,
                        borderColor: theme.border,
                        color: theme.text,
                      }
                    ]}
                    placeholder="Digite sua senha..."
                    placeholderTextColor={theme.textSecondary}
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry={viewPass}
                  />
                </View>
                <Pressable onPress={onViewPass}>
                  {viewPass == true && <Feather name="eye" size={24} color="black" />}
                  {viewPass == false && <Feather name="eye-off" size={24} color="black" />}
                </Pressable>
              </View>
            </View>
          </View>

          {/* CONFIRMAR SENHA */}
          <View style={styles.grupoInput}>
            <Text style={[styles.rotulo, { color: theme.text }]}>Confirma Senha</Text>
            {erroSenhaConfirma ? <Text style={styles.erro}>{erroSenhaConfirma}</Text> : null}
            <View style={styles.input}>
              <View style={styles.campoSenha}>
                <View style={styles.campoInput}>
                  <TextInput
                    style={[
                      styles.senha,
                      {
                        backgroundColor: theme.input,
                        borderColor: theme.border,
                        color: theme.text,
                      }
                    ]}
                    placeholder="Confirme a senha..."
                    placeholderTextColor={theme.textSecondary}
                    value={senhaConfirma}
                    onChangeText={setSenhaConfirma}
                    secureTextEntry={viewPass}
                  />
                </View>
                <Pressable onPress={onViewPass}>
                  {viewPass == true && <Feather name="eye" size={24} color="black" />}
                  {viewPass == false && <Feather name="eye-off" size={24} color="black" />}
                </Pressable>
              </View>
            </View>
          </View>

          {/* GÊNERO */}
          <View style={styles.grupoInput}>
            <Text style={[styles.rotulo, { color: theme.text }]}>Gênero</Text>

            <View style={styles.opcoesGenero}>
              {opcoesGenero.map((op, index) => (
                <Pressable
                  key={op}
                  style={[
                    styles.botaoOpcao,
                    index < 2 && { width: '28%' } // só 1º e 2º mudam
                  ]}
                  onPress={() => setGenero(op)}
                >
                  <View style={[
                    styles.radioExterno,
                    { borderColor: theme.text },
                    genero === op && { borderColor: theme.buttonColor }
                  ]}>
                    {genero === op && (
                      <View style={[styles.radioInterno, { backgroundColor: theme.buttonColor }]} />
                    )}
                  </View>

                  <Text
                    style={[
                      styles.textoOpcao,
                      { color: theme.text },
                      index === 2 && { width: 'auto' } // só o 3º muda
                    ]}
                  >
                    {op}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* TERMOS */}
          <View style={styles.containerTermos}>
            <CheckBox
              value={concordoTermos}
              onValueChange={setConcordoTermos}
              tintColors={{
                true: theme.buttonColor,
                false: theme.textSecondary
              }}
              style={styles.checkbox}
            />
            <Text style={[styles.textoTermos, { color: theme.text }]}>
              Concordo com os{' '}
              <Text
                style={[styles.termosLink, { color: theme.primary }]}
                onPress={() => navigation.navigate('Politica')}
              >
                termos de uso
              </Text>
            </Text>
          </View>

          {erroMessage ? <Text style={styles.erro}>{erroMessage}</Text> : null}

          {/* BOTÃO */}
          <TouchableOpacity
            style={[
              styles.botaoPrimario,
              { backgroundColor: theme.buttonColor },
              carregando && styles.botaoDesativado
            ]}
            onPress={enviarDados}
            disabled={carregando}
          >
            <Text style={styles.textoBotao}>
              {carregando ? 'Cadastrando...' : 'Cadastrar'}
            </Text>
          </TouchableOpacity>

          {/* LINK LOGIN */}
          <Pressable style={styles.linkLogin} onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.textoLinkLogin, { color: theme.textSecondary }]}>
              Já tem uma conta?{' '}
              <Text style={[styles.textoLinkLoginNegrito, { color: theme.buttonColor }]}>
                Faça login
              </Text>
            </Text>
          </Pressable>

        </View>
      </View>
    </View >
  );
};

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: '#FFFFFF',
  //   paddingHorizontal: 24,
  //   justifyContent: 'center',
  //   paddingTop: 20,
  // },
  container: {
    flex: 1,
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
  containerConteudo: {
    flex: 1,
    paddingHorizontal: 20,
    marginHorizontal: 25,
    paddingTop: 25,
    marginTop: 40,
    marginBottom: 40,
    zIndex: 1,
    borderRadius: 10,
    // elevation: 3,
    // justifyContent: 'center',
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // marginBottom: 20,
    position: 'relative',
  },
  iconeCabecalho: {
    position: 'absolute',
    left: 0,
    padding: 6,
  },
  textoCabecalho: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'center',
  },

  // fontSize: 25,
  // fontWeight: 'bold',
  // textAlign: 'center',
  // marginBottom: 20,

  containerLogo: {
    alignSelf: 'center',
    width: '100%',
  },
  imagemLogo: {
    width: '100%',
    height: 100,
    resizeMode: 'contain'
  },
  containerFormulario: {
    width: '100%',
  },
  grupoInput: {
    marginBottom: 12,
  },
  rotulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 4,
  },
  input: {
    width: '100%',
    height: 45,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 18,
    color: '#1A202C',
  },
  opcoesGenero: {
    flexDirection: 'row',
    // justifyContent: 'flex-start',
    // marginTop: 6,
    // backgroundColor: "blue",
    flexWrap: 'nowrap',
  },
  botaoOpcao: {
    // backgroundColor: "green",
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 6,
    paddingVertical: 6,
    // marginRight: 15,
    // flexShrink: 1,
    flexWrap: 'wrap',
    width: '50%'
  },
  radioExterno: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#1A202C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 3,
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
    fontSize: 12,
    flexShrink: 1,
    flexWrap: 'nowrap',
    // backgroundColor: 'red',
    width: 'auto'
  },
  containerTermos: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    // marginTop: 8,
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
    width: '70%',
    height: 45,
    backgroundColor: '#12577B',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    alignSelf: 'center',
  },

  botaoDesativado: {
    backgroundColor: '#BEE3F8',
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 20,
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
    // marginTop: 12,
    // marginBottom: 20,
  },
  textoLinkLogin: {
    color: '#718096',
    fontSize: 16,
    textAlign: 'center',
  },
  textoLinkLoginNegrito: {
    color: '#12577B',
    fontWeight: '600',
  },
  senha: {
    // width: '100%',
    // height: 45,
    // backgroundColor: '#F7FAFC',
    // borderWidth: 1,
    // borderColor: '#E2E8F0',
    // borderRadius: 6,
    // paddingHorizontal: 12,
    fontSize: 18,
    color: '#1A202C',
  },
  campoSenha: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  campoInput: {
    width: '90%',
  }
});

export default CadastroScreen;
