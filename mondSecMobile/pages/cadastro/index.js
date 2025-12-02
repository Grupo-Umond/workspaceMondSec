import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, TouchableOpacity, Image } from 'react-native';
import CheckBox from 'expo-checkbox';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import UrlService from '../../services/UrlService';
import { TextInputMask } from 'react-native-masked-text';
import { useTheme } from "../../services/themes/themecontext";
import Feather from '@expo/vector-icons/Feather';

const CadastroScreen = ({ navigation }) => {

  const { theme, isDarkMode } = useTheme();

  const [nome, setNome] = useState('');
  const [genero, setGenero] = useState(null);
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaConfirma, setSenhaConfirma] = useState('');
  const [viewPass, setViewPass] = useState(true)
  const [viewPassConfirma, setViewPassConfirma] = useState(true)

  function onViewPass() {
    setViewPass(!viewPass)
  }

  function onViewPassConfirmar() {
    setViewPassConfirma(!viewPassConfirma)
  }

  const regexTelefone = /^(?:\+55\s?)?(?:\(?\d{2}\)?\s?)?(?:9?\d{4}-?\d{4})$/;
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [concordoTermos, setConcordoTermos] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const [erroSenha, setErroSenha] = useState('');
  const [erroSenhaConfirma, setErroSenhaConfirma] = useState('');
  const [errosLista, setErrosLista] = useState([]);

  const opcoesGenero = ['Masculino', 'Feminino', 'Prefiro não informar'];

  // VALIDAR SENHA EM TEMPO REAL
  useEffect(() => {
    if (!senha) return;

    if (senha.length < 8) return setErroSenha("A senha precisa ter pelo menos 8 caracteres.");
    if (!/\d/.test(senha)) return setErroSenha("A senha precisa conter pelo menos um número.");
    if (!/[A-Z]/.test(senha)) return setErroSenha("A senha precisa conter pelo menos uma letra maiúscula.");

    setErroSenha('');
  }, [senha]);

  useEffect(() => {
    if (!senhaConfirma) return;

    if (senhaConfirma.length < 8) return setErroSenhaConfirma("A senha precisa ter pelo menos 8 caracteres.");
    if (!/\d/.test(senhaConfirma)) return setErroSenhaConfirma("A senha precisa conter pelo menos um número.");
    if (!/[A-Z]/.test(senhaConfirma)) return setErroSenhaConfirma("A senha precisa conter pelo menos uma letra maiúscula.");

    setErroSenhaConfirma('');
  }, [senhaConfirma]);

  // ⭐ FUNÇÃO QUE COLETA TODOS OS ERROS POSSÍVEIS
  const validarCadastro = () => {
    const erros = [];

    if (!nome) erros.push("O campo nome é obrigatório.");
    if (!email) erros.push("O campo email é obrigatório.");
    if (!telefone) erros.push("O campo telefone é obrigatório.");
    if (!genero) erros.push("Selecione um gênero.");
    if (!senha) erros.push("O campo senha é obrigatório.");
    if (!senhaConfirma) erros.push("O campo confirmar senha é obrigatório.");

    if (senha && senha.length < 8)
      erros.push("A senha precisa ter pelo menos 8 caracteres.");

    if (senha && !/\d/.test(senha))
      erros.push("A senha precisa conter pelo menos um número.");

    if (senha && !/[A-Z]/.test(senha))
      erros.push("A senha precisa conter pelo menos uma letra maiúscula.");

    if (senha !== senhaConfirma)
      erros.push("As senhas precisam ser iguais.");

    if (telefone && !regexTelefone.test(telefone))
      erros.push("Telefone inválido.");

    if (email && !regexEmail.test(email))
      erros.push("Email inválido.");

    if (!concordoTermos)
      erros.push("Você precisa concordar com os termos de uso.");

    setErrosLista(erros);

    return erros.length === 0;
  };

  // ENVIAR DADOS
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
      navigation.navigate('Foto', { mensagem });

    } catch (erro) {
      console.log(erro);

      const errosApi = erro.response?.data?.errors;

      if (Array.isArray(errosApi)) {
        setErrosLista(errosApi);
        return;
      }

      const status = erro.response?.status;

      if (status === 401) setErrosLista(["Cadastro não autorizado."]);
      else if (status === 422) setErrosLista(["Dados inválidos enviados."]);
      else if (status === 500) setErrosLista(["Erro no servidor, tente mais tarde."]);
      else setErrosLista(["Erro inesperado, tente novamente."]);

    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconeCabecalho}>
          <FontAwesome name="arrow-left" size={20} color={theme.title} />
        </Pressable>
        <Text style={[styles.textoCabecalho, { color: theme.title }]}>
          Cadastre-se Agora
        </Text>
      </View>

      {/* LOGO */}
      <View style={styles.containerLogo}>
        <Image
          source={
            isDarkMode
              ? require("../../assets/logobranca.png")
              : require("../../assets/mondSecLogo.png")
          }
          style={styles.imagemLogo}
        />
      </View>

      {/* FORMULÁRIO */}
      <View style={styles.containerFormulario}>

        {/* NOME */}
        <View style={styles.grupoInput}>
          <Text style={[styles.rotulo, { color: theme.text }]}>Nome</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.input, borderColor: theme.border, color: theme.text }]}
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
            style={[styles.input, { backgroundColor: theme.input, borderColor: theme.border, color: theme.text }]}
            placeholder="Digite seu email..."
            placeholderTextColor={theme.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* TELEFONE */}
        <View style={styles.grupoInput}>
          <Text style={[styles.rotulo, { color: theme.text }]}>Telefone</Text>
          <TextInputMask
            type={'cel-phone'}
            options={{ maskType: 'BRL', withDDD: true, dddMask: '(99) ' }}
            value={telefone}
            onChangeText={setTelefone}
            style={[styles.input, { backgroundColor: theme.input, borderColor: theme.border, color: theme.text }]}
            keyboardType="numeric"
            placeholder="Digite seu telefone..."
            placeholderTextColor={theme.textSecondary}
          />
        </View>

        {/* SENHA */}
        <View style={styles.grupoInput}>
          <Text style={[styles.rotulo, { color: theme.text }]}>Senha</Text>
          {erroSenha ? <Text style={styles.erro}>{erroSenha}</Text> : null}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              style={[styles.input, { backgroundColor: theme.input, borderColor: theme.border, color: theme.text }]}

              value={senha}
              placeholder="Digite sua senha..."
              placeholderTextColor={theme.textSecondary}
              secureTextEntry={viewPass}
              onChangeText={setSenha}
              // keyboardType={typeKeyBoard}
            />

            <TouchableOpacity onPress={onViewPass} style={{ marginLeft: -35 }}>
              {viewPass == true && <Feather name="eye" size={24} color="black" />}
              {viewPass == false && <Feather name="eye-off" size={24} color="black" />}
            </TouchableOpacity>

          </View>
        </View>

        {/* CONFIRMAR SENHA */}
        <View style={styles.grupoInput}>
          <Text style={[styles.rotulo, { color: theme.text }]}>Confirmar Senha</Text>
          {erroSenhaConfirma ? <Text style={styles.erro}>{erroSenhaConfirma}</Text> : null}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              style={[styles.input, { backgroundColor: theme.input, borderColor: theme.border, color: theme.text }]}
              placeholder="Confirme a senha..."
              placeholderTextColor={theme.textSecondary}
              value={senhaConfirma}
              secureTextEntry={viewPassConfirma}
              onChangeText={setSenhaConfirma}
            />

            <TouchableOpacity onPress={onViewPassConfirmar} style={{ marginLeft: -35 }}>
              {viewPassConfirma == true && <Feather name="eye" size={24} color="black" />}
              {viewPassConfirma == false && <Feather name="eye-off" size={24} color="black" />}
            </TouchableOpacity>
          </View>
        </View>

        {/* GÊNERO */}
        <View style={styles.grupoInput}>
          <Text style={[styles.rotulo, { color: theme.text }]}>Gênero</Text>
          <View style={styles.opcoesGenero}>
            {opcoesGenero.map((op) => (
              <Pressable key={op} style={styles.botaoOpcao} onPress={() => setGenero(op)}>
                <View style={[
                  styles.radioExterno,
                  { borderColor: theme.text },
                  genero === op && { borderColor: theme.buttonColor }
                ]}>
                  {genero === op && <View style={[styles.radioInterno, { backgroundColor: theme.buttonColor }]} />}
                </View>
                <Text style={[styles.textoOpcao, { color: theme.text }]}>{op}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* TERMOS */}
        <View style={styles.containerTermos}>
          <CheckBox
            value={concordoTermos}
            onValueChange={setConcordoTermos}
            tintColors={{ true: theme.buttonColor, false: theme.textSecondary }}
            style={styles.checkbox}
          />
          <Text style={[styles.textoTermos, { color: theme.text }]}>
            Concordo com os{' '}
            <Text style={[styles.termosLink, { color: theme.primary }]}
              onPress={() => navigation.navigate('Politica')}>
              termos de uso
            </Text>
          </Text>
        </View>

        {/* ⭐ EXIBE TODOS OS ERROS */}
        {errosLista.length > 0 && (
          <View style={{ marginBottom: 10 }}>
            {errosLista.map((err, index) => (
              <Text key={index} style={styles.erro}>• {err}</Text>
            ))}
          </View>
        )}

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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingTop: 20,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    position: 'relative',
  },
  iconeCabecalho: {
    position: 'absolute',
    left: 0,
    padding: 6,
  },
  textoCabecalho: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2D3748',
    textAlign: 'center',
  },
  containerLogo: {
    alignItems: 'center',
    marginBottom: 16,
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
    marginBottom: 4,
  },
  input: {
    width: '100%',
    height: 42,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  erro: {
    color: 'red',
    fontSize: 14,
    marginBottom: 5,
  },
  opcoesGenero: {
    flexDirection: 'row',
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  radioInterno: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  textoOpcao: {
    fontSize: 11,
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
  },
  termosLink: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  botaoPrimario: {
    width: '100%',
    height: 45,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  botaoDesativado: {
    opacity: 0.4,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  linkLogin: {
    marginTop: 12,
    marginBottom: 20,
  },
  textoLinkLogin: {
    fontSize: 13,
    textAlign: 'center',
  },
  textoLinkLoginNegrito: {
    fontWeight: '600',
  },
});

export default CadastroScreen;