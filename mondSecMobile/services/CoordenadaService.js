import axios from "axios";

export async function CoordenadaService(address) {
  const api = axios.create({
        baseURL: 'http://192.168.15.116:3000',


  });

  try {
    if (!address) throw new Error("Endereço vazio");

    const response = await api.get("/geocode", { params: { address } });

    console.log("Resposta Nominatim:", response.data);

    const data = Array.isArray(response.data) ? response.data[0] : response.data;

    if (!data?.lat || !data?.lon) throw new Error("Endereço não encontrado");

    return {
      latitude: parseFloat(data.lat),
      longitude: parseFloat(data.lon),

      amenity: data?.address?.amenity || "",
      display_name: data?.display_name || "",
    };

  } catch (error) {
    console.error("Erro ao buscar coordenadas:", error);
    throw error;
  }
}
