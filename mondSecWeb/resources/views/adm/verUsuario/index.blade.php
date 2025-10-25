@extends('adm.layouts.admin')

@section('title', 'View')

@section('content')
<div class="container py-5">
    <div class="graficosUsuarios d-flex flex-wrap justify-content-around gap-4 mb-4">
        <div id="chart-container1Usuarios" style="height:45vh; width:45%; min-width:300px;"></div>
        <div id="chart-container2Usuarios" style="height:45vh; width:45%; min-width:300px;"></div>
    </div>

    <h1 class="mb-4 text-center">Usuários Cadastrados</h1>

    <div class="d-flex flex-wrap gap-3 mb-4 justify-content-center">
        <input id="pesquisaUsuario" type="text" class="form-control w-auto" placeholder="Pesquisar por nome, e-mail ou ID">
        <select id="filtroGenero" class="form-select w-auto">
            <option value="">Todos os Gêneros</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Não informado">Não informado</option>
        </select>
    </div>

    @if($usuario->isEmpty())
        <div class="alert alert-warning">Nenhum usuário cadastrado.</div>
    @else
        <div id="tabelaUsuariosContainer">
            <table id="tabelaUsuarios" class="table table-striped table-bordered text-center align-middle">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>Gênero</th>
                        <th>Data de Criação</th>
                        <th></th>
                        <th></th>
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
                        <td>
                            <a href="{{ route('adm.users.edit', $usuarios->id) }}">
                                <i class="fa-solid fa-pencil"></i>
                            </a>
                        </td>
                        <td>
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
        </div>
    @endif

    <a href="{{ route('adm.dashboard.index') }}" class="link-btn">
        <div class="botao mt-4">Voltar ao Painel</div>
    </a>
</div>

<script src="https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js"></script>

<script>
const meses = @json(collect($dadosPorMes)->pluck('mes'));
const totais = @json(collect($dadosPorMes)->pluck('total'));

const chart1 = echarts.init(document.getElementById('chart-container1Usuarios'));
chart1.setOption({
    title: { text: 'Usuários cadastrados nos últimos 12 meses', left: 'center' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: meses },
    yAxis: { type: 'value' },
    series: [{
        data: totais,
        type: 'line',
        smooth: true,
        itemStyle: { color: '#4B91F1' }
    }]
});
window.addEventListener('resize', chart1.resize);

const generos = @json(collect($dadosGenero)->pluck('genero'));
const totaisGenero = @json(collect($dadosGenero)->pluck('total'));

const chart2 = echarts.init(document.getElementById('chart-container2Usuarios'));
chart2.setOption({
    title: { text: 'Distribuição por Gênero', left: 'center' },
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
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
});
window.addEventListener('resize', chart2.resize);

document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('pesquisaUsuario');
    const filtroGenero = document.getElementById('filtroGenero');
    const linhas = document.querySelectorAll('#tabelaUsuarios tbody tr');

    function filtrar() {
        const termo = input.value.toLowerCase();
        const generoSelecionado = filtroGenero.value;

        linhas.forEach(linha => {
            const colunas = linha.querySelectorAll('td');
            const id = colunas[0]?.textContent.toLowerCase() || '';
            const nome = colunas[1]?.textContent.toLowerCase() || '';
            const email = colunas[2]?.textContent.toLowerCase() || '';
            const genero = colunas[4]?.textContent || '';

            const correspondePesquisa = id.includes(termo) || nome.includes(termo) || email.includes(termo);
            const correspondeGenero = generoSelecionado === '' || genero === generoSelecionado;

            linha.style.display = (correspondePesquisa && correspondeGenero) ? '' : 'none';
        });
    }

    input.addEventListener('input', filtrar);
    filtroGenero.addEventListener('change', filtrar);
});
</script>
@endsection
