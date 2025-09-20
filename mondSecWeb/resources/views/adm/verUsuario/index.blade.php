@extends('adm.layouts.admin')

@section('title','View')

@section('content')
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
@endsection