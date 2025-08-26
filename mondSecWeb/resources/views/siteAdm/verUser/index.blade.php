<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8" />
    <title>Usuarios Cadastrados</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
</head>
<body class="bg-light">
    <div class="container py-5">
        <h1 class="mb-4">Usuarios Cadastrados</h1>
        @method(`DELETE`)
        @if($usuario->isEmpty())
            <div class="alert alert-warning">Nenhum usuario cadastrado.</div>
        @else
            <table class="table table-striped table-bordered">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>Genero</th>
                        <th>Data de Criação</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($usuario as $usuarios)
                        <tr>
                            <td>{{ $usuarios->id }}</td>
                            <td>{{ $usuarios->nome }}</td>
                            <td>{{ $usuarios->email }}</td>
                            <td>{{ $usuarios->telefone }}</td>
                            <td>{{ $usuarios->genero }}</td>
                            <td>{{ $usuarios->data }}</td>
                            <td><a href="{{ route('adm.updateUser', $usuarios->id)}}">Editar</a></td>
                            <td>
                            <form action="{{ route('adm.deleteUser', $usuarios->id) }}" method="POST" onsubmit="return confirm('Tem certeza que quer excluir?');">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-danger btn-sm">Excluir</button>
                            </form>
                        </td>

                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif

        <a href="{{ route('adm.dashboard') }}" class="btn btn-secondary mt-4">Voltar ao Painel</a>
    </div>
</body>
</html>
