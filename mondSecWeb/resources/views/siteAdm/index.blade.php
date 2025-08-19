<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <link rel="stylesheet" href="{{ asset('css/cssADM/00style.css') }}">

</head>

<body>
    <div class="telaLogin">
        <h1>Login</h1>
        <a href="{{ route('adm.login')}}">Login</a>
        
        <br>
        
        <a href="{{ route('adm.cadastro')}}">Registrar-se</a>
    </div>
</body>

</html>