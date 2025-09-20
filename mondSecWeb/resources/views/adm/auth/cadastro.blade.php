<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Cadastro</title>

    <link rel="stylesheet" href="{{ asset('css/11cadastroADM.css') }}">


</head>
<body>

    <header>

        <nav>

            <h2> MONDSEC </h2>

            <h2> ADMINISTRADOR </h2>

        </nav>

    </header>

    <div class="container">
        <h2>Cadastro de Administrador</h2>

        @if(session('success'))
            <div class="success">{{ session('success') }}</div>
        @endif

        <form id="formCadastro" action="{{ route('adm.store.submit') }}" method="POST">
            @csrf

            <div class="input-grupo1">
            <input required class="campoNome" type="text" id="nome" name="nome" value="{{ old('nome') }}">
            <label class="nomeLabel" for="nome">Nome:</label>
            @error('nome')
                <div class="error">{{ $message }}</div>
            @enderror
            </div>

            <div class="input-grupo2">
            <input required class="campoEmail" type="email" id="email" name="email" value="{{ old('email') }}">
            <label class="emailLabel" for="email">Email:</label>
            @error('email')
                <div class="error">{{ $message }}</div>
            @enderror
            </div>

            <div class="input-grupo3">
            <input required class="campoTelefone" type="text" id="telefone" name="telefone" value="{{ old('email') }}">
            <label class="telefoneLabel" for="email">Telefone:</label>
            @error('email')
                <div class="error">{{ $message }}</div>
            @enderror
            </div>

            <div class="input-grupo4">
            <input required class="campoSenha" type="password" id="senha" name="senha">
            <label class="senhaLabel" for="senha">Senha:</label>
            @error('senha')
                <div class="error">{{ $message }}</div>
            @enderror
            </div>

            <div class="input-grupo5">
            <input required class="campoConfirmarSenha" type="password" id="senhaConfirma" name="senhaConfirma">
            <label class="senhaConfirmarLabel" for="senhaConfirma">Confirme a Senha:</label>
            </div>

            <div class="select-grupo6">
            <label class="acessoLabel" for="nivelAdmin">Nível de Acesso:</label>
            <select required class="campoAcesso" id="nivelAdmin" name="nivelAdmin">
                <!-- <option value="">Nível de acesso</option> -->
                <option value="ouro" {{ old('nivel_acesso') == 'ouro' ? 'selected' : '' }}>Ouro</option>
                <option value="prata" {{ old('nivel_acesso') == 'prata' ? 'selected' : '' }}>Prata</option>
                <option value="bronze" {{ old('nivel_acesso') == 'bronze' ? 'selected' : '' }}>Bronze</option>
            </select>
            @error('nivel_acesso')
                <div class="error">{{ $message }}</div>
            @enderror
            </div>

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
