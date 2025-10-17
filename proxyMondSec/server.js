import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
const PORT = 3000;

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

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
proxy-google.js
