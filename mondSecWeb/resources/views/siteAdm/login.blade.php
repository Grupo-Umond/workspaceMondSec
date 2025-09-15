<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">

    <title>Login</title>

    <link rel="stylesheet" href="{{ asset('css/09loginADM.css') }}">

</head>

<body>

    <header>

        <nav>

            <h2> MONDSEC </h2>

            <h2> ADMINISTRADOR </h2>

        </nav>

    </header>


    <div class="container">
        <h2>Entrar</h2>

        <form id="formLogin" action="{{ route('adm.login.submit') }}" method="POST">
            @csrf

            <div class="input-grupo1">
                <input required class="campoEmail" type="email" id="email" name="email" value="{{ old('email') }}">
                <label class="emailLabel" for="email">
                    Email:
                </label>
                @error('email')
                    <div class="error">{{ $message }}</div>
                @enderror
            </div>

            <div class="input-grupo2">
            <input class="campoSenha" type="password" id="senha" name="senha" required>
            <label class="senhaLabel" for="senha">Senha:</label>
            @error('senha')
                <div class="error">{{ $message }}</div>
            @enderror
            </div>

            <button type="submit">Entrar</button>
        </form>

        <!-- <div class="link-cadastro">
            Ainda não tem uma conta? <a href="{{ route('adm.store') }}">Cadastre-se aqui</a>
        </div> -->
    </div>
    <script>
        const form = document.getElementById('formLogin');

        form.addEventListener('submit', function (event) {
            const email = document.getElementById('email');
            const senha = document.getElementById('senha');

            if(!email || !senha) {
                event.preventDefault();
                alert('Preencha os campos obrigatorios');
            }

            if(!regex.test(email)) {
                event.preventDefault();
                alert('Email invalido');
            }

            if(senha.length < 8) {
                event.preventDefault();
                alert('Digite uma senha com no minimo 8 digitos');
            }


        });
    </script>
</body>
</html>
