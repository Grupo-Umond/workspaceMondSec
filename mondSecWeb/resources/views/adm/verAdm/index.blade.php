@extends('adm.layouts.admin')

@section('title', 'Admins')

@section('content')
<div class="container py-5">
    <div class="parteCima">
        <div class="graficosAdministradores mb-4">
            <div id="chart-container1Administradores" style="height:45vh;"></div>
            <div id="chart-container2Administradores" style="height:45vh; margin-top: 20px;"></div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js"></script>
        <script>
            const chart1 = echarts.init(document.getElementById('chart-container1Administradores'));
            const meses = @json(collect($dadosPorMes)->pluck('mes'));
            const totais = @json(collect($dadosPorMes)->pluck('total'));
            chart1.setOption({
                title: { text: 'Admins cadastrados nos últimos 12 meses', left: 'center' },
                tooltip: { trigger: 'axis' },
                xAxis: { type: 'category', data: meses },
                yAxis: { type: 'value' },
                series: [{ data: totais, type: 'bar', barWidth: '50%', itemStyle: { color: '#4B91F1' } }]
            });
            window.addEventListener('resize', chart1.resize);

            const chart2 = echarts.init(document.getElementById('chart-container2Administradores'));
            const distribuicao = @json($distribuicaoNivel);
            const dadosPizza = Object.keys(distribuicao).map(nivel => ({ value: distribuicao[nivel], name: nivel }));
            chart2.setOption({
                title: { text: 'Distribuição de níveis de acesso', left: 'center' },
                tooltip: { trigger: 'item' },
                legend: { bottom: 0 },
                series: [{ name: 'Nível', type: 'pie', radius: '50%', data: dadosPizza, emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.5)' } } }]
            });
            window.addEventListener('resize', chart2.resize);
        </script>

        <h1 class="mb-4">Admins Cadastrados</h1>

        <div class="d-flex flex-wrap gap-3 mb-4 justify-content-center">
            <input id="pesquisaAdmin" type="text" class="form-control w-auto" placeholder="Pesquisar por nome, e-mail ou ID">
            <select id="filtroNivel" class="form-select w-auto">
                <option value="">Todos os níveis</option>
            </select>
        </div>

        <div id="lista-admins"></div>

        <a href="{{ route('adm.dashboard.index') }}" class="btn btn-outline-primary mt-3">Voltar ao Painel</a>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const admins = @json($admins);
    const container = document.getElementById('lista-admins');
    const input = document.getElementById('pesquisaAdmin');
    const filtroNivel = document.getElementById('filtroNivel');

    const niveisUnicos = [...new Set(admins.map(a => a.nivelAdmin || 'Não informado'))];
    niveisUnicos.forEach(n => {
        const opt = document.createElement('option');
        opt.value = n;
        opt.textContent = n;
        filtroNivel.appendChild(opt);
    });

    function renderTabela() {
        const termo = input.value.toLowerCase();
        const nivelSelecionado = filtroNivel.value;

        const filtrados = admins.filter(a => {
            const id = String(a.id).toLowerCase();
            const nome = (a.nome || '').toLowerCase();
            const email = (a.email || '').toLowerCase();
            const nivel = a.nivelAdmin || 'Não informado';

            const matchTexto = id.includes(termo) || nome.includes(termo) || email.includes(termo);
            const matchNivel = !nivelSelecionado || nivel === nivelSelecionado;

            return matchTexto && matchNivel;
        });

        container.innerHTML = '';
        if(filtrados.length === 0){
            container.innerHTML = '<div class="alert alert-warning">Nenhum admin encontrado.</div>';
            return;
        }

        const table = document.createElement('table');
        table.classList.add('table','table-striped','table-bordered','text-center','align-middle');

        const thead = document.createElement('thead');
        thead.innerHTML = `<tr>
            <th>ID</th><th>Nome</th><th>Email</th><th>Telefone</th><th>Nível de Acesso</th><th>Data de Criação</th><th></th><th></th>
        </tr>`;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        filtrados.forEach(a => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${a.id}</td>
                <td>${a.nome}</td>
                <td>${a.email}</td>
                <td>${a.telefone || '-'}</td>
                <td>${a.nivelAdmin || '-'}</td>
                <td>${a.created_at || '-'}</td>
                <td>
                    <a href="/adm/admins/${a.id}" class="btn btn-sm btn-warning">
                        <i class="fa-solid fa-pencil"></i>
                    </a>
                </td>
                <td>
                    <form action="/adm/admins/${a.id}" method="POST" onsubmit="return confirm('Tem certeza que quer excluir?');">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="btn btn-sm btn-danger">
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
    filtroNivel.addEventListener('change', renderTabela);
    renderTabela();
});
</script>
@endsection
