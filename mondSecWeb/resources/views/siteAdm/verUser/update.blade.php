<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Cadastro</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f2f2f2;
            padding: 40px;
        }
        .container {
            max-width: 400px;
            background: white;
            padding: 20px;
            margin: 0 auto;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        h2 {
            text-align: center;
            margin-bottom: 20px;
            color: #333;
        }
        label {
            display: block;
            margin-top: 15px;
            color: #555;
        }
        input[type="text"],
        input[type="email"],
        input[type="senha"],
        select {
            width: 100%;
            padding: 8px 10px;
            margin-top: 5px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
            font-size: 14px;
        }
        button {
            margin-top: 20px;
            width: 100%;
            background-color: #007bff;
            color: white;
            border: none;
            padding: 12px;
            font-size: 16px;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover {
            background-color: #0056b3;
        }
        .success {
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            padding: 10px;
            margin-bottom: 15px;
            color: #155724;
            border-radius: 4px;
        }
        .error {
            color: red;
            margin-top: 5px;
            font-size: 13px;
        }
    </style>
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
            <input type="email" id="email" name="email" value="{{ old('email', $usuario->email) }}">
            @error('email')
                <div class="error">{{ $message }}</div>
            @enderror

            <label for="telefone">Telefone:</label>
            <input type="telefone" id="telefone" name="telefone" value="{{ old('telefone', $usuario->telefone) }}">
            @error('telefone')
                <div class="error">{{ $message }}</div>
            @enderror

            <label for="genero">Genero:</label>
            <select id="genero" name="genero">
                <option value="">-- Selecione --</option>
                <option value="Masculino" {{ old('genero', $usuario->genero) == 'Masculino' ? 'selected' : '' }}>Masculino</option>
                <option value="Feminino" {{ old('genero', $usuario->genero) == 'Feminino' ? 'selected' : '' }}>Feminino</option>
                <option value="Prefiro Não Informar" {{ old('genero', $usuario->genero) == 'Prefiro Não Informar' ? 'selected' : '' }}>Prefiro Não Informar</option>

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

            if(!regex.test(email)) {
                event.preventDefault();
                alert('Email invalido');
            }
        });
    </script>
</body>
</html>
