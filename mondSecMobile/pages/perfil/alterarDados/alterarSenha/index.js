import React, { useState } from 'react';
import { Pressable, View, TextInput, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import UrlService from '../../../../services/UrlService';
import { useTheme } from '../../../../services/themes/themecontext';

const AlterarSenhaScreen = ({ navigation, route }) => {
  const [novaSenha, setNovaSenha] = useState('');
  const [novaSenhaConfirma, setNovaSenhaConfirma] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erroMessage, setErroMessage] = useState('');
  const direcao = route.params?.direcao;
   const { theme, isDarkMode } = useTheme();

  const validarSenhaNova = () => {
    if (!novaSenha || !novaSenhaConfirma) {
      setErroMessage('Digite os campos obrigatorios');
      return false;
    }

    if (novaSenha !== novaSenhaConfirma) {
      setErroMessage('As senhas não são iguais');
      return false;
    }

    if (novaSenha.length < 8 || novaSenhaConfirma.length < 8) {
      setErroMessage('Digite uma senha com 8 ou mais caracteres');
      return false;
    }

    return true;
  };

  const alterarSenha = async () => {
    if (!validarSenhaNova()) {
      return;
    }

    setCarregando(true);

    const tokenTemp = await AsyncStorage.getItem('tokenTemp');
    console.log('token temporario:', tokenTemp);

    const tokenUser = await AsyncStorage.getItem('userToken');
    try {
      const response = await UrlService.put('/usuario/alterar',
        {
          tokenTemp,
          novaSenhaConfirma,
          direcao,
        },
        {
          headers: {
            Authorization: `Bearer ${tokenUser}`,
          },
        }
      );

      const mensagem = response.data.mensagem;
      await AsyncStorage.removeItem('tokenTemp');
      const entrada = AsyncStorage.getItem('entrada');
      if (entrada && entrada === 'saida') {
        navigation.navigate('Login',{mensagem});
      }
      if (tokenUser) {
        navigation.navigate('Menu',{mensagem});
      }
      navigation.navigate('Login',{mensagem});
    } catch (err) {
      console.log(err);
    } finally {
      setCarregando(false);
    }
  };

  return (
     <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Fundo dividido */}
      <View style={styles.containerFundo}>
                <View
                  style={[
                    styles.metadeFundo,
                    { backgroundColor: isDarkMode ? theme.cimaDark : theme.primary }
                  ]}
                />
                <View
                  style={[
                    styles.metadeFundo,
                    { backgroundColor: isDarkMode ? theme.baixoDark : "#9db7c6ff" }
                  ]}
                />
              </View>

      {/* CARD */}
      <View style={[styles.card, { backgroundColor: theme.background }]}>
        <Pressable style={styles.backButton} onPress={() => navigation.navigate('Menu')}>
          <FontAwesome name="arrow-left" size={20} color={theme.title} />
        </Pressable>

        <Text style={[styles.title, { color: theme.title}]}>Defina sua nova senha</Text>

        <View style={styles.logoContainer}>
          <Image
            source={
              isDarkMode
                ? require('../../../../assets/logobranca.png')
                : require('../../../../assets/mondSecLogo.png')
            }
            style={styles.logo}
          />
        </View>

        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Sua nova senha deve ter pelo menos 8 caracteres, incluindo letras e números.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Nova Senha</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.sectionbackground,
              color: theme.text,
              borderColor: theme.border
            }
          ]}
          placeholder="Digite sua nova senha..."
          placeholderTextColor={theme.textSecondary}
          secureTextEntry
          value={novaSenha}
          onChangeText={setNovaSenha}
        />

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Confirmar nova senha</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.sectionbackground,
              color: theme.text,
              borderColor: theme.border
            }
          ]}
          placeholder="Digite a confirmação..."
          placeholderTextColor={theme.textSecondary}
          secureTextEntry
          value={novaSenhaConfirma}
          onChangeText={setNovaSenhaConfirma}
        />

        {erroMessage ? (
          <Text style={[styles.error, { color: theme.danger }]}>{erroMessage}</Text>
        ) : null}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.buttonColor }]}
          onPress={alterarSenha}
          disabled={carregando}
        >
          <Text style={[styles.buttonText, { color: "#fff"}]}>Alterar Senha</Text>
        </TouchableOpacity>
      </View>
    </View>
  
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', // Centraliza o conteúdo verticalmente
    backgroundColor: '#f5f5f5', // Cor de fundo padrão para evitar contraste excessivo
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
  card: {
    marginHorizontal: 20, // Substitui marginLeft e marginRight por margem horizontal
    borderRadius: 16, // Bordas mais suaves
    padding: 20,
    elevation: 6, // Aumenta a elevação para um efeito mais pronunciado
    backgroundColor: '#fff', // Garante um fundo claro para o card
    shadowColor: '#000', // Adiciona sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 2,
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 15,
    padding: 10, // Adiciona padding para facilitar o toque
  },
  title: {
    fontSize: 20, // Aumenta o tamanho da fonte para melhor leitura
    fontWeight: 'bold', // Usa "bold" em vez de "600" para compatibilidade
    textAlign: 'center',
    marginBottom: 15,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20, // Espaçamento maior para separar do título
  },
  logo: {
    width: 120, // Ajusta o tamanho para caber melhor em telas menores
    height: 120,
    resizeMode: 'contain',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666', // Cor mais suave para contraste
    marginBottom: 20,
    paddingHorizontal: 10, // Adiciona padding horizontal para evitar texto muito próximo das bordas
  },
  sectionTitle: {
    fontSize: 16, // Aumenta o tamanho da fonte para acessibilidade
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 15,
    backgroundColor: '#f9f9f9', // Fundo consistente com o design
    borderColor: '#ddd', // Cor de borda mais suave
  },
  button: {
    paddingVertical: 15, // Define padding vertical para botões
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#007bff', // Azul padrão para botões
    marginTop: 10,
    shadowColor: '#000', // Adiciona sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Sombra visível no Android
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16, // Legibilidade melhorada
    color: '#fff',
  },
  error: {
    fontSize: 14,
    color: '#ff4d4f', // Tom de vermelho para mensagens de erro
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default AlterarSenhaScreen;