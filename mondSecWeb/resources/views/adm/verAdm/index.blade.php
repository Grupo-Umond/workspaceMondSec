@extends('adm.layouts.admin')

@section('title', 'View')

@section('content')
    <div class="container py-5">
        <div class="parteCima">
            <h1 class="mb-4">Admins Cadastrados</h1>
            <div class="graficos">
            
                <style>
                    .graficos {
                        display: flex;
                    }
                </style>
                <!-- <h2>ADM´s cadastrados</h2> -->
            
                    <div id="chart-container1"></div>
                    <script src="https://echarts.apache.org/en/js/vendors/echarts/dist/echarts.min.js"></script>
            
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                    }
            
                    #chart-container1 {
                        /* position: relative; */
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
            
            
                <div id="chart-container2"></div>
                <script src="https://echarts.apache.org/en/js/vendors/echarts/dist/echarts.min.js"></script>
            
                <style>
                    #chart-container2 {
                        /* position: relative; */
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
                            subtext: '',
                            left: 'center'
                        },
                        tooltip: {
                            trigger: 'item'
                        },
                        legend: {
                            orient: 'horizontal',
                            left: 'center'
                        },
                        series: [
                            {
                                name: 'Access From',
                                type: 'pie',
                                radius: '50%',
                                data: [
                                    { value: 1048, name: 'Search Engine' },
                                    { value: 735, name: 'Direct' },
                                    { value: 580, name: 'Email' },
                                    { value: 484, name: 'Union Ads' },
                                    { value: 300, name: 'Video Ads' }
                                ],
                                emphasis: {
                                    itemStyle: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
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
            
            @method(`DELETE`)
            @if($admins->isEmpty())
            <div class="alert alert-warning">Nenhum admin cadastrado.</div>
            @else
            <table>
                    <thead class="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Telefone</th>
                            <th>Nivel de Acesso</th>
                            <th>Data de Criação</th>
                            <th class="as1"></th>
                            <th class="as"></th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($admins as $admin)
                            <tr>
                                <td>{{ $admin->id }}</td>
                                <td>{{ $admin->nome }}</td>
                                <td>{{ $admin->email }}</td>
                                <td>{{ $admin->telefone }}</td>
                                <td>{{ $admin->nivelAdmin }}</td>
                                <td>{{ $admin->created_at->format('d/m/Y H:i') }}</td>
                                <td class="editarADM"><a href="{{ route('adm.admins.edit', $admin->id)}}">
                                        <i class="fa-solid fa-pencil"></i>
                                    </a></td>

                                <td class="excluirADM">
                                    <form action="{{ route('adm.admins.destroy', $admin->id) }}" method="POST"
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
            <a href="{{ route('adm.dashboard.index') }}" class="link-btn">
    <div class="botao">Voltar ao Painel</div>
</a>
        </div>


    </div>
</body>
@endsection