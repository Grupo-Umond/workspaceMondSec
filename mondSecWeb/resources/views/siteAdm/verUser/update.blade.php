<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Cadastro</title>

    <link rel="stylesheet" href="{{ asset('css/12UptadeADM.css') }}">

</head>
<body>
    <div class="container">
        <h2>Alterar Dados do Usuario</h2>

        @if(session('success'))
            <div class="success">{{ session('success') }}</div>
        @endif

        <form id="formUpdate" action="{{ route('adm.updateUser.submit', $usuario->id) }}" method="POST">
            @csrf
            @method('PUT')

            <label for="nome">Nome:</label>
            <input type="text" id="nome" name="nome" value="{{ old('nome', $usuario->nome) }}">
            @error('nome')
                <div class="error">{{ $message }}</div>
            @enderror

            <label for="email">Email:</label>
            <input type="email" id="email" name="email" value="{{ old('email', $usuaurio->email) }}">
            @error('email')
                <div class="error">{{ $message }}</div>
            @enderror

            <label for="telefone">Telefone:</label>
            <input type="telefone" id="telefone" name="telefone" value="{{ old('telefone', $suaurio->telefone) }}">
            @error('email')
                <div class="error">{{ $message }}</div>
            @enderror

            <label for="genero">Genero:</label>
            <select id="genero" name="genero">
                <option value="">-- Selecione --</option>
                <option value="Homem" {{ old('genero', $usuario->genero) == 'Homem' ? 'selected' : '' }}>Homem</option>
                <option value="Mulher" {{ old('genero', $usuario->genero) == 'Mulher' ? 'selected' : '' }}>Mulher</option>
                <option value="Prefiro Nao Informar" {{ old('genero', $usuario->genero) == 'Prefiro Nao Informar' ? 'selected' : '' }}>Prefiro Nao Informar</option>

            </select>
            @error('nivelAdmin')
                <div class="error">{{ $message }}</div>
            @enderror

            <button type="submit">Alterar</button>
        </form>
    </div>
    <script>
        const form = document.getElementById('formUpdate');

        form.addEventListener('submit', function(event) {
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const nivelAdmin = document.getElementById('genero').value;
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if(!nome || !email || !genero) {
                event.preventDefault();
                alert('Preencha todos os campos')
            }

            if(!regex.test(email)) {
                event.preventDefault();
                alert('Email invalido');
            }
        });
    </script>
</body>
</html>
