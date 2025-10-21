@extends('adm.layouts.admin')

@section('title', 'View')

@section('content')
    <div class="container py-5">
        <div class="parteCima">
            <h1 class="mb-4">Admins Cadastrados</h1>
            <div class="graficosAdministradores">
                <!-- <h2>ADM´s cadastrados</h2> -->
            
                    <div id="chart-container1Administradores"></div>
                    <script src="https://echarts.apache.org/en/js/vendors/echarts/dist/echarts.min.js"></script>
            
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                    }
            
                    #chart-container1Administradores {
                        /* position: relative; */
                        height: 45vh;
                        overflow: hidden;
                    }
                </style>
            
                <!-- <script src="https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js"></script> -->
                <script>
                    var dom1 = document.getElementById('chart-container1Administradores');
                    var chart1 = echarts.init(dom1);

                    var meses = @json(collect($dadosPorMes)->pluck('mes'));
                    var totais = @json(collect($dadosPorMes)->pluck('total'));

                    var option1 = {
                        title: {
                            text: 'Admins cadastrados nos últimos 12 meses',
                            left: 'center'
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        xAxis: {
                            type: 'category',
                            data: meses
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [{
                            data: totais,
                            type: 'bar',
                            barWidth: '50%',
                            itemStyle: {
                                color: '#4B91F1'
                            }
                        }]
                    };

                    chart1.setOption(option1);
                    window.addEventListener('resize', chart1.resize);
                </script>

            
            
                <div id="chart-container2Administradores"></div>
                <script src="https://echarts.apache.org/en/js/vendors/echarts/dist/echarts.min.js"></script>
            
                <style>
                    #chart-container2Administradores {
                        /* position: relative; */
                        height: 45vh;
                        overflow: hidden;
                    }
                </style>
                <script>
                    var dom2 = document.getElementById('chart-container2Administradores');
                    var chart2 = echarts.init(dom2);

                    var distribuicao = @json($distribuicaoNivel);

                    var dadosPizza = Object.keys(distribuicao).map(function(nivel) {
                        return { value: distribuicao[nivel], name: nivel };
                    });

                    var option2 = {
                        title: {
                            text: 'Distribuição de níveis de acesso',
                            left: 'center'
                        },
                        tooltip: {
                            trigger: 'item'
                        },
                        legend: {
                            bottom: 0
                        },
                        series: [
                            {
                                name: 'Nível',
                                type: 'pie',
                                radius: '50%',
                                data: dadosPizza,
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

                    chart2.setOption(option2);
                    window.addEventListener('resize', chart2.resize);
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