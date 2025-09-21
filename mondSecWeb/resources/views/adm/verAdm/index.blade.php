@extends(adm.layouts.admin)

@section('title','View')

@section('content')
    <div class="container py-5">
        <h1 class="mb-4">Admins Cadastrados</h1>
        @method(`DELETE`)
        @if($admins->isEmpty())
            <div class="alert alert-warning">Nenhum admin cadastrado.</div>
        @else
            <table>
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>Nivel de Acesso</th>
                        <th>Data de Criação</th>
                        <th class="as1"></th>
                        <th class="as"></th>
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
                            <td class="editarADM"><a href="{{ route('adm.admins.edit', $admin->id)}}">
                                    <i class="fa-solid fa-pencil"></i>
                                </a></td>
                                
                            <td class="excluirADM">
                                <form action="{{ route('adm.admins.destroy', $admin->id) }}" method="POST"
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
</body>
