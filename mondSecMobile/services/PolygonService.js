
export function pontoParaPoligono(lon, lat, tamanho = 0.0001) {
  return {
    type: "Polygon",
    coordinates: [
      [
        [lon - tamanho, lat - tamanho],
        [lon - tamanho, lat + tamanho],
        [lon + tamanho, lat + tamanho],
        [lon + tamanho, lat - tamanho],
        [lon - tamanho, lat - tamanho] 
      ]
    ]
  };
}
