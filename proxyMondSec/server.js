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

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
