import UrlService from '../UrlService';

export async function carregarComentarios(id) {
  try {
    const r = await UrlService.get(`/comentarios/${id}`);
    const lista = Array.isArray(r.data) ? r.data : [];
    return lista.filter(c => c.status !== 'inativo');
  } catch (e) {
    console.warn('Erro ao carregar comentários:', e);
    return [];
  }
}

export async function enviarComentarioRequest(payload) {
  try {
    const res = await UrlService.post('/comentario/comentarios', payload);
    return res?.data ?? null;
  } catch (e) {
    console.warn('Erro ao enviar comentário:', e);
    return null;
  }
}
