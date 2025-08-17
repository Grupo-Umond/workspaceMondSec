import { StyleSheet } from 'react-native';

export default StyleSheet.create({
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
  containerLembrar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  caixaSelecao: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#757575',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  caixaSelecionada: {
    backgroundColor: '#12577B',
    borderColor: '#12577B',
  },
  marcacao: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  textoLembrar: {
    color: '#333',
    fontSize: 14,
  },
  textoSenhaEsquecida: {
    color: '#12577B',
    fontSize: 14,
    fontWeight: '600',
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
  botaoGoogle: {
    width: '100%',
    height: 50,
    backgroundColor: '#12577B',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  iconeGoogle: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  textoBotaoGoogle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
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
