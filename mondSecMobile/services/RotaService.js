import axios from "axios";

export async function RotaService(origem, destino, avoidPolygons) {
  const body = {
    coordinates: [
      [origem.longitude, origem.latitude],
      [destino.longitude, destino.latitude]
    ],
    avoid_polygons: avoidPolygons
  };

  try {
    console.log("BODY ROTA ===>", JSON.stringify(body, null, 2));

    const response = await axios.post(
      "http://10.245.156.10:3000/rota",

      body,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (err) {
    console.log("Erro RotaService:", err.response?.data || err.message);
    throw err;
  }
}
