@extends('adm.layouts.admin')

@section('title', 'Update')

@section('content')

<body>
    <div id="conteudo-container" class="container">
        <h2>Alterar Comentário</h2>

        @if(session('success'))
            <div class="success">{{ session('success') }}</div>
        @endif

        <form id="formUpdate" action="{{ route('adm.comentario.update', $comentario->id) }}" method="POST">
            @csrf
            @method('PUT')

            <div class="conteudo-nome">
                <label for="mensagem">Mensagem</label>
                <textarea id="mensagem" name="mensagem" rows="4">{{ old('mensagem', $comentario->mensagem) }}</textarea>
                @error('mensagem')
                    <div class="error">{{ $message }}</div>
                @enderror
            </div>

            <div class="conteudo-email">
                <label for="idUsuario">Usuário</label>
                <input type="text" id="idUsuario" disabled value="{{ $comentario->usuario->nome ?? 'Desconhecido' }}">
            </div>

            <div class="conteudo-telefone">
                <label for="idOcorrencia">Ocorrência</label>
                <input type="text" id="idOcorrencia" disabled value="{{ $comentario->idOcorrencia }}">
            </div>

            <div class="conteudo-genero">
                <label for="data">Data</label>
                <input type="text" id="data" disabled value="{{ $comentario->data }}">
            </div>

            <div id="conteudo-alterar">
                <button id="btn-alterar" type="submit">Alterar</button>
            </div>
        </form>

        <a href="{{ route('adm.comentario.index') }}">
            <button class="btn btn-secondary mt-3">Voltar</button>
        </a>
    </div>
</body>

@endsection
