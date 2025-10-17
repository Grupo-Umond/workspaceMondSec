<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Cadastro</title>

    <link rel="stylesheet" href="{{ asset('css/11cadastroADM.css') }}">


</head>
<body>
    <div class="container">
        <h2>Cadastro de Administrador</h2>

        @if(session('success'))
            <div class="success">{{ session('success') }}</div>
        @endif

        <form id="formCadastro" action="{{ route('adm.store.submit') }}" method="POST">
            @csrf

            <label for="nome">Nome:</label>
            <input type="text" id="nome" name="nome" value="{{ old('nome') }}">
            @error('nome')
                <div class="error">{{ $message }}</div>
            @enderror

            <label for="email">Email:</label>
            <input type="email" id="email" name="email" value="{{ old('email') }}">
            @error('email')
                <div class="error">{{ $message }}</div>
            @enderror

            <label for="email">Telefone:</label>
            <input type="text" id="telefone" name="telefone" value="{{ old('email') }}">
            @error('email')
                <div class="error">{{ $message }}</div>
            @enderror

            <label for="senha">Senha:</label>
            <input type="password" id="senha" name="senha">
            @error('senha')
                <div class="error">{{ $message }}</div>
            @enderror

            <label for="senhaConfirma">Confirme a Senha:</label>
            <input type="password" id="senhaConfirma" name="senhaConfirma">

            <label for="nivelAdmin">Nível de Acesso:</label>
            <select id="nivelAdmin" name="nivelAdmin">
                <option value="">-- Selecione --</option>
                <option value="ouro" {{ old('nivel_acesso') == 'ouro' ? 'selected' : '' }}>Ouro</option>
                <option value="prata" {{ old('nivel_acesso') == 'prata' ? 'selected' : '' }}>Prata</option>
                <option value="bronze" {{ old('nivel_acesso') == 'bronze' ? 'selected' : '' }}>Bronze</option>
            </select>
            @error('nivel_acesso')
                <div class="error">{{ $message }}</div>
            @enderror

            <button type="submit">Cadastrar</button>
        </form>
    </div>
    <script>
        const form = document.getElementById('formCadastro');

        form.addEventListener('submit', function(event) {
            const nome = document.getElementById('nome').value;
            const senha = document.getElementById('senha').value;
            const confirmaSenha = document.getElementById('senhaConfirma').value;
            const email = document.getElementById('email').value;
            const nivelAdmin = document.getElementById('nivelAdmin').value;
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if(!nome || !senha || !confirmaSenha || !email || !nivelAdmin) {
                event.preventDefault();
                alert('Preencha todos os campos')
            }
            if(senha !== confirmaSenha) {
                event.preventDefault();
                alert('As senha não coincidem. Por favor, corrija.');
            }

            if(!regex.test(email)) {
                event.preventDefault();
                alert('Email invalido');
            }

            if(senha.length < 8 || confirmaSenha.length < 8) {
                event.preventDefault();
                alert('Senha deve ter mais de 8 digitos');
            }


        });
    </script>
</body>
</html>
