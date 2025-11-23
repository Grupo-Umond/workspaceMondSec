@extends('adm.layouts.admin')

@section('title', 'Comentários')

@section('content')
<div class="container py-5">

    <h1 class="mb-4 text-center">Comentários Registrados</h1>

    <div id="pesquisas" class="d-flex flex-wrap gap-3 mb-4 justify-content-center">
        <input id="pesquisaComentario" type="text" class="form-control w-auto" placeholder="Pesquisar por ID, mensagem, usuário ou ocorrência">
    </div>

    <div id="lista-comentarios"></div>

    <a href="{{ route('adm.dashboard.index') }}" class="link-btn">
        <div id="btnVoltar" class="botao mt-4">Voltar ao Painel</div>
    </a>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const comentarios = @json($comentarios);
    const container = document.getElementById('lista-comentarios');
    const input = document.getElementById('pesquisaComentario');

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
        if(filtrados.length === 0){
            container.innerHTML = '<div class="alert alert-warning">Nenhum comentário encontrado.</div>';
            return;
        }

        const table = document.createElement('table');
        table.classList.add('table','table-striped','table-bordered','text-center','align-middle');

        const thead = document.createElement('thead');
        thead.innerHTML = `<tr>
            <th>ID</th><th>Mensagem</th><th>Usuário</th><th>Ocorrência</th><th>Data</th><th>Status</th><th></th><th></th>
        </tr>`;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        filtrados.forEach(c => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${c.id}</td>
                <td>${c.mensagem}</td>
                <td>${c.usuario?.nome || 'Desconhecido'}</td>
                <td>${c.idOcorrencia}</td>
                <td>${c.data || '-'}</td>
                <td>${c.status || '-'}</td>
                <td>
                    <a href="/adm/comentario/${c.id}">
                        <i class="fa-solid fa-pencil btn-alterar"></i>
                    </a>
                </td>
                <td>
                    <form action="/adm/comentario/excluir/${c.id}" method="POST" onsubmit="return confirm('Tem certeza que quer excluir?');">
                        @csrf
                        @method('PUT')
                        <button type="submit" class="btn-excluirComentario">
                            <i class="fa-solid fa-trash-can btn-excluirUsuario"></i>
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
    renderTabela();
});
</script>
@endsection