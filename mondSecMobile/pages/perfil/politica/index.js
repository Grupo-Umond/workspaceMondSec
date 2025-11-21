import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const PoliticaScreen = ({ navigation }) => {

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
    <View style={styles.container}>
      
      <View style={styles.cabecalho}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconeCabecalho}>
          <FontAwesome name="arrow-left" size={20} color="#12577B" />
        </Pressable>
        <Text style={styles.tituloCabecalho}>Nossa Política</Text>
        <View style={styles.iconeCabecalho} />
      </View>

  
   <ScrollView
  style={styles.scrollView}
  contentContainerStyle={{ paddingBottom: 120 }}
  showsVerticalScrollIndicator={true}
>
  <Text style={styles.tituloSecao}>1. Finalidade do Aplicativo</Text>
  <Text style={styles.textoSecao}>
    O aplicativo Mondsec tem como objetivo fornecer recursos de segurança e proteção pessoal, 
    permitindo que usuários registrem ocorrências, solicitem ajuda e tenham acesso a recursos de emergência. 
    O aplicativo não substitui serviços de emergência oficiais.
  </Text>

  <Text style={styles.tituloSecao}>2. Coleta de Dados</Text>
  <Text style={styles.textoSecao}>
    A Umond coleta informações como nome, e-mail, localização e dados de contato de emergência 
    fornecidos voluntariamente para melhorar a experiência e personalizar o uso do aplicativo. 
    Dados de localização são coletados apenas quando o usuário ativa funcionalidades relacionadas.
  </Text>

  <Text style={styles.tituloSecao}>3. Privacidade e Segurança</Text>
  <Text style={styles.textoSecao}>
    Seus dados são armazenados de forma segura e nunca serão vendidos a terceiros. 
    O compartilhamento ocorre apenas mediante autorização ou exigência legal. 
  </Text>

  <Text style={styles.tituloSecao}>4. Responsabilidade do Usuário</Text>
  <Text style={styles.textoSecao}>
    O usuário deve fornecer informações verdadeiras, manter credenciais seguras e usar o app de forma legal. 
    É proibido o uso do aplicativo para atividades fraudulentas.
  </Text>

  <Text style={styles.tituloSecao}>5. Consentimento</Text>
  <Text style={styles.textoSecao}>
    Ao usar o aplicativo, o usuário concorda com a coleta, armazenamento e uso de seus dados conforme descrito nesta política.
  </Text>

  <Text style={styles.tituloSecao}>6. Atualizações da Política</Text>
  <Text style={styles.textoSecao}>
    Podemos atualizar esta política periodicamente. Alterações serão notificadas no aplicativo e entrarão em vigor imediatamente após a publicação.
  </Text>

  <Text style={styles.tituloSecao}>7. Uso de Recursos de Emergência</Text>
  <Text style={styles.textoSecao}>
    Recursos de emergência devem ser usados apenas em situações reais de perigo. Uso indevido pode resultar em bloqueio da conta.
  </Text>

  <Text style={styles.tituloSecao}>8. Comunicações</Text>
  <Text style={styles.textoSecao}>
    O aplicativo pode enviar notificações para alertas e mensagens importantes. É responsabilidade do usuário manter as notificações ativas.
  </Text>

  <Text style={styles.tituloSecao}>9. Limitações de Responsabilidade</Text>
  <Text style={styles.textoSecao}>
    Não nos responsabilizamos por perdas, danos ou incidentes resultantes do uso do aplicativo, exceto quando exigido por lei.
  </Text>

  <Text style={styles.tituloSecao}>10. Contato e Suporte</Text>
  <Text style={styles.textoSecao}>
    Em caso de dúvidas ou problemas, o usuário pode entrar em contato com nossa equipe de suporte pelo e-mail contatoumond@gmail.com.
  </Text>
</ScrollView>

    
    </View>

    <SafeAreaView edges={['bottom']} style={styles.navigationContainer}>
        <Pressable
          style={({ pressed }) => [styles.navButton, { opacity: pressed ? 0.6 : 1 }]}
          onPress={() => navigation.navigate('Home')}
        >
          <Icon name="home" size={26} color="#FFFFFF" />
          <Text style={styles.navButtonText}>Início</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.navButton, { opacity: pressed ? 0.6 : 1 }]}
          onPress={() => navigation.navigate('Sobre')}
        >
          <View style={styles.centralButton}>
            <Icon name="info" size={28} color="#003366" />
          </View>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.navButton, { opacity: pressed ? 0.6 : 1 }]}
          onPress={() => navigation.navigate('Menu')}
        >
          <Icon name="person" size={26} color="#FFFFFF" />
          <Text style={styles.navButtonText}>Perfil</Text>
        </Pressable>
      </SafeAreaView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    paddingHorizontal: 20, 
    paddingTop: 30 
  },
  cabecalho: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  tituloCabecalho: { 
    fontSize: 20, 
    fontWeight: '600', 
    color: '#12577B' 
  },
  iconeCabecalho: { 
    width: 24 
  },
  scrollView: { 
    flexGrow: 0 
  },
  tituloSecao: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#12577B', 
    marginTop: 15, 
    marginBottom: 5 
  },
  textoSecao: { 
    fontSize: 14, 
    color: '#333', 
    lineHeight: 20,
    textAlign: 'justify',
    marginBottom: 10
  },
  botoesContainer: { 
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row', 
    justifyContent: 'space-between'
  },
  botaoAceitar: { 
    flex: 1, 
    backgroundColor: '#CCCCCC', 
    padding: 15, 
    borderRadius: 8, 
    marginLeft: 10 
  },
  botaoHabilitado: {
    backgroundColor: '#27AE60',
  },
  botaoRecusar: { 
    flex: 1, 
    backgroundColor: '#CCCCCC', 
    padding: 15, 
    borderRadius: 8, 
    marginRight: 10 
  },
  botaoDesabilitado: {
    backgroundColor: '#E74C3C',
  },
  textoBotao: { 
    color: '#fff', 
    textAlign: 'center', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#003366',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },

  centralButton: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  navButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
  },
});

export default PoliticaScreen;
