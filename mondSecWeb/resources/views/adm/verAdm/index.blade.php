@extends('adm.layouts.admin')

@section('title', 'Admins')

@section('content')
    <div class="container py-5">
        <div class="parteCima">

            <h1 class="mb-4">Admins Cadastrados</h1>

            <select id="filtroStatus" class="form-select w-auto">
                <option value="">Todos os status</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
            </select>

        </div>

        <div id="pesquisas" class="d-flex flex-wrap gap-3 mb-4">

            {{-- PESQUISA --}}
            <input id="pesquisaAdmin" type="text" class="form-control w-auto"
                placeholder="Pesquisar por nome, e-mail ou ID">

            {{-- FILTRO DE NÍVEL --}}
            <select id="filtroNivel" class="form-select w-auto">
                <option value="">Todos os níveis</option>
            </select>

        </div>

        {{-- LISTA RENDERIZADA PELO JS --}}
        <div id="lista-admins"></div>

        <div class="botoesFinais">
            <a href="{{ route('adm.dashboard.index') }}" class="btn btn-outline-primary mt-3">Voltar ao Painel</a>
            <a href="{{ route('adm.auth.register') }}" class="btn btn-outline-primary mt-3">Cadastrar Adm</a>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const admins = @json($admins);
            const usuarioPodeEditar = @json(in_array(auth('admin')->user()->nivelAdmin, ['prata','ouro']));

            const container = document.getElementById('lista-admins');
            const input = document.getElementById('pesquisaAdmin');
            const filtroNivel = document.getElementById('filtroNivel');
            const filtroStatus = document.getElementById('filtroStatus');

            const itensPorPagina = 10;
            let paginaAtual = 1;

            // Preencher filtro de níveis
            const niveisUnicos = [...new Set(admins.map(a => a.nivelAdmin || 'Não informado'))];
            niveisUnicos.forEach(n => {
                const opt = document.createElement('option');
                opt.value = n;
                opt.textContent = n;
                filtroNivel.appendChild(opt);
            });

            // Botões de troca de página
            function criarBotao(texto, pagina, ativo = false, disabled = false) {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.textContent = texto;

                btn.style.padding = "8px 14px";
                btn.style.borderRadius = "6px";
                btn.style.border = "none";
                btn.style.background = ativo ? "#2ecc71" : "#111";
                btn.style.color = "#fff";
                btn.style.opacity = disabled ? 0.5 : 1;
                btn.style.cursor = disabled ? "default" : "pointer";

                if (!disabled) {
                    btn.addEventListener("click", () => mudarPagina(pagina));
                }

                return btn;
            }

            // Paginação
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
                    wrapper.appendChild(criarBotao(i, i, i === paginaAtual));
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

            // Renderização da tabela
            function renderTabela() {
                const termo = input.value.toLowerCase();
                const nivelSelecionado = filtroNivel.value;
                const statusSelecionado = filtroStatus.value;

                let filtrados = admins.filter(a => {
                    const matchTexto =
                        String(a.id).includes(termo) ||
                        (a.nome || '').toLowerCase().includes(termo) ||
                        (a.email || '').toLowerCase().includes(termo);

                    const matchNivel =
                        !nivelSelecionado || (a.nivelAdmin || 'Não informado') === nivelSelecionado;

                    const matchStatus =
                        !statusSelecionado || (a.status || '').toLowerCase() === statusSelecionado;

                    return matchTexto && matchNivel && matchStatus;
                });

                const totalPaginas = Math.ceil(filtrados.length / itensPorPagina);
                if (paginaAtual > totalPaginas) paginaAtual = 1;

                const inicio = (paginaAtual - 1) * itensPorPagina;
                const pagina = filtrados.slice(inicio, inicio + itensPorPagina);

                container.innerHTML = "";

                if (pagina.length === 0) {
                    container.innerHTML = '<div class="alert alert-warning">Nenhum admin encontrado.</div>';
                    return;
                }

                const table = document.createElement('table');
                table.classList.add('table', 'table-striped', 'table-bordered', 'text-center', 'align-middle');

                table.innerHTML = `
                <thead>
                    <tr>
                        <th>ID</th><th>Nome</th><th>Email</th><th>Telefone</th>
                        <th>Nível</th><th>Data</th><th>Status</th><th></th><th></th>
                    </tr>
                </thead>
                <tbody></tbody>
            `;

                const tbody = table.querySelector('tbody');

                pagina.forEach(a => {
                    let dataFormatada = "-";
                    if (a.created_at) {
                        dataFormatada = new Intl.DateTimeFormat('pt-BR', {
                            day: '2-digit', month: '2-digit', year: 'numeric',
                            hour: '2-digit', minute: '2-digit', second: '2-digit'
                        }).format(new Date(a.created_at));
                    }

                    const tr = document.createElement('tr');

                    tr.innerHTML = `
                    <td>${a.id}</td>
                    <td>${a.nome}</td>
                    <td>${a.email}</td>
                    <td>${a.telefone || '-'}</td>
                    <td>${a.nivelAdmin || '-'}</td>
                    <td>${dataFormatada}</td>
                    <td>${a.status || '-'}</td>

                    <td>
                        ${usuarioPodeEditar
                            ? `<a href="/adm/admins/${a.id}" class="btn btn-sm btn-warning">
                                    <i class="fa-solid fa-pencil"></i>
                               </a>`
                            : `<span class="text-muted">—</span>`
                        }
                    </td>

                    <td>
                        ${usuarioPodeEditar
                            ? (
                                a.status === "inativo"
                                    ? `
                                        <form action="/adm/admins/reativar/${a.id}" method="POST"
                                              onsubmit="return confirm('Tem certeza que quer reativar?');">
                                            @csrf
                                            @method('PUT')
                                            <button type="submit" class="btn btn-sm btn-success">
                                                Ativar
                                            </button>
                                        </form>
                                      `
                                    : `
                                        <form action="/adm/admins/excluir/${a.id}" method="POST"
                                              onsubmit="return confirm('Tem certeza que quer excluir?');">
                                            @csrf
                                            @method('PUT')
                                            <button type="submit" class="btn btn-sm btn-danger">
                                                <i class="fa-solid fa-trash-can"></i>
                                            </button>
                                        </form>
                                      `
                              )
                            : `<span class="text-muted">—</span>`
                        }
                    </td>
                `;

                    tbody.appendChild(tr);
                });

                container.appendChild(table);
                container.appendChild(gerarPaginacao(totalPaginas));
            }

            window.mudarPagina = function (num) {
                paginaAtual = num;
                renderTabela();
            };

            // Eventos
            input.addEventListener('input', () => { paginaAtual = 1; renderTabela(); });
            filtroNivel.addEventListener('change', () => { paginaAtual = 1; renderTabela(); });
            filtroStatus.addEventListener('change', () => { paginaAtual = 1; renderTabela(); });

            renderTabela();
        });
    </script>
@endsection
