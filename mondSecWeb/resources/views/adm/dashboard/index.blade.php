@extends('adm.layouts.admin')

@section('title', 'Dashboard')

@section('content')
<main class="container">
    <section class="cards">
        <div class="card">
            <h3>Usuários</h3>
            <p>{{ $usuariosHomem + $usuariosMulher + $usuariosNaoInformar }}</p>
        </div>
        <div class="card">
            <h3>Com Ocorrência</h3>
            <p>{{ $usuariosComOcorrencia ?? 0 }}</p>
        </div>
        <div class="card">
            <h3>Sem Ocorrência</h3>
            <p>{{ $usuariosSemOcorrencia ?? 0 }}</p>
        </div>
        <div class="card">
            <h3>Este Mês</h3>
            <p>{{ array_sum($usuariosPorMes['data']) }}</p>
        </div>
    </section>

    <section class="graficos">
        <div class="graficosEsquerda">
            <div id="chartUsuariosMes" style="height:38.7vh;"></div>
            <div id="chartOcorrencias" style="height:38.7vh; margin-top:20px;"></div>
        </div>

        <div class="graficosDireita">

            <div id="chartGenero" style="height: 50vh;"></div>
            <div id="chartRadar" style="height:40vh; margin-top:20px;"></div>
        </div>
    </section>
</main>

<script src="https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"></script>

<script>
document.addEventListener('DOMContentLoaded', function() {

    const chart1 = echarts.init(document.getElementById('chartUsuariosMes'));
    chart1.setOption({
        title: { text: 'Usuários Cadastrados por Mês', left: 'center' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: @json($usuariosPorMes['labels']) },
        yAxis: { type: 'value' },
        series: [{
            data: @json($usuariosPorMes['data']),
            type: 'line',
            areaStyle: {},
            smooth: true,
            color: '#4A90E2'
        }]
    });

    const chart2 = echarts.init(document.getElementById('chartOcorrencias'));
    chart2.setOption({
        title: { text: 'Usuários com e sem Ocorrência', left: 'center' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: ['Com Ocorrência', 'Sem Ocorrência'] },
        yAxis: { type: 'value' },
        series: [{
            data: [{{ $usuariosComOcorrencia }}, {{ $usuariosSemOcorrencia }}],
            type: 'bar',
            color: ['#2ecc71']
        }]
    });

    const chart3 = echarts.init(document.getElementById('chartGenero'));
    chart3.setOption({
        title: { text: 'Distribuição por Gênero', left: 'center' },
        tooltip: { trigger: 'item' },
        legend: { bottom: 0 },
        series: [{
            type: 'pie',
            radius: ['40%', '70%'],
            label: { formatter: '{b}: {d}%' },
            data: [
                { value: {{ $usuariosHomem }}, name: 'Masculino' },
                { value: {{ $usuariosMulher }}, name: 'Feminino' },
                { value: {{ $usuariosNaoInformar }}, name: 'Prefiro não informar' },
            ]
        }]
    });

    const chart4 = echarts.init(document.getElementById('chartRadar'));
    chart4.setOption({
        title: { text: 'Exemplo de Radar', left: 'center' },
        legend: { bottom: 0 },
        radar: {
            indicator: [
                { name: 'Atividade', max: 100 },
                { name: 'Engajamento', max: 100 },
                { name: 'Satisfação', max: 100 },
                { name: 'Relatórios', max: 100 },
                { name: 'Feedbacks', max: 100 }
            ]
        },
        series: [{
            name: 'Indicadores',
            type: 'radar',
            data: [
                { value: [80, 70, 65, 90, 50], name: 'Este mês' },
                { value: [60, 55, 70, 65, 40], name: 'Mês anterior' }
            ]
        }]
    });

    window.addEventListener('resize', () => {
        chart1.resize();
        chart2.resize();
        chart3.resize();
        chart4.resize();
    });
});
</script>
@endsection
