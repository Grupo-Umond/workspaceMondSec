import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
const PORT = 3000;

app.get("/geocode", async (req, res) => {
  const address = req.query.address;
  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: { q: address, format: "json", limit: 1 }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
