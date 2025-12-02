@extends('adm.layouts.admin')

@section('title', 'Usuários')

@section('content')
    <div class="container py-5">

        @php
            $podeEditar = in_array(auth('admin')->user()->nivelAdmin, ['prata', 'ouro']);
        @endphp

        <h1 class="mb-4 text-center">Usuários Cadastrados</h1>

        <div id="pesquisas" class="d-flex flex-wrap gap-3 mb-4">
            <input id="pesquisaUsuario" type="text" class="form-control w-auto" placeholder="Pesquisar por nome, e-mail ou ID">

            <select id="filtroGenero" class="form-select w-auto">
                <option value="">Todos os Gêneros</option>
            </select>

            <select id="filtroStatus" class="form-select w-auto">
                <option value="">Todos os Status</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
            </select>
        </div>

        <div id="lista-usuarios"></div>

        <div class="botoesFinais">
            <a href="{{ route('adm.dashboard.index') }}" class="link-btn">
                <div id="btnVoltar" class="botao mt-4">Voltar ao Painel</div>
            </a>
        </div>

    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function () {

            const usuarios = @json($usuario);
            const podeEditar = @json($podeEditar);

            const container = document.getElementById('lista-usuarios');
            const input = document.getElementById('pesquisaUsuario');
            const filtroGenero = document.getElementById('filtroGenero');
            const filtroStatus = document.getElementById('filtroStatus');

            const itensPorPagina = 10;
            let paginaAtual = 1;

            const generosUnicos = [...new Set(usuarios.map(u => u.genero || 'Não informado'))];
            generosUnicos.forEach(g => {
                const opt = document.createElement('option');
                opt.value = g;
                opt.textContent = g;
                filtroGenero.appendChild(opt);
            });

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

                if (end < totalPaginas) {
                    wrapper.appendChild(criarBotao(totalPaginas, totalPaginas));
                }

                wrapper.appendChild(
                    criarBotao("›", paginaAtual + 1, false, paginaAtual === totalPaginas)
                );

                return wrapper;
            }

            function renderTabela() {
                const termo = input.value.toLowerCase();
                const generoSelecionado = filtroGenero.value;
                const statusSelecionado = filtroStatus.value;

                let filtrados = usuarios.filter(u => {
                    const id = String(u.id).toLowerCase();
                    const nome = (u.nome || '').toLowerCase();
                    const email = (u.email || '').toLowerCase();
                    const genero = u.genero || 'Não informado';

                    return (
                        (id.includes(termo) || nome.includes(termo) || email.includes(termo)) &&
                        (!generoSelecionado || genero === generoSelecionado) &&
                        (!statusSelecionado || u.status === statusSelecionado)
                    );
                });

                container.innerHTML = '';

                if (filtrados.length === 0) {
                    container.innerHTML = '<div class="alert alert-warning">Nenhum usuário encontrado.</div>';
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
                        <th>ID</th><th>Nome</th><th>Email</th><th>Telefone</th>
                        <th>Gênero</th><th>Data</th><th>Status</th>
                        ${podeEditar ? '<th>Ação</th>' : ''}
                    </tr>
                `;
                table.appendChild(thead);

                const tbody = document.createElement('tbody');

                pagina.forEach(u => {
                    let btns = '';

                    if (podeEditar) {
                        if (u.status === 'inativo') {
                            btns = `
                                <form action="/adm/users/reativar/${u.id}" method="POST"
                                    onsubmit="return confirm('Reativar usuário?');">
                                    @csrf
                                    @method('PUT')
                                    <button type="submit" class="btn btn-sm btn-success">Ativar</button>
                                </form>
                            `;
                        } else {
                            btns = `
                                <form action="/adm/users/excluir/${u.id}" method="POST"
                                    onsubmit="return confirm('Excluir usuário?');">
                                    @csrf
                                    @method('PUT')
                                    <button type="submit" class="btn btn-sm btn-danger">
                                        <i class="fa-solid fa-trash-can"></i>
                                    </button>
                                </form>
                            `;
                        }
                    }

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${u.id}</td>
                        <td>${u.nome}</td>
                        <td>${u.email}</td>
                        <td>${u.telefone || '-'}</td>
                        <td>${u.genero || '-'}</td>
                        <td>${u.data ? new Intl.DateTimeFormat("pt-BR", {
                            day: "2-digit", month: "2-digit", year: "numeric",
                            hour: "2-digit", minute: "2-digit", second: "2-digit"
                        }).format(new Date(u.data)) : '-'}</td>
                        <td>${u.status || '-'}</td>
                        ${podeEditar ? `<td>${btns}</td>` : ''}
                    `;
                    tbody.appendChild(tr);
                });

                table.appendChild(tbody);
                container.appendChild(table);
                container.appendChild(gerarPaginacao(totalPaginas));
            }

            window.mudarPagina = function (num) {
                paginaAtual = num;
                renderTabela();
            };

            input.addEventListener('input', () => { paginaAtual = 1; renderTabela(); });
            filtroGenero.addEventListener('change', () => { paginaAtual = 1; renderTabela(); });
            filtroStatus.addEventListener('change', () => { paginaAtual = 1; renderTabela(); });

            renderTabela();
        });
    </script>
@endsection
