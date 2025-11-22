
import axios from "axios";
import UrlService from "./UrlService";
export async function OcorrenciaService() {
  try {
    const response = await UrlService.get("/ocorrencia/getall");
    return response.data;
  } catch (err) {
    console.log("Erro ao buscar ocorrências:", err.message);
    return [];
  }
}
