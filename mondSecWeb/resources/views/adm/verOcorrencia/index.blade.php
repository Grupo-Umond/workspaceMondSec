@extends('adm.layouts.admin')

@section('title', 'Ocorrências Cadastradas')

@section('content')
<div class="container py-5">

    <h1 class="mb-4 text-center">Ocorrências Cadastradas</h1>

    @php
        $podeEditar = in_array(auth('admin')->user()->nivelAdmin, ['prata','ouro']);
    @endphp

    <div id="pesquisas" class="d-flex flex-wrap gap-3 mb-4">
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

<script>
document.addEventListener('DOMContentLoaded', function () {

    const ocorrencias = @json($ocorrencias);
    const podeEditar = @json($podeEditar);

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

            const id = String(o.id).toLowerCase();
            const titulo = (o.titulo || '').toLowerCase();
            const usuario = (o.usuario?.nome || '').toLowerCase();

            const tipo = o.tipo || 'Não informado';
            const dataAco = o.dataAcontecimento ? new Date(o.dataAcontecimento) : null;
            const mes = dataAco ? dataAco.getMonth() + 1 : null;

            return (
                (id.includes(termo) || titulo.includes(termo) || usuario.includes(termo)) &&
                (!tipoSelecionado || tipo === tipoSelecionado) &&
                (!mesSelecionado || mes === Number(mesSelecionado))
            );
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
            <th>Data Postagem</th>
            <th>Data Acontecimento</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Descrição</th>
            <th>Status</th>
            ${podeEditar ? '<th></th><th></th>' : ''}
        </tr>
        `;

        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        filtradas.forEach(o => {

            const dataP = o.dataPostagem ? new Date(o.dataPostagem).toLocaleDateString() : '-';
            const dataA = o.dataAcontecimento ? new Date(o.dataAcontecimento).toLocaleDateString() : '-';

            const btns = podeEditar ? `
                <td><a href="/adm/ocorrencias/${o.id}" class="btn btn-sm btn-primary"><i class="fa-solid fa-pencil"></i></a></td>
                <td>
                    <form action="/adm/ocorrencias/excluir/${o.id}" method="POST" onsubmit="return confirm('Tem certeza?');">
                        @csrf
                        @method('PUT')
                        <button type="submit" class="btn btn-sm btn-danger">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </form>
                </td>
            ` : '';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${o.id}</td>
                <td>${o.titulo}</td>
                <td>${o.usuario?.nome || '-'}</td>
                <td>${o.tipo}</td>
                <td>${dataP}</td>
                <td>${dataA}</td>
                <td>${o.latitude}</td>
                <td>${o.longitude}</td>
                <td>${o.descricao}</td>
                <td>${o.status}</td>
                ${btns}
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

});
</script>

@endsection
