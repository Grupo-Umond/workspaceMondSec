@extends('adm.layouts.admin')

@section('title', 'View')

@section('content')

    <div id="lista-ocorrencias"></div>

    <div class="graficos">

                <div id="chart-container2"></div>
                <script src="https://echarts.apache.org/en/js/vendors/echarts/dist/echarts.min.js"></script>
                
                <style>
                    #chart-container2 {
                        /* position: relative; */
                        height: 43vh;
                        width: 50%;
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
                        xAxis: [
                            {
                                type: 'category',
                                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                                axisTick: {
                                    alignWithLabel: true
                                }
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                            }
                        ],
                        series: [
                            {
                                name: 'Direct',
                                type: 'bar',
                                barWidth: '60%',
                                data: [10, 52, 200, 334, 390, 330, 220]
                            }
                        ]
                    };
                
                    if (option && typeof option === 'object') {
                        myChart.setOption(option);
                    }
                
                    window.addEventListener('resize', myChart.resize);
                </script>
        <div id="chart-container1"></div>
        <script src="https://echarts.apache.org/en/js/vendors/echarts/dist/echarts.min.js"></script>

        <style>
            #chart-container1 {
                position: relative;
                height: 43vh;
                width: 50%;
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
                    text: ''
                },
                legend: {
                    data: ['Tipos de ocorrencias']
                },
                radar: {
                    // shape: 'circle',
                    indicator: [
                        { name: 'Roubo', max: 6500 },
                        { name: 'Acidente', max: 16000 },
                        { name: 'Incêndio', max: 30000 },
                        { name: 'Outro', max: 38000 }
                    ]
                },
                series: [
                    {
                        name: 'Budget vs spending',
                        type: 'radar',
                        data: [
                            {
                                value: [5000, 14000, 28000, 26000, 42000, 21000],
                                name: 'Tipos de ocorrencias'
                            }
                        ]
                    }
                ]
            };

            if (option && typeof option === 'object') {
                myChart.setOption(option);
            }

            window.addEventListener('resize', myChart.resize);

        </script>

    </div>

    <a href="{{ route('adm.dashboard.index') }}" class="link-btn">
        <div class="botao">Voltar ao Painel</div>
    </a>

    <script>
        const ocorrencias = @json($ocorrencia);

        const container = document.getElementById('lista-ocorrencias');
        container.innerHTML = '';

        const table = document.createElement('table');
        table.style.width = '100%';
        table.setAttribute('border', '1');

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        const headers = ['Título', 'Usuário', 'Tipo', 'Data', 'Descrição'];
        headers.forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Cria o corpo da tabela
        const tbody = document.createElement('tbody');

        ocorrencias.forEach(o => {
            const row = document.createElement('tr');

            const titulo = o.titulo ? o.titulo : 'Sem título';
            const usuario = o.usuario ? o.usuario.nome : 'Sem usuário';
            const tipo = o.tipo_ocorrencia ? o.tipo_ocorrencia.categoria : 'Sem tipo';
            const data = o.data ? o.data : 'Sem data';
            const descricao = o.tipo_ocorrencia ? o.tipo_ocorrencia.descricao : 'Sem descrição';

            [titulo, usuario, tipo, data, descricao].forEach(text => {
                const td = document.createElement('td');
                td.textContent = text;
                row.appendChild(td);
            });

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        container.appendChild(table);
    </script>

@endsection

<h1 class="mb-4">Ocorrencias Cadastradas</h1>