<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <title>Login</title>

    <link rel="stylesheet" href="{{ asset('css/cssADM/00style.css') }}">


</head>

<body>

    <div class="container">
        <h2>Login</h2>

        <form id="formLogin" action="{{ route('adm.login.submit') }}" method="POST">
            @csrf

            <div class="campo1">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" value="{{ old('email') }}" required autofocus>
                @error('email')
                <div class="error">{{ $message }}</div>
                @enderror
            </div>

            <br>

            <div class="campo2">
                <label for="senha">Senha:</label>
                <input type="password" id="senha" name="senha" required>
                @error('senha')
                <div class="error">{{ $message }}</div>
                @enderror
            </div>

            <br>

            <button type="submit">Entrar</button>
        </form>
        <!-- 
        <div class="link-cadastro">
            Ainda não tem uma conta? <a href="{{ route('adm.cadastro') }}">Cadastre-se aqui</a>
        </div> -->
    </div>
    <script>
        const form = document.getElementById('formLogin');

        form.addEventListener('submit', function(event) {
            const email = document.getElementById('email');
            const senha = document.getElementById('senha');

            if (!email || !senha) {
                event.preventDefault();
                alert('Preencha os campos obrigatorios');
            }

            if (!regex.test(email)) {
                event.preventDefault();
                alert('Email invalido');
            }

            if (senha.length < 8) {
                event.preventDefault();
                alert('Digite uma senha com no minimo 8 digitos');
            }


        });
    </script>
</body>

</html>