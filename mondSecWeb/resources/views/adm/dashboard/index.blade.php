@extends('adm.layouts.admin')

@section('title','Dashboard')

@section('content')
<main class="container">

    <section class="graficos">
        <canvas id="lineChart" class="chart-fixed line-size" width="520" height="320"></canvas>
        <canvas id="barChart"  class="chart-fixed bar-size"  width="420" height="320"></canvas>
        <canvas id="pieChart"  class="chart-fixed bar-size"  width="420" height="320"></canvas>

       </section>

    </section>

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

</main>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels"></script>

<script>
    const ctxPie = document.getElementById('pieChart');
    const ctxLine = document.getElementById('lineChart');
    const ctxBar = document.getElementById('barChart');

    new Chart(ctxPie, {
        type: 'pie',
        data: {
            labels: ['Masculino', 'Feminino', 'Não Informado'],
            datasets: [{
                label: 'Usuários',
                data: [{{ $usuariosHomem }}, {{ $usuariosMulher }}, {{ $usuariosNaoInformar }}],
                borderWidth: 0
            }]
        },
        plugins: [ChartDataLabels],
        options: {
            responsive: false, 
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                datalabels: {  
                    color: 'white',
                    formatter: (value, context) => {
                        let sum = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                        return (value / sum * 100).toFixed(1) + '%';
                    },
                    font: { weight: 'bold', size: 14 }
                }
            }
        }
    });

    new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: @json($usuariosPorMes['labels']),
            datasets: [{
                label: 'Usuários cadastrados',
                data: @json($usuariosPorMes['data']),
                borderColor: 'blue',
                backgroundColor: 'rgba(0,0,255,0.2)',
                fill: true,
                tension: 0.3
            }]
        },
        options: { responsive: false, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
    });

    new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: ['Fizeram Ocorrência', 'Não Fizeram Ocorrência'],
            datasets: [{
                label: 'Usuários',
                data: [{{ $usuariosComOcorrencia ?? 0 }}, {{ $usuariosSemOcorrencia ?? 0 }}],
                borderWidth: 1,
                backgroundColor: ['#4CAF50', '#F44336']
            }]
        },
        options: { responsive: false, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
    });
</script>
@endsection