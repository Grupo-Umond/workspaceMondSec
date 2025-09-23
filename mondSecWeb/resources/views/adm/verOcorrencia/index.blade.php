@extends('adm.layouts.admin')

@section('title','View')

@section('content')

<div id="lista-ocorrencias"></div>

<script>
    console.log(@json($ocorrencia));
    const ocorrencias = @json($ocorrencia);

const container = document.getElementById('lista-ocorrencias');
container.innerHTML = '';

ocorrencias.forEach(o => {
    const tipo = o.tipo_ocorrencia ? o.tipo_ocorrencia.descricao : 'Sem tipo';
    const usuario = o.usuario ? o.usuario.nome : 'Sem usuário';
    const item = document.createElement('p');
    item.textContent = `${o.titulo} - Tipo: ${tipo} - Usuário: ${usuario}`;
    container.appendChild(item);
});

</script>

@endsection
