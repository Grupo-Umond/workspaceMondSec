import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

/* ============================================================
   GEOCODE (Nominatim)
============================================================ */
app.get("/geocode", async (req, res) => {
  const address = req.query.address;

  if (!address) {
    return res.status(400).json({ error: "Endereço vazio" });
  }

  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: address,
        format: "json",
        addressdetails: 1,
        countrycodes: "br",
        limit: 5
      },
      headers: {
        "User-Agent": "SeuAppDeCoordenadas/1.0 (andreaccioly@exemplo.com)"
      }
    });

    res.json(response.data);
  } catch (err) {
    console.error("Erro no geocode:", err.message);
    res.status(500).json({ error: "Erro ao buscar coordenadas" });
  }
});

/* ============================================================
   REVERSE GEOCODE (Nominatim)
============================================================ */
app.get('/reverse-geocode', async (req, res) => {
  const { lat, lon } = req.query;

  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Erro no reverse geocoding:', error.message);
    res.status(500).json({ error: 'Erro ao buscar endereço' });
  }
});

/* ============================================================
   ROTA (OpenRouteService)
============================================================ */
app.post("/rota", async (req, res) => {
  const { coordinates, avoid_polygons } = req.body;

  if (!coordinates) {
    return res.status(400).json({ error: "Coordenadas não enviadas" });
  }

  try {
    const response = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      {
        coordinates,
        options: {
          avoid_polygons
        }
      },
      {
        headers: {
          Authorization: process.env.ORS_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("Erro ao buscar rota ORS:", err.response?.data || err.message);
    res.status(500).json({ error: "Erro ao calcular rota" });
  }
});


/* ============================================================
   START SERVER
============================================================ */
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
