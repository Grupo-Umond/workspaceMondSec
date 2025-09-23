@extends('adm.layouts.admin')

@section('title','View')

@section('content')
<div class="container py-5">
        <h1 class="mb-4">Ocorrencias Cadastrados</h1>
        @method(`DELETE`)
        @if($ocorrencia->isEmpty())
            <div class="alert alert-warning">Nenhuma ocorrencia cadastrada.</div>
        @else
        @if($tipoocorrencia->isEmpty())
            <div class="alert alert-warning">Nenhuma ocorrencia cadastrado.</div>
        @else
            <table class="table table-striped table-bordered">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>TITULO</th>
                        <th>LATITUDE</th>
                        <th>LONGITUDE</th>
                        <th>USUARIO</th>
                        <th>TIPO OCORRENCIA</th>
                        <th>DATA OCORRENCIA</th>
                        <th class="as1"></th>
                        <th class="as"></th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($ocorrencia as $ocorrencias)
                        <tr>
                            <td>{{ $ocorrencias->id }}</td>
                            <td>{{ $ocorrencias->titulo }}</td>
                            <td>{{ $ocorrencias->latitude }}</td>
                            <td>{{ $ocorrencias->longitude }}</td>
                            <td>{{ $ocorrencias->data }}</td>
                            <td>{{ $ocorrencias->idUsuario }}</td>
                            <td>{{ $ocorrencias->idTipoOcorrencia }}</td>
                            @foreach($tipocorrencia as $tipocorrencias)
                                <td>{{ $tipocorrencia->descricao }}</td>
                            @endforeach
                            <td class="editarADM"><a href="{{ route('adm.ocorrencia.edit', $ocorrencia->id)}}">
                                    <i class="fa-solid fa-pencil"></i>
                                </a></td>

                            <td class="excluirADM">
                                <form action="{{ route('adm.ocorrencia.destroy', $ocorrencia->id) }}" method="POST"
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

        <a href="{{ route('adm.dashboard.index') }}" class="link-btn">
            <div class="botao">Voltar ao Painel</div>
        </a>
    </div>
@endsection