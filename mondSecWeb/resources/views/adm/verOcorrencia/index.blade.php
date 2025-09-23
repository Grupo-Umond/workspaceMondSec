@extends('adm.layouts.admin')

@section('title','View')

@section('content')

    <div id="lista-ocorrencias"></div>

    <script>
        const ocorrencias = @json($ocorrencia);

        const container = document.getElementById('lista-ocorrencias');
        container.innerHTML = ''; 

        ocorrencias.forEach(o => {
            const item = document.createElement('p');
            item.textContent = `${o.titulo} - Tipo: ${o.tipo.descricao} - Usuário: ${o.usuario.nome}`;
            container.appendChild(item);
        });
    </script>

@endsection