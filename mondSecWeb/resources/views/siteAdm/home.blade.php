<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    @extends('layouts.app')

    @section('content')
    <div class="container">
        <h1>Painel Administrativo</h1>
        <p>Bem-vindo, {{ Auth::user()->name }}!</p>
    </div>
    @endsection

</body>
</html>