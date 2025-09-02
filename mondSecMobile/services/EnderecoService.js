import axios from "axios";

export async function EnderecoService(lat, lon) {
  try {
    if (!lat || !lon) throw new Error("Latitude ou longitude inválida");

    const response = await axios.get("http://localhost:3000/reverse-geocode", {
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
