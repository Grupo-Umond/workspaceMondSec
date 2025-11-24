@extends('adm.layouts.admin')

@section('title', 'Ocorrências Cadastradas')

@section('content')
    <div class="container py-5">

        <div class="graficosOcorrencia d-flex flex-wrap justify-content-around gap-4 mb-4">
            <div id="chart-container1Ocorrencia" style="height:45vh; width:45%; min-width:300px;"></div>
            <div id="chart-container2Ocorrencia" style="height:45vh; width:45%; min-width:300px;"></div>
        </div>

        <h1 class="mb-4 text-center">Ocorrências Cadastradas</h1>

        <div id="pesquisas" class="d-flex flex-wrap gap-3 mb-4 justify-content-center">
            <input id="pesquisado" type="text" class="form-control w-auto"
                placeholder="Pesquisar por ID, título ou usuário">

            <select id="filtroTipo" class="form-select w-auto">
                <option value="">Todos os Tipos</option>
            </select>

            <select id="filtroMes" class="form-select w-auto">
                <option value="">Todos os Meses</option>
                <option value="1">Janeiro</option>
                <option value="2">Fevereiro</option>
                <option value="3">Março</option>
                <option value="4">Abril</option>
                <option value="5">Maio</option>
                <option value="6">Junho</option>
                <option value="7">Julho</option>
                <option value="8">Agosto</option>
                <option value="9">Setembro</option>
                <option value="10">Outubro</option>
                <option value="11">Novembro</option>
                <option value="12">Dezembro</option>
            </select>
        </div>

        <div id="lista-ocorrencias"></div>

        <div class="botoesFinais">
            <a href="{{ route('adm.dashboard.index') }}" class="link-btn">
                <div id="btnVoltar" class="botao mt-4">Voltar ao Painel</div>
            </a>
            <a href="{{ route('adm.ocorrencia.denuncia') }}" class="link-btn">
                <div id="btnVoltar" class="botao mt-4">Denuncias</div>
            </a>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"></script>

    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const ocorrencias = @json($ocorrencias);
            const ocorrenciasPorMes = @json($ocorrenciasPorMes);

            const container = document.getElementById('lista-ocorrencias');
            const inputPesquisa = document.getElementById('pesquisado');
            const filtroTipo = document.getElementById('filtroTipo');
            const filtroMes = document.getElementById('filtroMes');

            const tiposUnicos = [...new Set(ocorrencias.map(o => o.tipo || 'Não informado'))];
            tiposUnicos.forEach(t => {
                const opt = document.createElement('option');
                opt.value = t;
                opt.textContent = t;
                filtroTipo.appendChild(opt);
            });

            function renderTabela() {
                const termo = inputPesquisa.value.toLowerCase();
                const tipoSelecionado = filtroTipo.value;
                const mesSelecionado = filtroMes.value;

                const filtradas = ocorrencias.filter(o => {
                    const id = String(o.id || '').toLowerCase();
                    const titulo = (o.titulo || '').toLowerCase();
                    const usuario = (o.usuario?.nome || '').toLowerCase();
                    const tipo = o.tipo || 'Não informado';
                    const dataAcontecimento = o.dataAcontecimento ? new Date(o.dataAcontecimento) : null;
                    const mes = dataAcontecimento ? dataAcontecimento.getMonth() + 1 : null;

                    const matchTexto = id.includes(termo) || titulo.includes(termo) || usuario.includes(termo);
                    const matchTipo = !tipoSelecionado || tipo === tipoSelecionado;
                    const matchMes = !mesSelecionado || mes === Number(mesSelecionado);

                    return matchTexto && matchTipo && matchMes;
                });

                container.innerHTML = '';

                if (filtradas.length === 0) {
                    container.innerHTML = '<div class="alert alert-warning">Nenhuma ocorrência encontrada.</div>';
                    return;
                }

                const table = document.createElement('table');
                table.classList.add('table', 'table-striped', 'table-bordered', 'text-center', 'align-middle');

                const thead = document.createElement('thead');
                thead.innerHTML = `
                <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Usuário</th>
                    <th>Tipo</th>
                    <th>Data de Postagem</th>
                    <th>Data de Acontecimento</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>Descrição</th>
                    <th>Status</th>
                    <th></th>
                    <th></th>
                </tr>
            `;
                table.appendChild(thead);

                const tbody = document.createElement('tbody');
                filtradas.forEach(o => {
                    const dataPostagem = o.dataPostagem ? new Date(o.dataPostagem).toLocaleDateString() : '-';
                    const dataAcontecimento = o.dataAcontecimento ? new Date(o.dataAcontecimento).toLocaleDateString() : '-';

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                    <td>${o.id || '-'}</td>
                    <td>${o.titulo || '-'}</td>
                    <td>${o.usuario ? o.usuario.nome : '-'}</td>
                    <td>${o.tipo || '-'}</td>
                    <td>${dataPostagem}</td>
                    <td>${dataAcontecimento}</td>
                    <td>${o.latitude || '-'}</td>
                    <td>${o.longitude || '-'}</td>
                    <td>${o.descricao || '-'}</td>
                    <td>${o.status || '-'}</td>
                    <td><a href="/adm/ocorrencias/${o.id}" class="btn btn-sm btn-primary"><i class="fa-solid fa-pencil"></i></a></td>
                    <td>
                        <form action="/adm/ocorrencias/excluir/${o.id}" method="POST" onsubmit="return confirm('Tem certeza que quer excluir?');">
                            @csrf
                            @method('PUT')
                            <button type="submit" class="btn btn-sm btn-danger">
                                <i class="fa-solid fa-trash-can btn-excluir"></i>
                            </button>
                        </form>
                    </td>

                `;
                    tbody.appendChild(tr);
                });

                table.appendChild(tbody);
                container.appendChild(table);
            }

            inputPesquisa.addEventListener('input', renderTabela);
            filtroTipo.addEventListener('change', renderTabela);
            filtroMes.addEventListener('change', renderTabela);
            renderTabela();

            // ======== GRÁFICO 1: TIPOS DE OCORRÊNCIA ========
            const chartTipoDom = document.getElementById('chart-container1Ocorrencia');
            const tiposContagem = {};
            ocorrencias.forEach(o => {
                const tipo = o.tipo || 'Não informado';
                tiposContagem[tipo] = (tiposContagem[tipo] || 0) + 1;
            });
            const dataTipo = Object.entries(tiposContagem).map(([name, value]) => ({ name, value }));

            const chartTipo = echarts.init(chartTipoDom);
            chartTipo.setOption({
                title: { text: 'Tipos de Ocorrências', left: 'center' },
                tooltip: { trigger: 'item' },
                legend: { bottom: 0 },
                series: [{
                    name: 'Ocorrências',
                    type: 'pie',
                    radius: '60%',
                    data: dataTipo,
                    emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.5)' } }
                }]
            });
            window.addEventListener('resize', chartTipo.resize);

            const chartMesDom = document.getElementById('chart-container2Ocorrencia');
            const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

            const chartMes = echarts.init(chartMesDom);
            chartMes.setOption({
                title: { text: 'Ocorrências por Mês ({{ date("Y") }})', left: 'center' },
                tooltip: { trigger: 'axis' },
                xAxis: { type: 'category', data: meses },
                yAxis: { type: 'value' },
                series: [{
                    data: ocorrenciasPorMes.map(v => v || 0),
                    type: 'bar',
                    barWidth: '60%',
                    itemStyle: { color: '#4B91F1' }
                }]
            });
            window.addEventListener('resize', chartMes.resize);
        });
    </script>
@endsection