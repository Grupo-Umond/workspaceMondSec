<canvas id="pieChart" width="400" height="200"></canvas>
<canvas id="lineChart" width="400" height="200"></canvas>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels"></script>

<script>
    const ctxPie = document.getElementById('pieChart');
    const ctxLine = document.getElementById('lineChart');

    new Chart(ctxPie, {
        type: 'pie',
        data: {
            labels: ['Masculino', 'Feminino', 'Não Informado'],
            datasets: [{
                label: 'Usuários',
                data: [{{ $usuariosHomem}}, {{ $usuariosMulher}}, {{ $usuariosNaoInformar}}],
                borderWidth: 0
            }]
        },
        plugins: [ChartDataLabels],
        options: {
            responsive: false,
            maintainAspectRatio: false,
            plugins: {
            legend: {
                position: 'bottom'
            },
            datalabels: {  
                color: 'white',
                formatter: (value, context) => {
                    let sum = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                    let percentage = (value / sum * 100).toFixed(1) + '%';
                    return percentage;
                },
                font: {
                    weight: 'bold',
                    size: 14
                }
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
                borderWidth: 2,
                borderColor: 'blue',
                backgroundColor: 'rgba(0,0,255,0.2)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

</script>
