

const icons = {
   
  // "Assalto": require("../assets/icones/default.png"),
  // "Tentativa de assalto": require("../assets/icones/default.png"),

  // "Roubo de veículo": require("../assets/icones/RouboDeCarro.svg"),

  // "Furto de peças de veículo": require("../assets/icones/RouboDeCarro.svg"),

  // "Agressão": require("../assets/icones/Briga.png"),
  // "Briga de rua": require("../assets/icones/Briga.png"),

  // "Disparo de arma de fogo": require("../assets/icones/Arma.png"),
  // "Troca de tiros": require("../assets/icones/Arma.png"),

  // "Sequestro": require("../assets/icones/default.png"),
  // "Latrocínio": require("../assets/icones/default.png"),
  // "Vandalismo": require("../assets/icones/default.png"),

  // // --- INFRAÇÃO / SEGURANÇA ---
  // "Furto de cabos elétricos": require("../assets/icones/default.png"),
  // "Bloqueio policial": require("../assets/icones/default.png"),
  // "Perseguição policial": require("../assets/icones/default.png"),
  // "Helicóptero sobrevoando área policial": require("../assets/icones/default.png"),

  // // --- TRÂNSITO ---
  // "Colisão entre carros": require("../assets/icones/default.png"),
  // "Atropelamento de pedestre": require("../assets/icones/default.png"),
  // "Atropelamento de animal": require("../assets/icones/default.png"),
  // "Capotamento": require("../assets/icones/default.png"),
  // "Caminhão com carga espalhada na pista": require("../assets/icones/default.png"),
  // "Veículo incendiado": require("../assets/icones/default.png"),
  // "Explosão veicular": require("../assets/icones/default.png"),
  // "Veículo abandonado na pista": require("../assets/icones/default.png"),
  // "Ônibus quebrado bloqueando faixa": require("../assets/icones/default.png"),

  // // --- CLIMA ---
  // "Tempestade forte": require("../assets/icones/default.png"),
  // "Chuva intensa": require("../assets/icones/default.png"),
  // "Vendaval derrubando objetos": require("../assets/icones/default.png"),
  // "Nevoeiro intenso": require("../assets/icones/default.png"),
  // "Fumaça na pista": require("../assets/icones/default.png"),
  // "Nevasca": require("../assets/icones/default.png"),
  // "Tornado": require("../assets/icones/default.png"),
  // "Furacão atingindo região": require("../assets/icones/default.png"),
  // "Ciclone com interdição de vias": require("../assets/icones/default.png"),
  // "Tsunami": require("../assets/icones/default.png"),
  // "Terremoto": require("../assets/icones/default.png"),
  // "Tremor de terra com rachaduras": require("../assets/icones/default.png"),
  // "Onda de calor afetando pavimento": require("../assets/icones/default.png"),
  // "Areia ou poeira reduzindo visibilidade": require("../assets/icones/default.png"),

  // // --- RISCOS / INCIDENTES ---
  // "Incêndio": require("../assets/icones/default.png"),
  // "Explosão de transformador": require("../assets/icones/default.png"),
  // "Curto-circuito em fiação": require("../assets/icones/default.png"),
  // "Vazamento de gás em rua": require("../assets/icones/default.png"),
  // "Vazamento químico": require("../assets/icones/default.png"),
  // "Vazamento de óleo na pista": require("../assets/icones/default.png"),
  // "Vazamento de água com risco de buraco": require("../assets/icones/default.png"),
  // "Fios caídos na via": require("../assets/icones/default.png"),
  // "Poste caído": require("../assets/icones/default.png"),

  // // --- ESTRUTURA ---
  // "Buraco em via": require("../assets/icones/default.png"),
  // "Afundamento de asfalto": require("../assets/icones/default.png"),
  // "Erosão em calçada ou pista": require("../assets/icones/default.png"),
  // "Deslizamento de terra em estrada": require("../assets/icones/default.png"),
  // "Desabamento parcial de muro em calçada": require("../assets/icones/default.png"),
  // "Desabamento de ponte ou viaduto": require("../assets/icones/default.png"),
  // "Rachadura estrutural em via": require("../assets/icones/default.png"),
  // "Cratera aberta na pista": require("../assets/icones/default.png"),

  // // --- OBRAS ---
  // "Trecho interditado por obras": require("../assets/icones/default.png"),
  // "Bloqueio parcial por manutenção": require("../assets/icones/default.png"),
  // "Sinalização danificada": require("../assets/icones/default.png"),
  // "Semáforo apagado": require("../assets/icones/default.png"),
  // "Semáforo piscando": require("../assets/icones/default.png"),
  // "Falta de energia afetando cruzamento": require("../assets/icones/default.png"),
  // "Falha de iluminação pública": require("../assets/icones/default.png"),
  // "Via sem luz à noite": require("../assets/icones/default.png"),
  // "Lâmpadas queimadas em cruzamento": require("../assets/icones/default.png"),

  // // --- OBSTÁCULOS NA VIA ---
  // "Queda de árvore bloqueando pista": require("../assets/icones/default.png"),
  // "Galho grande na pista": require("../assets/icones/default.png"),
  // "Entulho ou lixo bloqueando faixa": require("../assets/icones/default.png"),
  // "Materiais de construção na via": require("../assets/icones/default.png"),
  // "Painel publicitário caído": require("../assets/icones/default.png"),
  // "Telhado ou estrutura metálica na rua": require("../assets/icones/default.png"),
  // "Vidros espalhados na pista": require("../assets/icones/default.png"),

  // // --- ANIMAIS ---
  // "Animal de grande porte na pista": require("../assets/icones/default.png"),
  // "Animal silvestre na via": require("../assets/icones/default.png"),
  // "Insetos em enxame na rodovia": require("../assets/icones/default.png"),

  // // --- EVENTOS / PROTESTOS ---
  // "Protesto bloqueando via": require("../assets/icones/default.png"),
  // "Manifestação com interdição parcial": require("../assets/icones/default.png"),
  // "Tumulto em evento próximo à via": require("../assets/icones/default.png"),
  // "Rota bloqueada por evento esportivo": require("../assets/icones/default.png"),
  // "Fechamento de rua para show ou feira": require("../assets/icones/default.png"),
  // "Marcha, carreata ou desfile bloqueando tráfego": require("../assets/icones/default.png"),
  // "Trânsito desviado por evento público": require("../assets/icones/default.png"),

  // // --- FISCALIZAÇÃO ---
  // "Fiscalização eletrônica em operação": require("../assets/icones/default.png"),
  // "Blitz policial": require("../assets/icones/default.png"),

  // // --- SAÚDE E RESGATE ---
  // "Pedestre desmaiado na calçada": require("../assets/icones/default.png"),
  // "Afogamento em passagem alagada": require("../assets/icones/default.png"),
  // "Polícia técnica interditando local": require("../assets/icones/default.png"),

  // // --- SISTEMAS / ENERGIA ---
  // "Falha em radar ou câmera de trânsito": require("../assets/icones/default.png"),
  // "Pane em semáforo inteligente": require("../assets/icones/default.png"),
  // "Falha de energia em cruzamentos": require("../assets/icones/default.png"),
  // "Trilhos bloqueando travessia": require("../assets/icones/default.png"),

  // Default para qualquer tipo não mapeado

  default: require("../assets/icones/default.png"),
}

export function getIconForTipo(tipo) {
  if (!tipo) return icons.default;
  const key = String(tipo).trim();
  return icons[key] || icons.default;


}  

