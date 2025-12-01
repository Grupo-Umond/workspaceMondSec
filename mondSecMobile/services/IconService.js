const icons = {
  amarelo: require("../assets/icones/iconeAmarelo.png"),
  laranja: require("../assets/icones/iconeLaranja.png"),
  vermelho: require("../assets/icones/iconeVermelho.png"),
  default: require("../assets/icones/default.png"),
};

// sua função antiga (se quiser manter comportamento por tipo)
// certifique-se que as variáveis vermelho, laranja, amarelo sejam definidas se usa este caminho
export function getIconColorForTipo(tipo) {
  if (!tipo) return "amarelo";

  const key = String(tipo).trim();

  if (typeof vermelho !== "undefined" && vermelho.includes(key)) return "vermelho";
  if (typeof laranja !== "undefined" && laranja.includes(key)) return "laranja";
  if (typeof amarelo !== "undefined" && amarelo.includes(key)) return "amarelo";

  return "amarelo"; // fallback mais seguro que 'azul'
}

// nova função: decide cor com base na quantidade
function getIconColorFromCount(count) {
  const n = Number(count);
  if (!isFinite(n)) return null;
  if (n <= 1) return "amarelo";
  if (n <= 5) return "laranja";
  return "vermelho";
}

// nova função: prioriza quantidade, senão cai no tipo
export function getIconForTipoWithCount(tipo, count) {
  const countColor = getIconColorFromCount(count);
  if (countColor) return icons[countColor] || icons.default;

  // fallback para comportamento por tipo (se desejar)
  const colorByTipo = getIconColorForTipo(tipo);
  return icons[colorByTipo] || icons.default;
}
