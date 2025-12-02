@extends('adm.layouts.admin')

@section('title', 'Ocorrências Cadastradas')

@section('content')
<div class="container py-5">

    <h1 class="mb-4 text-center">Ocorrências Cadastradas</h1>

    @php
        $podeEditar = in_array(auth('admin')->user()->nivelAdmin, ['prata', 'ouro']);
    @endphp

    <div id="pesquisas" class="d-flex flex-wrap gap-3 mb-4">

        <input id="pesquisado" type="text" class="form-control w-auto"
            placeholder="Pesquisar por ID, título ou usuário">

        <select id="filtroTipo" class="form-select w-auto">
            <option value="">Todos os Tipos</option>
        </select>

        <select id="filtroStatus" class="form-select w-auto">
            <option value="">Todos os Status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
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
document.addEventListener("DOMContentLoaded", function () {

    const ocorrencias = @json($ocorrencias);
    const podeEditar = @json($podeEditar);

    const filtroStatus = document.getElementById('filtroStatus');
    const container = document.getElementById("lista-ocorrencias");
    const inputPesquisa = document.getElementById("pesquisado");
    const filtroTipo = document.getElementById("filtroTipo");
    const filtroMes = document.getElementById("filtroMes");

    let paginaAtual = 1;
    const itensPorPagina = 10;
    let filtradas = [];

    // Normalizar tipos e criar opções
    const tiposUnicos = [...new Set(
        ocorrencias.map(o => (o.tipo || "Não informado").trim())
    )];

    tiposUnicos.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t;
        opt.textContent = t;
        filtroTipo.appendChild(opt);
    });

    function aplicarFiltros() {
        const termo = inputPesquisa.value.toLowerCase();
        const tipoSelecionado = filtroTipo.value;
        const mesSelecionado = filtroMes.value;
        const statusSelecionado = filtroStatus.value;

        filtradas = ocorrencias.filter(o => {
            const id = String(o.id);
            const titulo = (o.titulo || "").toLowerCase();
            const usuario = String(o.usuario?.nome || "").toLowerCase();
            const tipo = (o.tipo || "Não informado").trim();

            const dataAco = o.dataAcontecimento ? new Date(o.dataAcontecimento) : null;
            const mes = dataAco ? dataAco.getMonth() + 1 : null;

            return (
                (id.includes(termo) || titulo.includes(termo) || usuario.includes(termo)) &&
                (!tipoSelecionado || tipo === tipoSelecionado) &&
                (!mesSelecionado || mes === Number(mesSelecionado)) &&
                (!statusSelecionado || o.status === statusSelecionado)
            );
        });
    }

    function criarBotao(texto, pagina, ativo = false, disabled = false) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = texto;

        btn.style.padding = "8px 14px";
        btn.style.borderRadius = "6px";
        btn.style.border = "none";
        btn.style.background = ativo ? "#888888" : "#111";
        btn.style.color = "#fff";
        btn.style.opacity = disabled ? 0.5 : 1;
        btn.style.cursor = disabled ? "default" : "pointer";

        if (!disabled) {
            btn.addEventListener("click", () => {
                paginaAtual = pagina;
                renderTabela();
            });
        }

        return btn;
    }

    function renderTabela() {
        aplicarFiltros();

        paginaAtual = Math.min(paginaAtual, Math.ceil(filtradas.length / itensPorPagina) || 1);

        container.innerHTML = "";

        if (filtradas.length === 0) {
            container.innerHTML = `<div class="alert alert-warning">Nenhuma ocorrência encontrada.</div>`;
            return;
        }

        const totalPaginas = Math.ceil(filtradas.length / itensPorPagina);

        const inicio = (paginaAtual - 1) * itensPorPagina;
        const dadosPagina = filtradas.slice(inicio, inicio + itensPorPagina);

        const table = document.createElement("table");
        table.classList.add("table", "table-bordered", "table-striped", "text-center");

        table.innerHTML = `
            <thead>
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
                    ${podeEditar ? "<th></th><th></th>" : ""}
                </tr>
            </thead>
        `;

        const tbody = document.createElement("tbody");

        dadosPagina.forEach(o => {

            const formatter = new Intl.DateTimeFormat("pt-BR", {
                day: "2-digit", month: "2-digit", year: "numeric",
                hour: "2-digit", minute: "2-digit", second: "2-digit"
            });

            const dataP = o.dataPostagem ? formatter.format(new Date(o.dataPostagem)) : '-';
            const dataA = o.dataAcontecimento ? formatter.format(new Date(o.dataAcontecimento)) : '-';

            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${o.id}</td>
                <td>${o.titulo}</td>
                <td>${o.usuario?.nome || "-"}</td>
                <td>${o.tipo}</td>
                <td>${dataP}</td>
                <td>${dataA}</td>
                <td>${o.latitude}</td>
                <td>${o.longitude}</td>
                <td>${o.descricao}</td>
                <td>${o.status}</td>

                ${podeEditar ? `
                    <td>
                        <a href="/adm/ocorrencias/${o.id}" class="btn btn-warning btn-sm">
                            <i class="fa-solid fa-pencil"></i>
                        </a>
                    </td>

                    <td>
                        ${
                            o.status === "inativo"
                            ? `
                                <form action="/adm/ocorrencias/reativar/${o.id}" method="POST" onsubmit="return confirm('Tem certeza?');">
                                    @csrf
                                    @method('PUT')
                                    <button type="submit" class="btn btn-success btn-sm">Ativar</button>
                                </form>
                              `
                            : `
                                <form action="/adm/ocorrencias/excluir/${o.id}" method="POST" onsubmit="return confirm('Tem certeza?');">
                                    @csrf
                                    @method('PUT')
                                    <button type="submit" class="btn btn-danger btn-sm">
                                        <i class="fa-solid fa-trash-can"></i>
                                    </button>
                                </form>
                              `
                        }
                    </td>
                ` : ""}
            `;

            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        container.appendChild(table);

        renderPaginacao(totalPaginas);
    }

    function renderPaginacao(totalPaginas) {
        const existente = container.querySelector(".pagination-wrapper");
        if (existente) existente.remove();


        const wrapper = document.createElement("div");
        wrapper.classList.add("pagination-wrapper");
        wrapper.style.display = "flex";
        wrapper.style.justifyContent = "center";
        wrapper.style.alignItems = "center";
        wrapper.style.gap = "8px";
        wrapper.style.marginTop = "20px";

        wrapper.appendChild(criarBotao("‹", paginaAtual - 1, false, paginaAtual === 1));

        const maxButtons = 5;
        let start = Math.max(1, paginaAtual - 2);
        let end = Math.min(totalPaginas, start + maxButtons - 1);

        if (end - start < maxButtons - 1) {
            start = Math.max(1, end - maxButtons + 1);
        }

        if (start > 1) wrapper.appendChild(criarBotao("1", 1));
        if (start > 2) {
            const span = document.createElement("span");
            span.textContent = "...";
            span.style.color = "#fff";
            wrapper.appendChild(span);
        }

        for (let i = start; i <= end; i++) {
            wrapper.appendChild(criarBotao(i, i, i === paginaAtual));
        }

        if (end < totalPaginas - 1) {
            const span = document.createElement("span");
            span.textContent = "...";
            span.style.color = "#fff";
            wrapper.appendChild(span);
        }

        if (end < totalPaginas) wrapper.appendChild(criarBotao(totalPaginas, totalPaginas));

        wrapper.appendChild(criarBotao("›", paginaAtual + 1, false, paginaAtual === totalPaginas));

        container.appendChild(wrapper);
    }

    inputPesquisa.addEventListener("input", () => {
        paginaAtual = 1;
        renderTabela();
    });

    filtroTipo.addEventListener("change", () => {
        paginaAtual = 1;
        renderTabela();
    });

    filtroMes.addEventListener("change", () => {
        paginaAtual = 1;
        renderTabela();
    });

    filtroStatus.addEventListener("change", () => {
        paginaAtual = 1;
        renderTabela();
    });

    renderTabela();
});
</script>

@endsection
