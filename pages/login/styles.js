import { StyleSheet } from 'react-native';
import color from '../../Elementos/Paleta';

export default StyleSheet.create({
 container: {
    flex: 1,
    position: 'relative',
    backgroundColor: color.Azul,
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
    backgroundColor: color.Azul,
  },
  metadeInferior: {
    backgroundColor: color.AzulClaro,
    borderRadius: 25,
  },

  footer: {
    backgroundColor: color.AzulClaro,
    width: "100%",
    height: 20,
  },

  containerConteudo: {
    flex: 1,
    paddingHorizontal: 20,
    marginHorizontal: 25,
    marginTop: 80,
    marginBottom: 80,
    zIndex: 1,
    backgroundColor: color.Branco,
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
    color: color.AzulEscuro,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  textoEntrar: {
    fontSize: 20,
    fontWeight: 'bold',
    color: color.AzulEscuro,
    textAlign: 'center',
    marginBottom: 20,
  },
  containerInput: {
    marginBottom: 5,
  },
  rotulo: {
    fontSize: 14,
    fontWeight: '600',
    color: color.AzulEscuro,
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
    borderColor: color.Cinza,
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  caixaSelecionada: {
    backgroundColor: color.Azul,
    borderColor: color.Azul,
  },
  marcacao: {
    color: color.Branco,
    fontSize: 12,
  },
  textoLembrar: {
    color: color.Cinza,
    fontSize: 14,
  },
  textoSenhaEsquecida: {
    color: color.Azul,
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
    backgroundColor: color.Azul,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    alignSelf: 'center',
  },
  textoBotaoLogin: {
    color: color.Branco,
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
    backgroundColor: color.Cinza,
    /*backgroundColor: '#E0E0E0',*/
  },
  textoDivisor: {
    /*color: '#757575',*/
    color: color.Cinza,
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 10,
  },
  botaoGoogle: {
    width: '100%',
    height: 50,
    backgroundColor: color.Azul,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: color.Branco,
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
    color: color.Branco,
    fontSize: 18,
    fontWeight: '600',
  },
  linkCadastro: {
    marginTop: 10,
  },
  textoLinkCadastro: {
    color: color.Cinza,
    fontSize: 14,
    textAlign: 'center',
  },
  destaqueLinkCadastro: {
    color: color.Azul,
    fontWeight: '600',
  },
});
