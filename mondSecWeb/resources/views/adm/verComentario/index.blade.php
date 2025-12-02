@extends('adm.layouts.admin')

@section('title', 'Comentários')

@section('content')
    <div class="container py-5">

        <h1 class="mb-4 text-center">Comentários Registrados</h1>

        <div id="pesquisas" class="d-flex flex-wrap gap-3 mb-4">
            <input id="pesquisaComentario" type="text" class="form-control w-auto"
                placeholder="Pesquisar por ID, mensagem, usuário ou ocorrência">
        </div>

        @php
            $podeEditar = in_array(auth('admin')->user()->nivelAdmin, ['prata','ouro']);
        @endphp

        <div id="lista-comentarios"></div>

        <div class="botoesFinais">
            <a href="{{ route('adm.dashboard.index') }}" class="link-btn">
                <div id="btnVoltar" class="botao mt-4">Voltar ao Painel</div>
            </a>

            <a href="{{ route('adm.comentario.denuncia') }}" class="link-btn">
                <div id="btnVoltar" class="botao mt-4">Ver Denuncias</div>
            </a>

             <a href="{{ route('adm.comentario.espera') }}" class="link-btn">
                <div id="btnVoltar" class="botao mt-4">Espera de Comentarios</div>
            </a>
        </div>
    </div>

<script>
document.addEventListener('DOMContentLoaded', function () {
    const comentarios = @json($comentarios);
    const podeEditar = @json($podeEditar);

    const container = document.getElementById('lista-comentarios');
    const input = document.getElementById('pesquisaComentario');

    const itensPorPagina = 10;
    let paginaAtual = 1;

    function criarBotao(texto, pagina, ativo = false, disabled = false) {
        const btn = document.createElement("button");
        btn.textContent = texto;

        btn.style.padding = "8px 14px";
        btn.style.border = "none";
        btn.style.borderRadius = "6px";
        btn.style.background = ativo ? "#2ecc71" : "#111";
        btn.style.color = "#fff";
        btn.style.opacity = disabled ? 0.5 : 1;
        btn.style.cursor = disabled ? "default" : "pointer";

        if (!disabled) {
            btn.addEventListener("click", () => mudarPagina(pagina));
        }

        return btn;
    }

    function gerarPaginacao(totalPaginas) {
        const wrapper = document.createElement("div");
        wrapper.style.display = "flex";
        wrapper.style.justifyContent = "center";
        wrapper.style.alignItems = "center";
        wrapper.style.gap = "8px";
        wrapper.style.marginTop = "20px";

        wrapper.appendChild(
            criarBotao("‹", paginaAtual - 1, false, paginaAtual === 1)
        );

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
            wrapper.appendChild(
                criarBotao(i, i, i === paginaAtual)
            );
        }

        if (end < totalPaginas - 1) {
            const span = document.createElement("span");
            span.textContent = "...";
            span.style.color = "#fff";
            wrapper.appendChild(span);
        }

        if (end < totalPaginas) wrapper.appendChild(criarBotao(totalPaginas, totalPaginas));

        wrapper.appendChild(
            criarBotao("›", paginaAtual + 1, false, paginaAtual === totalPaginas)
        );

        return wrapper;
    }

    function renderTabela() {
        const termo = input.value.toLowerCase();

        const filtrados = comentarios.filter(c => {
            const id = String(c.id).toLowerCase();
            const mensagem = (c.mensagem || '').toLowerCase();
            const usuario = (c.usuario?.nome || 'Desconhecido').toLowerCase();
            const ocorrencia = String(c.idOcorrencia || '').toLowerCase();
            const status = String(c.status || '').toLowerCase();

            return (
                id.includes(termo) ||
                mensagem.includes(termo) ||
                usuario.includes(termo) ||
                ocorrencia.includes(termo) ||
                status.includes(termo)
            );
        });

        container.innerHTML = '';

        if (filtrados.length === 0) {
            container.innerHTML = '<div class="alert alert-warning">Nenhum comentário encontrado.</div>';
            return;
        }

        const totalPaginas = Math.ceil(filtrados.length / itensPorPagina);
        if (paginaAtual > totalPaginas) paginaAtual = 1;

        const inicio = (paginaAtual - 1) * itensPorPagina;
        const pagina = filtrados.slice(inicio, inicio + itensPorPagina);

        const table = document.createElement('table');
        table.classList.add('table', 'table-striped', 'table-bordered', 'text-center', 'align-middle');

        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>ID</th>
                <th>Mensagem</th>
                <th>Usuário</th>
                <th>Ocorrência</th>
                <th>Data</th>
                <th>Status</th>
                ${podeEditar ? '<th></th><th></th>' : ''}
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        pagina.forEach(c => {
            const btns = podeEditar ? `
                <td>
                    <a href="/adm/comentario/${c.id}" class="btn btn-sm btn-warning">
                        <i class="fa-solid fa-pencil"></i>
                    </a>
                </td>
                <td>
                    <form action="/adm/comentario/excluir/${c.id}" method="POST"
                          onsubmit="return confirm('Tem certeza que quer excluir?');">
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
                <td>${c.id}</td>
                <td>${c.mensagem}</td>
                <td>${c.usuario?.nome || 'Desconhecido'}</td>
                <td>${c.idOcorrencia}</td>
                <td>${c.data
                    ? new Intl.DateTimeFormat("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit"
                      }).format(new Date(c.data))
                    : "-"
                }</td>
                <td>${c.status || "-"}</td>
                ${btns}
            `;

            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        container.appendChild(table);

        container.appendChild(gerarPaginacao(totalPaginas));
    }

    window.mudarPagina = function(num) {
        paginaAtual = num;
        renderTabela();
    };

    input.addEventListener('input', () => {
        paginaAtual = 1;
        renderTabela();
    });

    renderTabela();
});
</script>
@endsection
