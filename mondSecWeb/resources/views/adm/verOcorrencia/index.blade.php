@extends('adm.layouts.admin')

@section('title','View')

@section('content')

<div id="lista-ocorrencias"></div>

<script>
    const ocorrencias = @json($ocorrencia);

    const container = document.getElementById('lista-ocorrencias');
    container.innerHTML = '';

    const table = document.createElement('table');
    table.style.width = '100%';
    table.setAttribute('border', '1');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const headers = ['Título', 'Usuário', 'Tipo', 'Data', 'Descrição'];
    headers.forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Cria o corpo da tabela
    const tbody = document.createElement('tbody');

    ocorrencias.forEach(o => {
        const row = document.createElement('tr');

        const titulo = o.titulo ? o.titulo : 'Sem título';
        const usuario = o.usuario ? o.usuario.nome : 'Sem usuário';
        const tipo = o.tipo_ocorrencia ? o.tipo_ocorrencia.categoria : 'Sem tipo';
        const data = o.data ? o.data : 'Sem data';
        const descricao = o.tipo_ocorrencia ? o.tipo_ocorrencia.descricao : 'Sem descrição';

        [titulo, usuario, tipo, data, descricao].forEach(text => {
            const td = document.createElement('td');
            td.textContent = text;
            row.appendChild(td);
        });

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);
</script>

@endsection
