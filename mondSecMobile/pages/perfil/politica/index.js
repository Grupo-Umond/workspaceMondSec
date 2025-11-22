import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from "../../../services/themes/themecontext";

const PoliticaScreen = ({ navigation }) => {
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        
        {/* Cabeçalho */}
        <View style={styles.cabecalho}>
          <Pressable onPress={() => navigation.goBack()} style={styles.iconeCabecalho}>
            <FontAwesome name="arrow-left" size={20} color={theme.title} />
          </Pressable>

          <Text style={[styles.tituloCabecalho, { color: theme.title }]}>
            Nossa Política
          </Text>

          <View style={styles.iconeCabecalho} />
        </View>

        {/* Conteúdo */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={true}
        >
          <Text style={[styles.tituloSecao, { color: theme.primary }]}>
            1. Finalidade do Aplicativo
          </Text>
          <Text style={[styles.textoSecao, { color: theme.text }]}>
            O aplicativo Mondsec tem como objetivo fornecer recursos de segurança e proteção pessoal, 
            permitindo que usuários registrem ocorrências, solicitem ajuda e tenham acesso a recursos de emergência. 
            O aplicativo não substitui serviços de emergência oficiais.
          </Text>

          <Text style={[styles.tituloSecao, { color: theme.primary }]}>
            2. Coleta de Dados
          </Text>
          <Text style={[styles.textoSecao, { color: theme.text }]}>
            A Umond coleta informações como nome, e-mail, localização e dados de contato de emergência 
            fornecidos voluntariamente para melhorar a experiência e personalizar o uso do aplicativo. 
            Dados de localização são coletados apenas quando o usuário ativa funcionalidades relacionadas.
          </Text>

          <Text style={[styles.tituloSecao, { color: theme.primary }]}>
            3. Privacidade e Segurança
          </Text>
          <Text style={[styles.textoSecao, { color: theme.text }]}>
            Seus dados são armazenados de forma segura e nunca serão vendidos a terceiros. 
            O compartilhamento ocorre apenas mediante autorização ou exigência legal. 
          </Text>

          <Text style={[styles.tituloSecao, { color: theme.primary }]}>
            4. Responsabilidade do Usuário
          </Text>
          <Text style={[styles.textoSecao, { color: theme.text }]}>
            O usuário deve fornecer informações verdadeiras, manter credenciais seguras e usar o app de forma legal. 
            É proibido o uso do aplicativo para atividades fraudulentas.
          </Text>

          <Text style={[styles.tituloSecao, { color: theme.primary }]}>
            5. Consentimento
          </Text>
          <Text style={[styles.textoSecao, { color: theme.text }]}>
            Ao usar o aplicativo, o usuário concorda com a coleta, armazenamento e uso de seus dados conforme descrito nesta política.
          </Text>

          <Text style={[styles.tituloSecao, { color: theme.primary }]}>
            6. Atualizações da Política
          </Text>
          <Text style={[styles.textoSecao, { color: theme.text }]}>
            Podemos atualizar esta política periodicamente. Alterações serão notificadas no aplicativo e entrarão em vigor imediatamente após a publicação.
          </Text>

          <Text style={[styles.tituloSecao, { color: theme.primary }]}>
            7. Uso de Recursos de Emergência
          </Text>
          <Text style={[styles.textoSecao, { color: theme.text }]}>
            Recursos de emergência devem ser usados apenas em situações reais de perigo. Uso indevido pode resultar em bloqueio da conta.
          </Text>

          <Text style={[styles.tituloSecao, { color: theme.primary }]}>
            8. Comunicações
          </Text>
          <Text style={[styles.textoSecao, { color: theme.text }]}>
            O aplicativo pode enviar notificações para alertas e mensagens importantes. É responsabilidade do usuário manter as notificações ativas.
          </Text>

          <Text style={[styles.tituloSecao, { color: theme.primary }]}>
            9. Limitações de Responsabilidade
          </Text>
          <Text style={[styles.textoSecao, { color: theme.text }]}>
            Não nos responsabilizamos por perdas, danos ou incidentes resultantes do uso do aplicativo, exceto quando exigido por lei.
          </Text>

          <Text style={[styles.tituloSecao, { color: theme.primary }]}>
            10. Contato e Suporte
          </Text>
          <Text style={[styles.textoSecao, { color: theme.text }]}>
            Em caso de dúvidas ou problemas, o usuário pode entrar em contato com nossa equipe de suporte pelo e-mail contatoumond@gmail.com.
          </Text>
        </ScrollView>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50
  },
  cabecalho: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20 
  },
  tituloCabecalho: { 
    fontSize: 20,
    fontWeight: '600'
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
    marginTop: 15,
    marginBottom: 5
  },
  textoSecao: { 
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'justify',
    marginBottom: 10
  }
});

export default PoliticaScreen;
