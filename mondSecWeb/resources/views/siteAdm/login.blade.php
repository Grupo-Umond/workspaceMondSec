<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            padding: 40px;
        }
        .container {
            max-width: 350px;
            margin: 0 auto;
            background: white;
            padding: 20px 25px;
            border-radius: 6px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h2 {
            text-align: center;
            color: #444;
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-top: 15px;
            color: #666;
        }
        input[type="email"],
        input[type="senha"] {
            width: 100%;
            padding: 8px 10px;
            margin-top: 5px;
            border: 1px solid #bbb;
            border-radius: 4px;
            box-sizing: border-box;
            font-size: 14px;
        }
        button {
            margin-top: 20px;
            width: 100%;
            background-color: #28a745;
            border: none;
            padding: 12px;
            color: white;
            font-size: 16px;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover {
            background-color: #218838;
        }
        .error {
            margin-top: 10px;
            color: red;
            font-size: 13px;
        }
        .link-cadastro {
            margin-top: 15px;
            text-align: center;
            font-size: 14px;
        }
        .link-cadastro a {
            color: #007bff;
            text-decoration: none;
        }
        .link-cadastro a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>

    <div class="container">
        <h2>Login</h2>

        <form id="formLogin" action="{{ route('adm.login.submit') }}" method="POST">
            @csrf

            <label for="email">Email:</label>
            <input type="email" id="email" name="email" value="{{ old('email') }}" required autofocus>
            @error('email')
                <div class="error">{{ $message }}</div>
            @enderror

            <label for="senha">Senha:</label>
            <input type="password" id="senha" name="senha" required>
            @error('senha')
                <div class="error">{{ $message }}</div>
            @enderror

            <button type="submit">Entrar</button>
        </form>

        <div class="link-cadastro">
            Ainda não tem uma conta? <a href="{{ route('adm.store') }}">Cadastre-se aqui</a>
        </div>
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
