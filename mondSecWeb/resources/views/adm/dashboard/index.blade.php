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

    <!-- <section class="graficos"> -->

    <!-- <div class="graficosEsquerda">
                
                <canvas id="lineChart" class="chart-fixed line-size" width="520" height="175"></canvas>
                <canvas id="barChart" class="chart-fixed bar-size" width="520" height="175" ></canvas>
            </div> -->

    <!-- <div class="graficosDireita"> -->
    <!-- <canvas id="pieChart" class="chart-fixed bar-size" width="420" height="170"></canvas> -->

    <section class="graficos">
        <div class="graficosEsquerda">
            <div id="chart-container1"></div>
            <script src="https://echarts.apache.org/en/js/vendors/echarts/dist/echarts.min.js"></script>

            <style>
                #chart-container1 {
                    position: relative;
                    height: 38.7vh;
                    overflow: hidden;
                }
            </style>

            <script>
                var dom = document.getElementById('chart-container1');
                var myChart = echarts.init(dom, null, {
                    renderer: 'canvas',
                    useDirtyRect: false
                });
                var app = {};


                var option;

                option = {
                    title: {
                        text: ' '
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    legend: {
                        data: ['Email']
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: [{
                        type: 'category',
                        boundaryGap: false,
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    }],
                    yAxis: [{
                        type: 'value'
                    }],
                    series: [{
                            name: 'Email',
                            type: 'line',
                            stack: 'Total',
                            areaStyle: {},
                            emphasis: {
                                focus: 'series'
                            },
                            data: [120, 132, 101, 134, 90, 230, 210]
                        },
                    ]
                };

                if (option && typeof option === 'object') {
                    myChart.setOption(option);
                }

                window.addEventListener('resize', myChart.resize);
            </script>

            <div id="chart-container2"></div>
            <script src="https://echarts.apache.org/en/js/vendors/echarts/dist/echarts.min.js"></script>

            <style>
                #chart-container2 {
                    position: relative;
                    height: 38.7vh;
                    overflow: hidden;
                }
            </style>

            <script>
                var dom = document.getElementById('chart-container2');
                var myChart = echarts.init(dom, null, {
                    renderer: 'canvas',
                    useDirtyRect: false
                });
                var app = {};


                var option;

                option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [{
                        type: 'category',
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        axisTick: {
                            alignWithLabel: true
                        }
                    }],
                    yAxis: [{
                        type: 'value'
                    }],
                    series: [{
                        name: 'Direct',
                        type: 'bar',
                        barWidth: '60%',
                        data: [10, 52, 200, 334, 390, 330, 220]
                    }]
                };

                if (option && typeof option === 'object') {
                    myChart.setOption(option);
                }

                window.addEventListener('resize', myChart.resize);
            </script>
        </div>

        <div class="graficosDireita">
        <div id="chart-container3"></div>
            <script src="https://echarts.apache.org/en/js/vendors/echarts/dist/echarts.min.js"></script>

            <style>
                #chart-container3 {
                    position: relative;
                    height: 40vh;
                    overflow: hidden;
                }
            </style>

            <script>
                var dom = document.getElementById('chart-container3');
                var myChart = echarts.init(dom, null, {
                    renderer: 'canvas',
                    useDirtyRect: false
                });
                var app = {};


                var option;

                option = {
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        top: '0%',
                        left: 'center'
                    },
                    series: [{
                        name: 'Access From',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 40,
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [{
                                value: 1048,
                                name: 'Search Engine'
                            },
                            {
                                value: 735,
                                name: 'Direct'
                            },
                            {
                                value: 580,
                                name: 'Email'
                            },
                            {
                                value: 484,
                                name: 'Union Ads'
                            },
                            {
                                value: 300,
                                name: 'Video Ads'
                            }
                        ]
                    }]
                };

                if (option && typeof option === 'object') {
                    myChart.setOption(option);
                }

                window.addEventListener('resize', myChart.resize);
            </script>

            <div id="chart-container4"></div>
            <script src="https://echarts.apache.org/en/js/vendors/echarts/dist/echarts.min.js"></script>

            <style>
                #chart-container4 {
                    position: relative;
                    width: 420px;
                    height: 320px;
                    overflow: hidden;
                    /* flex: 0 0 auto;
                        display: block;
                        border-radius: 12px;
                        background: var(--card-bg);
                        padding: 10px;
                        box-shadow: var(--shadow-1);
                        border: 1px solid rgba(15, 24, 39, 0.03);
                        margin: 0;
                        box-sizing: border-box; */
                }
            </style>

            <script>
                var dom = document.getElementById('chart-container4');
                var myChart = echarts.init(dom, null, {
                    renderer: 'canvas',
                    useDirtyRect: false
                });
                var app = {};


                var option;

                option = {
                    title: {
                        text: ''
                    },
                    legend: {
                        data: ['Allocated Budget', 'Actual Spending']
                    },
                    radar: {
                        // shape: 'circle',
                        indicator: [{
                                name: 'Sales',
                                max: 6500
                            },
                            {
                                name: 'Administration',
                                max: 16000
                            },
                            {
                                name: 'Technology',
                                max: 30000
                            },
                            {
                                name: 'Customer Support',
                                max: 38000
                            },
                            {
                                name: 'Development',
                                max: 52000
                            },
                            {
                                name: 'Marketing',
                                max: 25000
                            }
                        ]
                    },
                    series: [{
                        name: 'Budget vs spending',
                        type: 'radar',
                        data: [{
                                value: [4200, 3000, 20000, 35000, 50000, 18000],
                                name: 'Allocated Budget'
                            },
                            {
                                value: [5000, 14000, 28000, 26000, 42000, 21000],
                                name: 'Actual Spending'
                            }
                        ]
                    }]
                };

                if (option && typeof option === 'object') {
                    myChart.setOption(option);
                }

                window.addEventListener('resize', myChart.resize);
            </script>
        </div>

        </div>

    </section>

    </section>

</main>
<!-- 
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels"></script> -->

<!-- <script>
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
    </script>-->


@endsection
