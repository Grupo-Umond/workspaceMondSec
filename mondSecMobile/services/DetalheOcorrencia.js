import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { EnderecoService } from "./EnderecoService";
export default function DetalheOcorrencia({ item, isDarkMode, enderecoService, ocorrenciasNoEndereco, comentarios, loadingComentarios }) {
  const [endereco, setEndereco] = useState(null);

  useEffect(() => {
    async function buscar() {
      try {
        console.log("ITEM DETALHADO:", item);
        if (!item) return;

        const lat = parseFloat(item.latitude);
        const lon = parseFloat(item.longitude);

        console.log("VALORES CONVERTIDOS:", lat, lon);

        if (isNaN(lat) || isNaN(lon)) {
            console.warn("Latitude ou longitude inválida");
            return;
        }
        if (!item?.latitude || !item?.longitude) {
          console.log("Item sem latitude/longitude", item);
          return;
        }

        const e = await EnderecoService(
          lat,
          lon
        );

        setEndereco(
  `${e?.road || 'Rua desconhecida'}, ${e?.house_number || 'S/N'}`
);

        console.log(endereco);
      } catch (err) {
        console.log("Erro ao buscar endereço", err);
      }
    }

    buscar();
  }, [item]);

  return (
    <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 16 }}>
      
      {/* TODO o seu código exatamente como mandou */}
      <View >
        <Text>
          {endereco ? endereco : "Carregando endereço..."}
        </Text>
      </View>

    </ScrollView>
  );
}
