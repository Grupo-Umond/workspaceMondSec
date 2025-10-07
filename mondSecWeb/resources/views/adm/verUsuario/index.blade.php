@extends('adm.layouts.admin')

@section('title', 'View')

@section('content')
    <div class="container py-5">
        <div class="parteCima">
            <h1 class="mb-4">Usuarios Cadastrados</h1>
            @method(`DELETE`)
            @if($usuario->isEmpty())
                <div class="alert alert-warning">Nenhum usuario cadastrado.</div>
            @else
                <table class="table table-striped table-bordered">
                    <thead class="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Telefone</th>
                            <th>Genero</th>
                            <th>Data de Criação</th>
                            <th class="as1"></th>
                            <th class="as"></th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($usuario as $usuarios)
                            <tr>
                                <td>{{ $usuarios->id }}</td>
                                <td>{{ $usuarios->nome }}</td>
                                <td>{{ $usuarios->email }}</td>
                                <td>{{ $usuarios->telefone }}</td>
                                <td>{{ $usuarios->genero }}</td>
                                <td>{{ $usuarios->data }}</td>
                                <td class="editarADM"><a href="{{ route('adm.users.edit', $usuarios->id)}}">
                                        <i class="fa-solid fa-pencil"></i>
                                    </a></td>

                                <td class="excluirADM">
                                    <form action="{{ route('adm.users.destroy', $usuarios->id) }}" method="POST"
                                        onsubmit="return confirm('Tem certeza que quer excluir?');">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="btn btn-danger btn-sm">

                                            <i class="fa-solid fa-trash-can"></i>

                                        </button>
                                    </form>
                                </td>

                            </tr>
                        @endforeach
                    </tbody>
                </table>
            @endif
        </div>

        <div class="graficos">

            <style>
                .graficos {
                    display: flex;
                }
            </style>

            <div id="chart-container1"></div>
            <script src="https://echarts.apache.org/en/js/vendors/echarts/dist/echarts.min.js"></script>

            <style>
                #chart-container1 {
                    position: relative;
                    height: 45vh;
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
                    xAxis: {
                        type: 'category',
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            data: [150, 230, 224, 218, 135, 147, 260],
                            type: 'line'
                        }
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
                    height: 45vh;
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
                    title: {
                        text: '',
                        left: 'center',
                        top: 20,
                        textStyle: {
                            color: '#000'
                        }
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    visualMap: {
                        show: false,
                        min: 80,
                        max: 600,
                        inRange: {
                            colorLightness: [0, 1]
                        }
                    },
                    series: [
                        {
                            name: 'Access From',
                            type: 'pie',
                            radius: '60%',
                            center: ['50%', '50%'],
                            data: [
                                { value: 335, name: 'Direct' },
                                { value: 310, name: 'Email' },
                                { value: 274, name: 'Union Ads' },
                                { value: 235, name: 'Video Ads' },
                                { value: 400, name: 'Search Engine' }
                            ].sort(function (a, b) {
                                return a.value - b.value;
                            }),
                            roseType: 'radius',
                            label: {
                                color: '#000'
                            },
                            labelLine: {
                                lineStyle: {
                                    color: '#000'
                                },
                                smooth: 0.2,
                                length: 10,
                                length2: 20
                            },
                            itemStyle: {
                                color: '#c23531',
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            },
                            animationType: 'scale',
                            animationEasing: 'elasticOut',
                            animationDelay: function (idx) {
                                return Math.random() * 200;
                            }
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
    </div>
@endsection