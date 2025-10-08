import axios from "axios";

export async function EnderecoService(lat, lon) {
  const api = axios.create({
    baseURL: 'http://192.168.15.116:3000',
  });
  try {
    if (!lat || !lon) throw new Error("Latitude ou longitude inválida");

    const response = await axios.get("/reverse-geocode", {
      params: { lat, lon }
    });

    console.log("Resposta Nominatim:", response.data);

    if (response.data && response.data.address) {
      return response.data.address;
    } else {
      throw new Error("Endereço não encontrado");
    }
  } catch (error) {
    console.error("Erro ao buscar endereço:", error);
    throw error;
  }
}
