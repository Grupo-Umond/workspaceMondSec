import axios from "axios";

export async function CoordenadaService(address) {
  try {
    if (!address) throw new Error("Endereço vazio");

    const response = await axios.get("http://localhost:3000/geocode", {
      params: {address}
    });

    console.log("Resposta Nominatim:", response.data); 

    if (response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    } else {
      throw new Error("Endereço não encontrado");
    }
  } catch (error) {
    console.error("Erro ao buscar coordenadas:", error);
    throw error;
  }
}
