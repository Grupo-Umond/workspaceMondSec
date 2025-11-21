import UrlService from '../UrlService';

export async function buscarOcorrencias() {
  try {
    const r = await UrlService.get('/ocorrencia/getall');
    return Array.isArray(r?.data?.ocorrencias) ? r.data.ocorrencias : r.data;
  } catch (e) {
    console.warn('Erro ao puxar ocorrências:', e);
    return [];
  }
}
