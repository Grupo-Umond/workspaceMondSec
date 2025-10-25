@extends('adm.layouts.admin')

@section('title', 'Ocorrências Cadastradas')

@section('content')
<div class="container py-5">

    <div class="graficosOcorrencia d-flex flex-wrap justify-content-around gap-4">
        <div id="chart-container2Ocorrencia"></div>
        <div id="chart-container1Ocorrencia"></div>
    </div>

    <h1 class="mb-4 text-center">Ocorrências Cadastradas</h1>

    <div class="d-flex flex-wrap justify-content-center gap-3 mb-4">
        <input id="pesquisado" type="text" placeholder="Pesquisar por ID, título ou usuário" class="form-control" style="max-width: 250px;">
        
        <select id="filtroTipo" class="form-select" style="max-width: 200px;">
            <option value="">Filtrar por tipo</option>
        </select>

        <select id="filtroMes" class="form-select" style="max-width: 200px;">
            <option value="">Filtrar por mês</option>
            <option value="1">Janeiro</option>
            <option value="2">Fevereiro</option>
            <option value="3">Março</option>
            <option value="4">Abril</option>
            <option value="5">Maio</option>
            <option value="6">Junho</option>
            <option value="7">Julho</option>
            <option value="8">Agosto</option>
            <option value="9">Setembro</option>
            <option value="10">Outubro</option>
            <option value="11">Novembro</option>
            <option value="12">Dezembro</option>
        </select>
    </div>
    <button type="submit" class="btn btn-primary px-4">Filtrar</button>
                <a href="{{ route('adm.ocorrencia.index') }}" class="btn btn-secondary px-4">Limpar</a>

    <div id="lista-ocorrencias" class="mb-5"></div>

    <a href="{{ route('adm.dashboard.index') }}" class="link-btn">
        <div class="botao mt-5">Voltar ao Painel</div>
    </a>
</div>

<script src="https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"></script>

<style>
    #chart-container1Ocorrencia,
    #chart-container2Ocorrencia {
        height: 45vh;
        width: 45%;
        min-width: 300px;
        background: #fff;
        border-radius: 10px;
        padding: 15px;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        border: 1px solid #ccc;
        padding: 8px;
        text-align: center;
    }

    th {
        font-weight: bold;
    }
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const ocorrencias = @json($ocorrencias);
    const ocorrenciasPorMes = @json($ocorrenciasPorMes);

    const container = document.getElementById('lista-ocorrencias');
    const inputPesquisa = document.getElementById('pesquisado');
    const filtroTipo = document.getElementById('filtroTipo');
    const filtroMes = document.getElementById('filtroMes');

    const tipos = [...new Set(ocorrencias.map(o => o.tipo || 'Não informado'))];
    tipos.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t;
        opt.textContent = t;
        filtroTipo.appendChild(opt);
    });

    function renderTabela() {
        const termo = inputPesquisa.value.toLowerCase();
        const tipoSelecionado = filtroTipo.value;
        const mesSelecionado = filtroMes.value;

        const filtradas = ocorrencias.filter(o => {
            const id = String(o.id || '').toLowerCase();
            const titulo = (o.titulo || '').toLowerCase();
            const usuario = (o.usuario?.nome || '').toLowerCase();
            const tipo = (o.tipo || 'Não informado');
            const dataAcontecimento = o.dataAcontecimento ? new Date(o.dataAcontecimento) : null;
            const mes = dataAcontecimento ? dataAcontecimento.getMonth() + 1 : null;

            const matchTexto = id.includes(termo) || titulo.includes(termo) || usuario.includes(termo);
            const matchTipo = !tipoSelecionado || tipo === tipoSelecionado;
            const matchMes = !mesSelecionado || mes === Number(mesSelecionado);

            return matchTexto && matchTipo && matchMes;
        });

        container.innerHTML = '';
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = [
            'Id','Título','Usuário','Tipo','Data de Postagem','Data de Acontecimento','Latitude','Longitude','Descrição'
        ];
        headers.forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        filtradas.forEach(o => {
            const row = document.createElement('tr');
            const id = o.id || 'sem id';
            const dataPostagem = o.dataPostagem ? new Date(o.dataPostagem).toLocaleDateString() : 'Sem data';
            const dataAcontecimento = o.dataAcontecimento ? new Date(o.dataAcontecimento).toLocaleDateString() : 'Sem data';
            const usuario = o.usuario ? o.usuario.nome : 'Sem usuário';
            const tipo = o.tipo || 'Sem tipo';
            const descricao = o.descricao || 'Sem descrição';
            const latitude = o.latitude || '-';
            const longitude = o.longitude || '-';
            const titulo = o.titulo || 'Sem título';

            [id, titulo, usuario, tipo, dataPostagem, dataAcontecimento, latitude, longitude, descricao].forEach(text => {
                const td = document.createElement('td');
                td.textContent = text;
                row.appendChild(td);
            });

            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        container.appendChild(table);
    }

    inputPesquisa.addEventListener('input', renderTabela);
    filtroTipo.addEventListener('change', renderTabela);
    filtroMes.addEventListener('change', renderTabela);
    renderTabela();

    const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

    const chartMesDom = document.getElementById('chart-container2Ocorrencia');
    if (chartMesDom) {
        const chartMes = echarts.init(chartMesDom);
        chartMes.setOption({
            title: { text: 'Ocorrências por Mês ({{ date("Y") }})', left: 'center' },
            tooltip: { trigger: 'axis' },
            xAxis: { type: 'category', data: meses },
            yAxis: { type: 'value' },
            series: [{
                data: ocorrenciasPorMes.map(v => v || 0),
                type: 'bar',
                barWidth: '60%',
                itemStyle: { color: '#4285F4' }
            }]
        });
        window.addEventListener('resize', () => chartMes.resize());
    }

    const chartTipoDom = document.getElementById('chart-container1Ocorrencia');
    if (chartTipoDom) {
        const chartTipo = echarts.init(chartTipoDom);

        const tiposContagem = {};
        ocorrencias.forEach(o => {
            const tipo = o.tipo || 'Não informado';
            tiposContagem[tipo] = (tiposContagem[tipo] || 0) + 1;
        });

        const dataTipo = Object.entries(tiposContagem).map(([name, value]) => ({ name, value }));

        chartTipo.setOption({
            title: { text: 'Tipos de Ocorrências', left: 'center' },
            tooltip: { trigger: 'item' },
            series: [{
                name: 'Ocorrências',
                type: 'pie',
                radius: '60%',
                center: ['50%', '55%'],
                data: dataTipo,
                label: { color: '#000' },
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.3)'
                }
            }]
        });

        window.addEventListener('resize', () => chartTipo.resize());
    }
});
</script>
@endsection
