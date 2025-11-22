import React, { useContext, useState } from "react";
import { View, Text, Pressable, Switch, StyleSheet, ScrollView } from 'react-native';
import { AuthContext } from "../../services/AuthContext";
import Slider from '@react-native-community/slider';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from "../../services/themes/themecontext";

const ConfiguracaoScreen = ({ navigation }) => {
  const [notificacao, setNotificacao] = useState(true);
  const [oculto, setOculto] = useState(true);
  const [volumeEfeito, setVolumeEfeito] = useState(100);
  const [volumeNotificacao, setVolumeNotificacao] = useState(100);

  const { logout } = useContext(AuthContext);
  const { isDarkMode, toggleTheme, theme } = useTheme();


  const switchStyle = {
    trackColor: { false: "#888", true: theme.primary },
    thumbColor: isDarkMode ? "#fff" : "#f4f3f4",
    ios_backgroundColor: "#ccc",
    style: { transform: [{ scale: 1.3 }] }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>

      {/* Cabeçalho */}
      <View style={styles.cabecalho}>
        <Pressable
          onPress={() => navigation.navigate('Menu')}
          style={styles.iconeCabecalho}
        >
          <FontAwesome name="arrow-left" size={26} color={theme.title} />
        </Pressable>

        <Text style={[styles.tituloCabecalho, { color: theme.title }]}>
          Configurações
        </Text>
      </View>

      {/* Volume */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.primary }]}>Volume</Text>

        <Text style={{ color: theme.text }}>Efeitos</Text>
        <Slider
          style={styles.slider}
          value={volumeEfeito}
          onValueChange={setVolumeEfeito}
          minimumValue={0}
          maximumValue={100}
        />

        <Text style={[styles.sectionTitle, { color: theme.primary }]}>Notificações</Text>
        <Slider
          style={styles.slider}
          value={volumeNotificacao}
          onValueChange={setVolumeNotificacao}
          minimumValue={0}
          maximumValue={100}
        />
      </View>

      {/* Notificações */}
      <View style={[styles.section, styles.switchRow]}>
        <Text style={[styles.sectionTitle, { color: theme.primary }]}>Notificações</Text>
        <Switch
          value={notificacao}
          onValueChange={setNotificacao}
          {...switchStyle}
        />
      </View>

      {/* Tema Escuro */}
      <View style={[styles.section, styles.switchRow]}>
        <Text style={[styles.sectionTitle, { color: theme.primary }]}>Tema Escuro</Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          {...switchStyle}
        />
      </View>

      {/* Privacidade */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.primary }]}>Dados e Privacidade</Text>

        <View style={styles.switchRow}>
          <Text style={{ color: theme.text }}>Permitir acesso à localização</Text>
          <Switch
            value={oculto}
            onValueChange={setOculto}
            {...switchStyle}
          />
        </View>

        <Pressable onPress={() => navigation.navigate('Sobre')}>
          <Text style={[styles.linkText, { color: theme.primary }]}>
            Ler sobre nós
          </Text>
        </Pressable>
      </View>

      {/* Suporte */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.primary }]}>Suporte</Text>

        <Pressable>
          <Text style={{ color: theme.text }}>Fale conosco</Text>
        </Pressable>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    height:900
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
    paddingHorizontal: 10,
    gap: 80,
  },
  tituloCabecalho: {
    fontSize: 20,
    fontWeight: '600',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  linkText: {
    textDecorationLine: 'underline',
    marginTop: 5,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  }
});

export default ConfiguracaoScreen;
