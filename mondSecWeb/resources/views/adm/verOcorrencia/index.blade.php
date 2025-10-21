@extends('adm.layouts.admin')

@section('title', 'Ocorrências Cadastradas')

@section('content')
<div class="container py-5">

    <h1 class="mb-4 text-center">Ocorrências Cadastradas</h1>

    <div id="lista-ocorrencias" class="mb-5"></div>

    <div class="graficosOcorrencia d-flex flex-wrap justify-content-around gap-4">
        <div id="chart-container2Ocorrencia"></div>
        <div id="chart-container1Ocorrencia"></div>
    </div>

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
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
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
        background-color: #f4f4f4;
        font-weight: bold;
    }
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const ocorrencias = @json($ocorrencias);
    const ocorrenciasPorMes = @json($ocorrenciasPorMes);

    const container = document.getElementById('lista-ocorrencias');
    container.innerHTML = '';
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = [
        'Título','Usuário','Tipo','Data de Postagem','Data de Acontecimento','Latitude','Longitude','Descrição'
    ];
    headers.forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    ocorrencias.forEach(o => {
        const row = document.createElement('tr');
        const dataPostagem = o.dataPostagem ? new Date(o.dataPostagem).toLocaleDateString() : 'Sem data';
        const dataAcontecimento = o.dataAcontecimento ? new Date(o.dataAcontecimento).toLocaleDateString() : 'Sem data';
        const usuario = o.usuario ? o.usuario.nome : 'Sem usuário';
        const tipo = o.tipo || 'Sem tipo';
        const descricao = o.descricao || 'Sem descrição';
        const latitude = o.latitude || '-';
        const longitude = o.longitude || '-';
        const titulo = o.titulo || 'Sem título';

        [titulo, usuario, tipo, dataPostagem, dataAcontecimento, latitude, longitude, descricao].forEach(text => {
            const td = document.createElement('td');
            td.textContent = text;
            row.appendChild(td);
        });

        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    container.appendChild(table);


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
