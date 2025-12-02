@extends('adm.layouts.admin')

@section('title', 'Admins')

@section('content')
<div class="container py-5">
    <div class="parteCima">

        <h1 class="mb-4">Admins Cadastrados</h1>

        <div id="pesquisas" class="d-flex flex-wrap gap-3 mb-4">

            <input id="pesquisaAdmin" type="text" class="form-control w-auto"
                placeholder="Pesquisar por nome, e-mail ou ID">

            <select id="filtroNivel" class="form-select w-auto">
                <option value="">Todos os níveis</option>
            </select>

            <select id="filtroStatus" class="form-select w-auto">
                <option value="">Todos os status</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
            </select>

        </div>

        <div id="lista-admins"></div>

        <a href="{{ route('adm.dashboard.index') }}" class="btn btn-outline-primary mt-3">Voltar ao Painel</a>
        <a href="{{ route('adm.auth.register') }}" class="btn btn-outline-primary mt-3">Cadastrar Adm</a>

    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {

    const admins = @json($admins);

    const container = document.getElementById('lista-admins');
    const input = document.getElementById('pesquisaAdmin');
    const filtroNivel = document.getElementById('filtroNivel');
    const filtroStatus = document.getElementById('filtroStatus');

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
        const statusSelecionado = filtroStatus.value;

        const filtrados = admins.filter(a => {

            const id = String(a.id).toLowerCase();
            const nome = (a.nome || '').toLowerCase();
            const email = (a.email || '').toLowerCase();
            const nivel = a.nivelAdmin || 'Não informado';
            const status = (a.status || '').toLowerCase();

            const matchTexto =
                id.includes(termo) ||
                nome.includes(termo) ||
                email.includes(termo);

            const matchNivel =
                !nivelSelecionado || nivel === nivelSelecionado;

            const matchStatus =
                !statusSelecionado || status === statusSelecionado;

            return matchTexto && matchNivel && matchStatus;
        });

        container.innerHTML = '';

        if (filtrados.length === 0) {
            container.innerHTML = '<div class="alert alert-warning">Nenhum admin encontrado.</div>';
            return;
        }

        const table = document.createElement('table');
        table.classList.add('table', 'table-striped', 'table-bordered', 'text-center', 'align-middle');

        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>ID</th><th>Nome</th><th>Email</th><th>Telefone</th>
                <th>Nível de Acesso</th><th>Data de Criação</th><th>Status</th><th></th><th></th>
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        filtrados.forEach(a => {

            const podeEditar = ["prata", "ouro"].includes((a.nivelAdmin || "").toLowerCase());

            const tr = document.createElement('tr');

            const dataBruta = a.created_at;
            let dataFormatada = '-';

            if (dataBruta) {
                const data = new Date(dataBruta);
                dataFormatada = new Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit', second: '2-digit',
                }).format(data);
            }

            tr.innerHTML = `
                <td>${a.id}</td>
                <td>${a.nome}</td>
                <td>${a.email}</td>
                <td>${a.telefone || '-'}</td>
                <td>${a.nivelAdmin || '-'}</td>
                <td>${dataFormatada}</td>
                <td>${a.status || '-'}</td>

                <td>
                    ${podeEditar
                        ? `<a href="/adm/admins/${a.id}" class="btn btn-sm btn-warning">
                                <i class="fa-solid fa-pencil btn-alterar"></i>
                           </a>`
                        : `<span class="text-muted">—</span>`
                    }
                </td>

                <td>
                    ${podeEditar
                        ? (
                            a.status === "inativo"
                                ? `
                                   <form action="/adm/admins/reativar/${a.id}" method="POST"
                                         onsubmit="return confirm('Tem certeza que quer reativar?');">
                                        @csrf
                                        @method('PUT')
                                        <button type="submit" class="btn btn-sm btn-danger">
                                            <i>Ativar</i>
                                        </button>
                                   </form>
                                  `
                                : `
                                   <form action="/adm/admins/excluir/${a.id}" method="POST"
                                         onsubmit="return confirm('Tem certeza que quer excluir?');">
                                        @csrf
                                        @method('PUT')
                                        <button type="submit" class="btn btn-sm btn-danger">
                                            <i class="fa-solid fa-trash-can btn-excluir"></i>
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

        table.appendChild(tbody);
        container.appendChild(table);
    }

    input.addEventListener('input', renderTabela);
    filtroNivel.addEventListener('change', renderTabela);
    filtroStatus.addEventListener('change', renderTabela);

    renderTabela();
});
</script>
@endsection
