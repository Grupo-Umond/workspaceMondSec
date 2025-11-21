import axios from "axios";

export async function RotaService(start, end, avoidPolygons) {
  const api = axios.create({
    baseURL: "http://10.122.45.10:3000",
  });

  try {
    if (!start || !end) throw new Error("Coordenadas de início ou fim inválidas");

    const response = await api.post("/rota", {
      coordinates: [
        [start.longitude, start.latitude],
        [end.longitude, end.latitude]
      ],
      avoid_polygons: avoidPolygons
    });

    console.log("Resposta ORS:", response.data);

    const coordinates =
      response.data.features?.[0]?.geometry?.coordinates;

    if (!coordinates) throw new Error("Rota não encontrada");

    return coordinates.map(c => ({
      latitude: c[1],
      longitude: c[0]
    }));

  } catch (error) {
    console.error("Erro ao calcular rota:", error);
    throw error;
  }
}
