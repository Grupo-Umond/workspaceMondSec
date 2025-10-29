@extends('adm.layouts.admin')

@section('title', 'Editar Ocorrência')

@section('content')
<div class="container">
    <h2>Alterar Dados da Ocorrência</h2>

    @if(session('success'))
        <div class="success">{{ session('success') }}</div>
    @endif

    <form id="formUpdate" action="{{ route('adm.ocorrencia.update', $ocorrencia->id) }}" method="POST">
        @csrf
        @method('PUT')

        <label for="titulo">Título da Ocorrência:</label>
        <input type="text" id="titulo" name="titulo" value="{{ old('titulo', $ocorrencia->titulo) }}">
        @error('titulo')
            <div class="error">{{ $message }}</div>
        @enderror


        <label for="descricao">Descrição:</label>
        <textarea id="descricao" name="descricao" rows="4">{{ old('descricao', $ocorrencia->descricao) }}</textarea>
        @error('descricao')
            <div class="error">{{ $message }}</div>
        @enderror

        <label for="dataAcontecimento">Data do Acontecimento:</label>
        <input type="date" id="dataAcontecimento" name="dataAcontecimento" value="{{ old('dataAcontecimento', $ocorrencia->dataAcontecimento) }}">
        @error('dataAcontecimento')
            <div class="error">{{ $message }}</div>
        @enderror

        <label for="longitude">Longitude:</label>
        <input type="text" id="longitude" name="longitude" value="{{ old('longitude', $ocorrencia->longitude) }}">
        @error('longitude')
            <div class="error">{{ $message }}</div>
        @enderror

        <label for="latitude">Latitude:</label>
        <input type="text" id="latitude" name="latitude" value="{{ old('latitude', $ocorrencia->latitude) }}">
        @error('latitude')
            <div class="error">{{ $message }}</div>
        @enderror

        <button type="submit">Salvar Alterações</button>
    </form>
</div>
@endsection
