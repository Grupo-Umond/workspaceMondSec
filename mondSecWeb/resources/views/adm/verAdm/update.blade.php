@extends('adm.layouts.admin')

@section('title', 'Update')

@section('content')
    <div id="conteudo-container" class="container">
        <h2>Alterar Dados do Administrador</h2>

        @if(session('success'))
            <div class="success">{{ session('success') }}</div>
        @endif

        <form id="formUpdate" action="{{ route('adm.admins.update', $admin->id) }}" method="POST">
            @csrf
            @method('PUT')

            <div class="conteudo-nome">
                <label for="nome">Nome</label>
                <br>
                <input type="text" id="nome" name="nome" value="{{ old('nome', $admin->nome) }}">
                @error('nome')
                    <div class="error">{{ $message }}</div>
                @enderror
            </div>

            <div class="conteudo-email">
                <label for="email">Email</label>
                <br>
                <input type="email" id="email" name="email" value="{{ old('email', $admin->email) }}">
                @error('email')
                    <div class="error">{{ $message }}</div>
                @enderror
            </div>

            <div class="conteudo-telefone">
                <label for="telefone">Telefone</label>
                <br>
                <input type="text" id="telefone" name="telefone" value="{{ old('telefone', $admin->telefone) }}">
                @error('email')
                    <div class="error">{{ $message }}</div>
                @enderror
            </div>

            <div class="conteudo-nivel">
                <label for="nivelAdmin">Nível de Acesso</label>
                <br>
                <select id="nivelAdmin" name="nivelAdmin">
                    <option value="">-- Selecione --</option>
                    <option value="ouro" {{ old('nivelAdmin', $admin->nivelAdmin) == 'ouro' ? 'selected' : '' }}>Ouro</option>
                    <option value="prata" {{ old('nivelAdmin', $admin->nivelAdmin) == 'prata' ? 'selected' : '' }}>Prata
                    </option>
                    <option value="bronze" {{ old('nivelAdmin', $admin->nivelAdmin) == 'bronze' ? 'selected' : '' }}>Bronze
                    </option>

                </select>
                @error('nivelAdmin')
                    <div class="error">{{ $message }}</div>
                @enderror
            </div>

            <div id="conteudo-alterar">
                <button id="btn-alterar" type="submit">Alterar</button>
            </div>
        </form>
    </div>
@endsection