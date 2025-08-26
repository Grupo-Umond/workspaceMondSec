<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8" />
    <title>Admins Cadastrados</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
</head>
<body class="bg-light">
    <div class="container py-5">
        <h1 class="mb-4">Admins Cadastrados</h1>
        @method(`DELETE`)
        @if($admins->isEmpty())
            <div class="alert alert-warning">Nenhum admin cadastrado.</div>
        @else
            <table class="table table-striped table-bordered">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>Nivel de Acesso</th>
                        <th>Data de Criação</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($admins as $admin)
                        <tr>
                            <td>{{ $admin->id }}</td>
                            <td>{{ $admin->nome }}</td>
                            <td>{{ $admin->email }}</td>
                            <td>{{ $admin->telefone }}</td>
                            <td>{{ $admin->nivelAdmin }}</td>
                            <td>{{ $admin->created_at->format('d/m/Y H:i') }}</td>
                            <td><a href="{{ route('adm.updateAdm', $admin->id)}}">Editar</a></td>
                            <td>
                            <form action="{{ route('adm.deleteAdm', $admin->id) }}" method="POST" onsubmit="return confirm('Tem certeza que quer excluir?');">
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
