
const icons = {
  azul: require("../assets/icones/iconeAzul.png"),
  amarelo: require("../assets/icones/iconeAmarelo.png"),
  roxo: require("../assets/icones/iconeRoxo.png"),
  laranja: require("../assets/icones/iconeLaranja.png"),
  vermelho: require("../assets/icones/iconeVermelho.png"),
  default: require("../assets/icones/default.png"),
};

const azul = [
  "Fiscalização eletrônica em operação",
  "Blitz policial",
  "Semáforo piscando",
  "Sinalização danificada",
  "Falha em radar ou câmera de trânsito",
  "Pane em semáforo inteligente",
  "Trilhos bloqueando travessia",
  "Via sem luz à noite",
  "Lâmpadas queimadas em cruzamento",
  "Materiais de construção na via",
  "Vidros espalhados na pista",
  "Galho grande na pista",
  "Animal silvestre na via",
  "Insetos em enxame na rodovia",
  "Ônibus quebrado bloqueando faixa",
  "Veículo abandonado na pista",
  "Entulho ou lixo bloqueando faixa",
];


const amarelo = [
  "Buraco em via",
  "Afundamento de asfalto",
  "Erosão em calçada ou pista",
  "Desabamento parcial de muro",
  "Fios caídos na via",
  "Falha de energia afetando cruzamento",
  "Falha de iluminação pública",
  "Nevoeiro intenso",
  "Fumaça na pista",
  "Areia ou poeira reduzindo visibilidade",
  "Chuva intensa",
  "Vendaval derrubando objetos",
  "Vandalismo",
  "Poste caído",
  "Protesto bloqueando via",
  "Manifestação com interdição parcial",
  "Tumulto em evento próximo à via",
  "Trânsito desviado por evento público",
  "Rota bloqueada por evento esportivo",
  "Fechamento de rua para show ou feira",
];


const laranja = [
  "Colisão entre carros",
  "Furto de peças de veículo",
  "Animal de grande porte na pista",
  "Atropelamento de animal",
  "Curto-circuito em fiação",
  "Vazamento de água com risco de buraco",
  "Vazamento de óleo na pista",
  "Trecho interditado por obras",
  "Bloqueio parcial por manutenção",
  "Semáforo apagado",
  "Caminhão com carga espalhada na pista",
  "Painel publicitário caído",
  "Telhado ou estrutura metálica na rua",
];


const roxo = [
  "Agressão",
  "Briga de rua",
  "Atropelamento de pedestre",
  "Capotamento",
  "Veículo incendiado",
  "Explosão de transformador",
  "Vazamento de gás em rua",
  "Vazamento químico",
  "Deslizamento de terra em estrada",
  "Cratera aberta na pista",
  "Desabamento de ponte ou viaduto",
  "Poste caído",
  "Afogamento em passagem alagada",
  "Polícia técnica interditando local",
  "Perseguição policial",
  "Bloqueio policial",
];


const vermelho = [
  "Assalto",
  "Tentativa de assalto",
  "Roubo de veículo",
  "Troca de tiros",
  "Disparo de arma de fogo",
  "Latrocínio",
  "Sequestro",
  "Explosão veicular",
  "Tornado",
  "Furacão atingindo região",
  "Ciclone com interdição de vias",
  "Tsunami",
  "Terremoto",
  "Nevasca",
  "Tempestade forte",
  "Incêndio",
  "Curto-circuito com fogo",
  "Pedestre desmaiado na calçada",
  "Helicóptero sobrevoando área policial",
  "Desabamento de ponte ou viaduto",
];


export function getIconColorForTipo(tipo) {
  if (!tipo) return "azul";

  const key = String(tipo).trim();

  if (vermelho.includes(key)) return "vermelho";
  if (laranja.includes(key)) return "laranja";
  if (roxo.includes(key)) return "roxo";
  if (amarelo.includes(key)) return "amarelo";
  if (azul.includes(key)) return "azul";

  return "azul";
}

export function getIconForTipo(tipo) {
  const color = getIconColorForTipo(tipo);
  return icons[color] || icons.default;
}
