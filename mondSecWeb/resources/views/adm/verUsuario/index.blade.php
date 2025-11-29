@extends('adm.layouts.admin')

@section('title', 'View')

@section('content')
<div class="container py-5">

    @php
        $podeEditar = in_array(auth('admin')->user()->nivelAdmin, ['prata','ouro']);
    @endphp

    <h1 class="mb-4 text-center">Usuários Cadastrados</h1>

    <div id="pesquisas" class="d-flex flex-wrap gap-3 mb-4">
        <input id="pesquisaUsuario" type="text" class="form-control w-auto" placeholder="Pesquisar por nome, e-mail ou ID">
        <select id="filtroGenero" class="form-select w-auto">
            <option value="">Todos os Gêneros</option>
        </select>
    </div>

    <div id="lista-usuarios"></div>

    <a href="{{ route('adm.dashboard.index') }}" class="link-btn">
        <div id="btnVoltar" class="botao mt-4">Voltar ao Painel</div>
    </a>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {

    const usuarios = @json($usuario);
    const podeEditar = @json($podeEditar);

    const container = document.getElementById('lista-usuarios');
    const input = document.getElementById('pesquisaUsuario');
    const filtroGenero = document.getElementById('filtroGenero');

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

            return (
                (id.includes(termo) || nome.includes(termo) || email.includes(termo)) &&
                (!generoSelecionado || genero === generoSelecionado)
            );
        });

        container.innerHTML = '';

        if(filtrados.length === 0){
            container.innerHTML = '<div class="alert alert-warning">Nenhum usuário encontrado.</div>';
            return;
        }

        const table = document.createElement('table');
        table.classList.add('table','table-striped','table-bordered','text-center','align-middle');

        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>ID</th><th>Nome</th><th>Email</th><th>Telefone</th><th>Token Expo</th><th>Gênero</th><th>Data</th><th>Status</th>
                ${podeEditar ? '<th></th><th></th>' : ''}
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        filtrados.forEach(u => {

            const btns = podeEditar ? `
                <td>
                    <a href="/adm/users/${u.id}" class="btn btn-sm btn-primary"><i class="fa-solid fa-pencil"></i></a>
                </td>
                <td>
                    <form action="/adm/users/excluir/${u.id}" method="POST" onsubmit="return confirm('Tem certeza que quer excluir?');">
                        @csrf
                        @method('PUT')
                        <button type="submit" class="btn btn-sm btn-danger">
                            <i class="fa-solid fa-trash-can btn-excluir"></i>
                        </button>
                    </form>
                </td>
            ` : '';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${u.id}</td>
                <td>${u.nome}</td>
                <td>${u.email}</td>
                <td>${u.telefone || '-'}</td>
                <td>${u.tokenExpo}</td>
                <td>${u.genero || '-'}</td>
                <td>${u.data || '-'}</td>
                <td>${u.status || '-'}</td>
                ${btns}
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
