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

       <div class="graficosUsuarios">

    <div id="chart-container1Usuarios" style="height:45vh;"></div>
    <div id="chart-container2Usuarios" style="height:45vh; margin-top: 40px;"></div>

    <script src="https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js"></script>
    <script>
        // ======== 1º GRÁFICO: Usuários por mês ========
        var meses = @json(collect($dadosPorMes)->pluck('mes'));
        var totais = @json(collect($dadosPorMes)->pluck('total'));

        var chart1 = echarts.init(document.getElementById('chart-container1Usuarios'));
        var option1 = {
            title: {
                text: 'Usuários cadastrados nos últimos 12 meses',
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
                type: 'line',
                smooth: true,
                itemStyle: { color: '#4B91F1' }
            }]
        };
        chart1.setOption(option1);
        window.addEventListener('resize', chart1.resize);

        // ======== 2º GRÁFICO: Distribuição por gênero ========
        var generos = @json(collect($dadosGenero)->pluck('genero'));
        var totaisGenero = @json(collect($dadosGenero)->pluck('total'));

        var chart2 = echarts.init(document.getElementById('chart-container2Usuarios'));
        var option2 = {
            title: {
                text: 'Distribuição por Gênero',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'horizontal',
                bottom: 0
            },
            series: [{
                name: 'Usuários',
                type: 'pie',
                radius: '60%',
                data: generos.map((g, i) => ({ name: g, value: totaisGenero[i] })),
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };
        chart2.setOption(option2);
        window.addEventListener('resize', chart2.resize);
    </script>

</div>



        <a href="{{ route('adm.dashboard.index') }}" class="link-btn">
            <div class="botao">Voltar ao Painel</div>
        </a>
    </div>
@endsection