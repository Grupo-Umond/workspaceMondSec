import UrlService from '../UrlService';

export async function buscarUsuarioLogado() {
  try {
    const r = await UrlService.get('/usuario/buscar');
    return r?.data?.id ?? r?.data?.usuario?.id ?? null;
  } catch (e) {
    console.warn('Erro ao buscar usuário logado:', e);
    return null;
  }
}
