@extends('adm.layouts.admin')

@section('title', 'Admins')

@section('content')
<div class="container py-5">
    <div class="parteCima">

        <div class="filtros mb-4">
            <form method="GET" action="{{ route('adm.admins.index') }}" class="d-flex flex-wrap gap-3 align-items-end">

                <div>
                    <label for="busca" class="form-label fw-bold">Nome ou ID:</label>
                    <input type="text" name="busca" id="busca" class="form-control" placeholder="Digite nome ou ID"
                        value="{{ request('busca') }}">
                </div>

                <div>
                    <label for="nivelAdmin" class="form-label fw-bold">Nível:</label>
                    <select name="nivelAdmin" id="nivelAdmin" class="form-select">
                        <option value="">Todos</option>
                        <option value="Ouro" {{ request('nivelAdmin') == 'Ouro' ? 'selected' : '' }}>Ouro</option>
                        <option value="Prata" {{ request('nivelAdmin') == 'Prata' ? 'selected' : '' }}>Prata</option>
                        <option value="Bronze" {{ request('nivelAdmin') == 'Bronze' ? 'selected' : '' }}>Bronze</option>
                    </select>
                </div>

                <div>
                    <label for="mesCriacao" class="form-label fw-bold">Mês de Criação:</label>
                    <select name="mesCriacao" id="mesCriacao" class="form-select">
                        <option value="">Todos</option>
                        @for($m=1;$m<=12;$m++)
                            <option value="{{ $m }}" {{ request('mesCriacao') == $m ? 'selected' : '' }}>
                                {{ DateTime::createFromFormat('!m', $m)->format('F') }}
                            </option>
                        @endfor
                    </select>
                </div>

                <button type="submit" class="btn btn-primary px-4">Filtrar</button>
                <a href="{{ route('adm.admins.index') }}" class="btn btn-secondary px-4">Limpar</a>

            </form>
        </div>

        <div class="graficosAdministradores mb-4">
            <div id="chart-container1Administradores" style="height:45vh;"></div>
            <div id="chart-container2Administradores" style="height:45vh; margin-top: 20px;"></div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js"></script>
        <script>
            var chart1 = echarts.init(document.getElementById('chart-container1Administradores'));
            var meses = @json(collect($dadosPorMes)->pluck('mes'));
            var totais = @json(collect($dadosPorMes)->pluck('total'));
            chart1.setOption({
                title: { text: 'Admins cadastrados nos últimos 12 meses', left: 'center' },
                tooltip: { trigger: 'axis' },
                xAxis: { type: 'category', data: meses },
                yAxis: { type: 'value' },
                series: [{ data: totais, type: 'bar', barWidth: '50%', itemStyle: { color: '#4B91F1' } }]
            });
            window.addEventListener('resize', chart1.resize);

            var chart2 = echarts.init(document.getElementById('chart-container2Administradores'));
            var distribuicao = @json($distribuicaoNivel);
            var dadosPizza = Object.keys(distribuicao).map(nivel => ({ value: distribuicao[nivel], name: nivel }));
            chart2.setOption({
                title: { text: 'Distribuição de níveis de acesso', left: 'center' },
                tooltip: { trigger: 'item' },
                legend: { bottom: 0 },
                series: [{ name: 'Nível', type: 'pie', radius: '50%', data: dadosPizza, emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.5)' } } }]
            });
            window.addEventListener('resize', chart2.resize);
        </script>

        <h1 class="mb-4">Admins Cadastrados</h1>
        @if($admins->isEmpty())
            <div class="alert alert-warning">Nenhum admin cadastrado.</div>
        @else
            <table class="table table-striped table-hover align-middle">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>Nível de Acesso</th>
                        <th>Data de Criação</th>
                        <th></th>
                        <th></th>
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
                            <td>
                                <a href="{{ route('adm.admins.edit', $admin->id) }}" class="btn btn-sm btn-warning">
                                    <i class="fa-solid fa-pencil"></i>
                                </a>
                            </td>
                            <td>
                                <form action="{{ route('adm.admins.destroy', $admin->id) }}" method="POST" onsubmit="return confirm('Tem certeza que quer excluir?');">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn-sm btn-danger">
                                        <i class="fa-solid fa-trash-can"></i>
                                    </button>
                                </form>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif

        <a href="{{ route('adm.dashboard.index') }}" class="btn btn-outline-primary mt-3">Voltar ao Painel</a>
    </div>
</div>
@endsection
