
export function pontoParaPoligono(lon, lat, tamanho = 0.0002) {
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

export function gerarMultiPoligono(listaPontos) {
  return {
    type: "MultiPolygon",
    coordinates: listaPontos.map(p => {
      const lat = parseFloat(p.latitude);
      const lon = parseFloat(p.longitude);

      const poly = pontoParaPoligono(lon, lat);
      return poly.coordinates;
    })
  };
}
