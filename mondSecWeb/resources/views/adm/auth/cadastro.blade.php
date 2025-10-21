
<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">

    <title>Login</title>

    <link rel="stylesheet" href="{{ asset('css/09loginADM.css') }}">

</head>

<body>

    <div class="parteEsquerda">

        <div class="logo">
                <!-- <img src="{{ asset('Imagens/Logos/umondlogoazul.png') }}" class="logo" alt="Logo"> -->
                <img src="{{ asset('Imagens/Logos/mondseclogo.png') }}" class="logo" alt="Logo">
        </div>

        <div class="container">
            <h2>Entrar</h2>

            <form id="formLogin" action="{{ route('adm.auth.login.store') }}" method="POST">
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

        </div>
        <div class="adicionais">
            <p>
                Copyright ©2025 MondSec, L.L.C MondSec é um produto de mondSec, L.L.C.
            </p>
            <div class="termos">
                <p>
                    termos de servico
                </p>
                <p> | </p>
                <p>
                    termos de privacidade
                </p>
            </div>
        </div>
    </div>
    <div class="parteDireita">
        <video controls autoplay muted loop>
            <source src="{{ asset('Videos/video3.mp4') }}" type="video/mp4">
        </video>
    </div>
    <script>
        const form = document.getElementById('formLogin');

        form.addEventListener('submit', function (event) {
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