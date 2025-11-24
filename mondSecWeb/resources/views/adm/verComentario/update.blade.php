@extends('adm.layouts.admin')

@section('title', 'Update Comentário')

@section('content')

<body>
    <div id="conteudo-container" class="container">
        <h2>Alterar Comentário</h2>

        @if(session('success'))
            <div class="success">{{ session('success') }}</div>
        @endif


        <form id="formUpdate" action="{{ route('adm.comentarios.update', $comentario->id) }}" method="POST">
            @csrf
            @method('PUT')

            {{-- MENSAGEM --}}
            <div class="conteudo-mensagem">
                <label for="mensagem">Mensagem</label>
                <textarea id="mensagem" name="mensagem" rows="4">{{ old('mensagem', $comentario->mensagem) }}</textarea>
                @error('mensagem')
                    <div class="error">{{ $message }}</div>
                @enderror
            </div>

            {{-- STATUS --}}
            <div class="conteudo-status">
                <label for="status">Status</label>
                <select id="status" name="status">
                    <option value="">-- Selecione --</option>
                    <option value="Ativo" {{ old('status', $comentario->status) == 'Ativo' ? 'selected' : '' }}>Ativo</option>
                    <option value="Inativo" {{ old('status', $comentario->status) == 'Inativo' ? 'selected' : '' }}>Inativo</option>
                </select>
                @error('status')
                    <div class="error">{{ $message }}</div>
                @enderror
            </div>

            <div class="conteudo-dono">
                <label>Usuário</label>
                <input type="text" value="{{ $comentario->usuario->nome }}" disabled>
            </div>

            {{-- OCORRÊNCIA (LEITURA) --}}
            <div class="conteudo-ocorrencia">
                <label>Ocorrência</label>
                <input type="text" value="{{ $comentario->ocorrencia->titulo ?? 'Sem título' }}" disabled>
            </div>

            <div id="conteudo-alterar">
                <button id="btn-alterar" type="submit">Alterar</button>
            </div>

        </form>
    </div>
@endsection
