@extends(adm.layouts.admin)

@section('title','Update')

@section('content')
    <div class="container">
        <h2>Alterar Dados do Administrador</h2>

        @if(session('success'))
            <div class="success">{{ session('success') }}</div>
        @endif

        <form id="formUpdate" action="{{ route('adm.updateAdm.submit', $admin->id) }}" method="POST">
            @csrf
            @method('PUT')

            <label for="nome">Nome:</label>
            <input type="text" id="nome" name="nome" value="{{ old('nome', $admin->nome) }}">
            @error('nome')
                <div class="error">{{ $message }}</div>
            @enderror

            <label for="email">Email:</label>
            <input type="email" id="email" name="email" value="{{ old('email', $admin->email) }}">
            @error('email')
                <div class="error">{{ $message }}</div>
            @enderror

            <label for="telefone">Telefone:</label>
            <input type="text" id="telefone" name="telefone" value="{{ old('telefone', $admin->telefone) }}">
            @error('email')
                <div class="error">{{ $message }}</div>
            @enderror

            <label for="nivelAdmin">Nível de Acesso:</label>
            <select id="nivelAdmin" name="nivelAdmin">
                <option value="">-- Selecione --</option>
                <option value="ouro" {{ old('nivelAdmin', $admin->nivelAdmin) == 'ouro' ? 'selected' : '' }}>Ouro</option>
                <option value="prata" {{ old('nivelAdmin', $admin->nivelAdmin) == 'prata' ? 'selected' : '' }}>Prata</option>
                <option value="bronze" {{ old('nivelAdmin', $admin->nivelAdmin) == 'bronze' ? 'selected' : '' }}>Bronze</option>

            </select>
            @error('nivelAdmin')
                <div class="error">{{ $message }}</div>
            @enderror

            <button type="submit">Alterar</button>
        </form>
    </div>
@endsection
