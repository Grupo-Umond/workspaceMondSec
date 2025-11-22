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
        <View style={[styles.metadeFundo, { backgroundColor: theme.primary }]} />
        <View
          style={[
            styles.metadeFundo,
            { backgroundColor: isDarkMode ? theme.card : '#a9cfe5' }
          ]}
        />
      </View>

      {/* CARD */}
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Pressable style={styles.backButton} onPress={() => navigation.navigate('Menu')}>
          <FontAwesome name="arrow-left" size={20} color={theme.primary} />
        </Pressable>

        <Text style={[styles.title, { color: theme.text }]}>Defina sua nova senha</Text>

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
              backgroundColor: theme.inputBackground,
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
              backgroundColor: theme.inputBackground,
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
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={alterarSenha}
          disabled={carregando}
        >
          <Text style={[styles.buttonText, { color: theme.onPrimary }]}>Alterar Senha</Text>
        </TouchableOpacity>
      </View>
    </View>
  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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
    marginLeft: 30,
    marginRight: 30,
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    zIndex: 2,
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginLeft: 15,
    marginBottom: 5,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 5,
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 15,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  error: {
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default AlterarSenhaScreen;