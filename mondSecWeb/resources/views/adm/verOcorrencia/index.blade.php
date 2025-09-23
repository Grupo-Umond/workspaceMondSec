@extends('adm.layouts.admin')

@section('title','View')

@section('content')
<div class="container py-5">
        <h1 class="mb-4">Ocorrencias Cadastrados</h1>
        @method(`DELETE`)
        
        
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
                        <th>ID USUARIO</th>
                        <th>ID TIPO DA OCORRENCIA</th>
                        <th class="as1"></th>
                        <th class="as"></th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($ocorrencia as $ocorrencias)
                        <tr>
                            <td>{{ $ocorrencias->ocorrencias->id }}</td>
                            <td>{{ $ocorrencias->ocorrencias->titulo }}</td>
                            <td>{{ $ocorrencias->ocorrencias->latitude }}</td>
                            <td>{{ $ocorrencias->ocorrencias->longitude }}</td>
                            <td>{{ $ocorrencias->ocorrencias->data }}</td>
                            <td>{{ $ocorrencias->ocorrencias->idUsuario }}</td>
                            <td>{{ $ocorrencias->ocorrencias->idTipoOcorrencia }}</td>
                            
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
        

        <a href="{{ route('adm.dashboard.index') }}" class="link-btn">
            <div class="botao">Voltar ao Painel</div>
        </a>
    </div>
@endsection