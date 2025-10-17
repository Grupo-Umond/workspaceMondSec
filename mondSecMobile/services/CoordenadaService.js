import axios from "axios";

export async function CoordenadaService(address) {
  const api = axios.create({
    baseURL: 'http://192.168.1.4:3000',
  });
  try {
    if (!address) throw new Error("Endereço vazio");

    const response = await api.get("/geocode", {
      params: { address }
    });

    console.log("Resposta Nominatim:", response.data);

    let lat, lon;
    if (Array.isArray(response.data) && response.data.length > 0) {
      ({ lat, lon } = response.data[0]);
    } else if (response.data.lat && response.data.lon) {
      ({ lat, lon } = response.data);
    } else {
      throw new Error("Endereço não encontrado");
    }

    return { latitude: parseFloat(lat), longitude: parseFloat(lon) };

  } catch (error) {
    console.error("Erro ao buscar coordenadas:", error.message || error);
    throw error;
  }
}
