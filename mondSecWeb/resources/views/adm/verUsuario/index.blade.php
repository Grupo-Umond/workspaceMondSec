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
        </select>
    </div>

    <div id="lista-usuarios"></div>

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
    series: [{ data: totais, type: 'line', smooth: true, itemStyle: { color: '#4B91F1' } }]
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
        emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.5)' } }
    }]
});
window.addEventListener('resize', chart2.resize);

document.addEventListener('DOMContentLoaded', function() {
    const usuarios = @json($usuario);
    const container = document.getElementById('lista-usuarios');
    const input = document.getElementById('pesquisaUsuario');
    const filtroGenero = document.getElementById('filtroGenero');

    // Preencher select de gêneros
    const generosUnicos = [...new Set(usuarios.map(u => u.genero || 'Não informado'))];
    generosUnicos.forEach(g => {
        const opt = document.createElement('option');
        opt.value = g;
        opt.textContent = g;
        filtroGenero.appendChild(opt);
    });

    function renderTabela() {
        const termo = input.value.toLowerCase();
        const generoSelecionado = filtroGenero.value;

        const filtrados = usuarios.filter(u => {
            const id = String(u.id).toLowerCase();
            const nome = (u.nome || '').toLowerCase();
            const email = (u.email || '').toLowerCase();
            const genero = u.genero || 'Não informado';

            const matchTexto = id.includes(termo) || nome.includes(termo) || email.includes(termo);
            const matchGenero = !generoSelecionado || genero === generoSelecionado;

            return matchTexto && matchGenero;
        });

        container.innerHTML = '';
        if(filtrados.length === 0){
            container.innerHTML = '<div class="alert alert-warning">Nenhum usuário encontrado.</div>';
            return;
        }

        const table = document.createElement('table');
        table.classList.add('table','table-striped','table-bordered','text-center','align-middle');

        const thead = document.createElement('thead');
        thead.innerHTML = `<tr>
            <th>ID</th><th>Nome</th><th>Email</th><th>Telefone</th><th>Gênero</th><th>Data de Criação</th><th></th><th></th>
        </tr>`;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        filtrados.forEach(u => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${u.id}</td>
                <td>${u.nome}</td>
                <td>${u.email}</td>
                <td>${u.telefone || '-'}</td>
                <td>${u.genero || '-'}</td>
                <td>${u.data || '-'}</td>
                <td>
                    <a href="/adm/users/${u.id}/edit">
                        <i class="fa-solid fa-pencil"></i>
                    </a>
                </td>
                <td>
                    <form action="/adm/users/${u.id}" method="POST" onsubmit="return confirm('Tem certeza que quer excluir?');">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="btn btn-danger btn-sm">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </form>
                </td>
            `;
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        container.appendChild(table);
    }

    input.addEventListener('input', renderTabela);
    filtroGenero.addEventListener('change', renderTabela);
    renderTabela();
});
</script>
@endsection
