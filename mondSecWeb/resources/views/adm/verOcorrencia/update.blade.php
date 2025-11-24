@extends('adm.layouts.admin')

@section('title', 'Editar Ocorrência')

@section('content')
<div class="container">
    <h2>Alterar Dados da Ocorrência</h2>

    @if(session('success'))
        <div class="success">{{ session('success') }}</div>
    @endif

    <form id="formUpdate" action="{{ route('adm.ocorrencia.update', $ocorrencia->id) }}" method="POST">
        @csrf
        @method('PUT')

        <label for="titulo">Título da Ocorrência:</label>
        <input type="text" id="titulo" name="titulo" value="{{ old('titulo', $ocorrencia->titulo) }}">
        @error('titulo')
            <div class="error">{{ $message }}</div>
        @enderror

        <label for="tipo">Tipo:</label>
<select id="tipo" name="tipo">
</select>

<script>
  const opcoes = [
    "Assalto em via pública", "Tentativa de assalto", "Roubo de veículo", "Furto de peças de veículo",
    "Agressão em via pública", "Briga de rua", "Troca de tiros", "Disparo de arma de fogo", "Ação criminosa em andamento",
    "Carro suspeito parado na via", "Sequestro relâmpago", "Latrocínio em via", "Vandalismo em via pública",
    "Furto de cabos elétricos", "Bloqueio policial", "Perseguição policial", "Área isolada por investigação",
    "Helicóptero sobrevoando área policial", "Colisão entre carros", "Colisão entre carro e moto",
    "Colisão entre carro e caminhão", "Atropelamento de pedestre", "Atropelamento de ciclista",
    "Engavetamento múltiplo", "Capotamento", "Tombamento de caminhão", "Caminhão com carga espalhada na pista",
    "Moto caída na pista", "Veículo incendiado", "Explosão veicular", "Pane elétrica no veículo parado",
    "Pane mecânica em via", "Veículo abandonado na pista", "Pneu estourado bloqueando faixa",
    "Veículo atravessado em via", "Carro na contramão", "Comboio lento de caminhões",
    "Ônibus quebrado bloqueando faixa", "Cancelas travadas em ferrovia", "Trilhos bloqueando travessia",
    "Tempestade forte", "Chuva intensa com visibilidade reduzida", "Granizo na pista", "Vendaval derrubando objetos",
    "Nevoeiro intenso", "Fumaça na pista", "Neve acumulada em via", "Nevasca", "Gelo na pista",
    "Tornado atingindo estrada", "Furacão atingindo região", "Ciclone com interdição de vias",
    "Tsunami atingindo área costeira", "Terremoto afetando rodovia", "Tremor de terra com rachaduras",
    "Onda de calor afetando pavimento", "Areia ou poeira reduzindo visibilidade", "Incêndio em via pública",
    "Incêndio em veículo", "Incêndio sob viaduto", "Incêndio em poste elétrico", "Explosão de transformador",
    "Curto-circuito em fiação", "Vazamento de gás em rua", "Vazamento químico", "Vazamento de óleo na pista",
    "Vazamento de água com risco de buraco", "Fios caídos na via", "Poste caído", "Buraco em via",
    "Afundamento de asfalto", "Erosão em calçada ou pista", "Deslizamento de terra em estrada",
    "Desabamento parcial de muro em calçada", "Desabamento de ponte ou viaduto",
    "Rachadura estrutural em via", "Cratera aberta na pista", "Trecho interditado por obras",
    "Bloqueio parcial por manutenção", "Sinalização danificada", "Semáforo apagado", "Semáforo piscando",
    "Falta de energia afetando cruzamento", "Falha de iluminação pública", "Via sem luz à noite",
    "Lâmpadas queimadas em cruzamento", "Região com baixa visibilidade", "Queda de árvore bloqueando pista",
    "Galho grande na pista", "Entulho ou lixo bloqueando faixa", "Materiais de construção na via",
    "Painel publicitário caído", "Telhado ou estrutura metálica na rua", "Vidros espalhados na pista",
    "Animal de grande porte na pista", "Rebanho cruzando estrada", "Animal silvestre na via",
    "Insetos em enxame na rodovia", "Protesto bloqueando via", "Manifestação com interdição parcial",
    "Tumulto em evento próximo à via", "Rota bloqueada por evento esportivo",
    "Fechamento de rua para show ou feira", "Marcha, carreata ou desfile bloqueando tráfego",
    "Trânsito desviado por evento público", "Fiscalização eletrônica em operação", "Blitz policial",
    "Controle de velocidade temporário", "Pedestre desmaiado na calçada", "Pessoa caída na rua",
    "Crise médica em via pública", "Ciclista ferido na via", "Afogamento em passagem alagada",
    "Presença de equipe de resgate", "Ambulância parada na via", "Corpo de bombeiros atendendo ocorrência",
    "Polícia técnica interditando local", "Falha em radar ou câmera de trânsito",
    "Pane em semáforo inteligente", "Falha de energia em cruzamentos", "Cancelas travadas em ferrovia",
    "Trilhos bloqueando travessia"
  ];

  const select = document.getElementById("tipo");
  select.appendChild(new Option("", "")); 
  opcoes.forEach(opcao => select.appendChild(new Option(opcao, opcao)));
</script>


        <label for="descricao">Descrição:</label>
        <textarea id="descricao" name="descricao" rows="4">{{ old('descricao', $ocorrencia->descricao) }}</textarea>
        @error('descricao')
            <div class="error">{{ $message }}</div>
        @enderror

        <label for="dataAcontecimento">Data do Acontecimento:</label>
        <input type="date" id="dataAcontecimento" name="dataAcontecimento" value="{{ old('dataAcontecimento', $ocorrencia->dataAcontecimento) }}">
        @error('dataAcontecimento')
            <div class="error">{{ $message }}</div>
        @enderror

        <label for="longitude">Longitude:</label>
        <input type="text" id="longitude" name="longitude" value="{{ old('longitude', $ocorrencia->longitude) }}">
        @error('longitude')
            <div class="error">{{ $message }}</div>
        @enderror

        <label for="latitude">Latitude:</label>
        <input type="text" id="latitude" name="latitude" value="{{ old('latitude', $ocorrencia->latitude) }}">
        @error('latitude')
            <div class="error">{{ $message }}</div>
        @enderror

        <button type="submit">Salvar Alterações</button>
    </form>
</div>
@endsection