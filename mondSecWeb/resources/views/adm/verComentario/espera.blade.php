@extends('adm.layouts.admin')

@section('title', 'Comentários Pendentes')

@section('content')
<div class="container py-5">

    <h1 class="mb-4 text-center">Comentários Pendentes de Aprovação</h1>

    @if (session('success'))
        <div class="alert alert-success text-center">{{ session('success') }}</div>
    @endif

    @if ($comentarios->isEmpty())
        <div class="alert alert-warning text-center">
            Nenhum comentário aguardando aprovação.
        </div>
    @else
        <table class="table table-striped table-bordered text-center align-middle">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Mensagem</th>
                    <th>Usuário</th>
                    <th>Ocorrência</th>
                    <th>Data</th>
                    <th>Status</th>
                    <th>Aprovar</th>
                    <th>Negar</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($comentarios as $c)
                <tr>
                    <td>{{ $c->id }}</td>
                    <td>{{ $c->mensagem }}</td>
                    <td>{{ $c->usuario->nome ?? 'Desconhecido' }}</td>
                    <td>{{ $c->idOcorrencia }}</td>
                    <td>{{ $c->data }}</td>
                    <td>{{ $c->status }}</td>

                    <td>
                        <form method="POST" action="{{ route('adm.comentario.aprovar', $c->id) }}">
                            @csrf
                            @method('PUT')
                            <button class="btn btn-success w-100" onclick="return confirm('Aprovar este comentário?')">
                                Aprovar
                            </button>
                        </form>
                    </td>

                    <td>
                        <form method="POST" action="{{ route('adm.comentario.negar', $c->id) }}">
                            @csrf
                            @method('PUT')
                            <button class="btn btn-danger w-100" onclick="return confirm('Negar este comentário?')">
                                Negar
                            </button>
                        </form>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    <div class="text-center mt-4">
        <a href="{{ route('adm.dashboard.index') }}" class="btn btn-secondary">Voltar ao Painel</a>
    </div>

</div>
@endsection
