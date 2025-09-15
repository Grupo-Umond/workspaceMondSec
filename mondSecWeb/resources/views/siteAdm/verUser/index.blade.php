<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8" />
    <title>Usuarios Cadastrados</title>

    <link rel="stylesheet" href="{{ asset('css/15usuariosCadastrados.css') }}">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
        integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />

</head>

<body class="bg-light">

    <header>
        <nav>
            <a href="{{ route('adm.dashboard') }}"> <i class="fa-solid fa-house"></i> DashBoard</a>
            <a href=""> <i class="fa-solid fa-chart-simple"></i> Avaliações</a>
            <a href=""> <i class="fa-solid fa-comments"></i> Chat</a>
            <a href=""> <i class="fa-solid fa-magnifying-glass"></i> Status</a>
            <a href=""> <i class="fa-solid fa-magnifying-glass"></i> Views</a>
            <a href=""> <i class="fa-solid fa-magnifying-glass"></i> Transações</a>
            <a href="{{ route('adm.showadm') }}" class="btn btn-primary btn-lg flex-fill">Adiministradores</a>
            <a href="{{ route('adm.showuser') }}" class="btn btn-secondary btn-lg flex-fill">Usuários</a>
            <a href=""> <i class="fa-solid fa-gear"></i> Configurações</a>
        </nav>
    </header>

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
                        <th class="as1"></th>
                        <th class="as"></th>
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
                            <td class="editarADM"><a href="{{ route('adm.updateUser', $usuarios->id)}}">
                                    <i class="fa-solid fa-pencil"></i>
                                </a></td>

                            <td class="excluirADM">
                                <form action="{{ route('adm.deleteUser', $usuarios->id) }}" method="POST"
                                    onsubmit="return confirm('Tem certeza que quer excluir?');">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn-danger btn-sm">

                                        <i class="fa-solid fa-trash-can"></i>

                                    </button>
                                </form>
                            </td>

                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif

        <a href="{{ route('adm.dashboard') }}" class="link-btn">
            <div class="botao">Voltar ao Painel</div>
        </a>
    </div>
</body>

</html>